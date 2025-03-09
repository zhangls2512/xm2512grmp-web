'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const argon2 = require('argon2')
  const axios = require('axios')
  const ipaddr = require('ipaddr.js')
  const nodemailer = require('nodemailer')
  const { sm4 } = require('sm-crypto-v2')
  const speakeasy = require('speakeasy')
  const app = tcb.init()
  const db = app.database()
  const mailerconfig = {
    host: 'smtp.qq.com',
    secure: true,
    auth: {
      user: 'zhangls2512@vip.qq.com',
      pass: process.env.mailtoken
    }
  }
  try {
    const checkdata = event.data
    if (event.type == 'emailcode') {
      const res = await db.collection('emailcode').where({
        email: checkdata.email
      }).get()
      if (res.data.length > 0) {
        const data = res.data[0]
        if (data.verifyTimes >= 5) {
          return {
            errCode: 3013,
            errMsg: '邮箱验证码错误尝试次数过多',
            errFix: '获取新的邮箱验证码'
          }
        }
        if (checkdata.code != data.emailCode) {
          if (Date.now() <= data.timeStamp + 300000 && !data.used && data.verifyTimes < 5) {
            db.collection('emailcode').where({
              email: checkdata.email
            }).update({
              verifyTimes: db.command.inc(1)
            })
          }
          return {
            errCode: 3010,
            errMsg: '邮箱验证码错误',
            errFix: '传递正确的邮箱验证码'
          }
        }
        if (Date.now() > data.timeStamp + 300000) {
          return {
            errCode: 3011,
            errMsg: '邮箱验证码已过期',
            errFix: '获取新的邮箱验证码'
          }
        }
        if (data.used) {
          return {
            errCode: 3012,
            errMsg: '邮箱验证码已使用',
            errFix: '获取新的邮箱验证码'
          }
        }
        await db.collection('emailcode').where({
          email: checkdata.email
        }).update({
          used: true
        })
        if (event.permission === false) {
          return {
            errCode: 0,
            errMsg: '成功'
          }
        } else {
          const res = await db.collection('account').where({
            email: checkdata.email
          }).get()
          if (res.data.length > 0) {
            const data = res.data[0]
            return {
              errCode: 0,
              errMsg: '成功',
              account: data
            }
          } else {
            return {
              errCode: 3000,
              errMsg: '邮箱未注册账号',
              errFix: '为邮箱注册账号'
            }
          }
        }
      } else {
        return {
          errCode: 3010,
          errMsg: '邮箱验证码错误',
          errFix: '传递正确的邮箱验证码'
        }
      }
    }
    if (event.type == 'mfa') {
      const res = await db.collection('account').where({
        email: checkdata.email
      }).get()
      if (res.data.length > 0) {
        const data = res.data[0]
        const mfa = data.mfa
        if (!mfa) {
          return {
            errCode: 3021,
            errMsg: '账号未设置MFA',
            errFix: '使用其他验证方式'
          }
        }
        const result = speakeasy.totp.verify({
          secret: mfa,
          encoding: 'base32',
          token: checkdata.code
        })
        if (!result) {
          return {
            errCode: 3020,
            errMsg: 'MFA错误',
            errFix: '传递正确的MFA'
          }
        }
        return {
          errCode: 0,
          errMsg: '成功',
          account: data
        }
      } else {
        return {
          errCode: 3000,
          errMsg: '邮箱未注册账号',
          errFix: '为邮箱注册账号'
        }
      }
    }
    if (event.type == 'password') {
      const res = await db.collection('account').where({
        email: checkdata.email
      }).get()
      if (res.data.length > 0) {
        const data = res.data[0]
        const password = data.password
        if (!password) {
          return {
            errCode: 3031,
            errMsg: '账号未设置密码',
            errFix: '使用其他验证方式'
          }
        }
        if (data.passwordVerifyTimes >= 5) {
          return {
            errCode: 3032,
            errMsg: '密码错误尝试次数过多',
            errFix: '使用其他验证方式'
          }
        }
        if (!await argon2.verify(password, checkdata.code)) {
          if (data.passwordVerifyTimes == 4) {
            nodemailer.createTransport(mailerconfig).sendMail({
              from: 'zhangls2512@vip.qq.com',
              to: checkdata.email,
              subject: '轩铭2512统一账号停用密码验证方式通知',
              text: '您的账号密码错误尝试次数过多，为了保证账号安全，密码验证方式已停用，使用其他验证方式修改密码后可恢复。'
            })
          }
          if (data.passwordVerifyTimes < 5) {
            db.collection('account').where({
              _id: data._id
            }).update({
              passwordVerifyTimes: db.command.inc(1)
            })
          }
          return {
            errCode: 3030,
            errMsg: '密码错误',
            errFix: '传递正确的密码'
          }
        }
        return {
          errCode: 0,
          errMsg: '成功',
          account: data
        }
      } else {
        return {
          errCode: 3000,
          errMsg: '邮箱未注册账号',
          errFix: '为邮箱注册账号'
        }
      }
    }
    if (event.type == 'accesstoken') {
      const accesstoken = sm4.decrypt(checkdata.code, process.env.key).split('\0')
      const uid = accesstoken[0]
      const res = await db.collection('account').where({
        _id: uid
      }).get()
      if (res.data.length > 0) {
        const data = res.data[0]
        if (data.accessToken == '已冻结') {
          return {
            errCode: 3001,
            errMsg: '账号已冻结',
            errFix: '解冻账号'
          }
        }
        if (checkdata.code != data.accessToken) {
          return {
            errCode: 3040,
            errMsg: '无效的accessToken',
            errFix: '传递有效的accessToken'
          }
        }
        if (Date.now() > data.endDate) {
          return {
            errCode: 3041,
            errMsg: 'accessToken已过期',
            errFix: '获取新的accessToken'
          }
        }
        if (!event.service.every(item => data.service.includes(item))) {
          return {
            errCode: 3002,
            errMsg: '产品/功能未开通',
            errFix: '开通产品/功能'
          }
        }
        const permission = data.permission
        if (!event.permission.every(item => permission[item] === true || permission[item] === undefined || (typeof (permission[item]) == 'number' && Date.now() > permission[item]))) {
          return {
            errCode: 3003,
            errMsg: '权限被封禁',
            errFix: '联系客服'
          }
        } else {
          return {
            errCode: 0,
            errMsg: '成功',
            account: data
          }
        }
      } else {
        return {
          errCode: 3040,
          errMsg: '无效的accessToken',
          errFix: '传递有效的accessToken'
        }
      }
    }
    if (event.type == 'accesskey') {
      const accesskey = sm4.decrypt(checkdata.code, process.env.key).split('\0')
      const uid = accesskey[0]
      const res = await db.collection('account').where({
        _id: uid
      }).get()
      if (res.data.length > 0) {
        const data = res.data[0]
        if (data.accessToken == '已冻结') {
          return {
            errCode: 3001,
            errMsg: '账号已冻结',
            errFix: '解冻账号'
          }
        }
        const accesskeys = data.accessKey
        const accesskeyvalues = accesskeys.map(item => item.value)
        if (!accesskeyvalues.includes(checkdata.code)) {
          return {
            errCode: 3050,
            errMsg: '无效的accessKey',
            errFix: '传递有效的accessKey'
          }
        }
        const accesskeyinfo = accesskeys.find(item => item.value == checkdata.code)
        if (Date.now() > accesskeyinfo.endDate && accesskeyinfo.endDate != 0) {
          return {
            errCode: 3051,
            errMsg: 'accessKey已过期',
            errFix: '延长到期时间'
          }
        }
        if (!accesskeyinfo.status) {
          return {
            errCode: 3052,
            errMsg: 'accessKey未启用',
            errFix: '启用accessKey'
          }
        }
        if (!accesskeyinfo.allowApi.includes(event.apiName)) {
          return {
            errCode: 3053,
            errMsg: 'accessKey无此接口调用权限',
            errFix: '开启此接口调用权限'
          }
        }
        if (!accesskeyinfo.allowIp.some(item => ipaddr.parse(checkdata.requestIp).match(ipaddr.parseCIDR(item)))) {
          return {
            errCode: 3054,
            errMsg: '请求IP不在IP白名单内',
            errFix: '使用在IP白名单内的IP请求'
          }
        }
        if (!event.service.every(item => data.service.includes(item))) {
          return {
            errCode: 3002,
            errMsg: '产品/功能未开通',
            errFix: '开通产品/功能'
          }
        }
        const permission = data.permission
        if (!event.permission.every(item => permission[item] === true || permission[item] === undefined || (typeof (permission[item]) == 'number' && Date.now() > permission[item]))) {
          return {
            errCode: 3003,
            errMsg: '权限被封禁',
            errFix: '联系客服'
          }
        } else {
          accesskeys.forEach(item => {
            if (item.value == checkdata.code) {
              item.lastUsedDate = Date.now()
            }
          })
          await db.collection('account').where({
            _id: uid
          }).update({
            accessKey: accesskeys
          })
          return {
            errCode: 0,
            errMsg: '成功',
            account: data
          }
        }
      } else {
        return {
          errCode: 3050,
          errMsg: '无效的accessKey',
          errFix: '传递有效的accessKey'
        }
      }
    }
    if (event.type == 'cloudfunction') {
      const res = await db.collection('account').where({
        _id: checkdata.uid
      }).get()
      if (res.data.length > 0) {
        const data = res.data[0]
        if (!event.service.every(item => data.service.includes(item))) {
          return {
            errCode: 3002,
            errMsg: '产品/功能未开通',
            errFix: '开通产品/功能'
          }
        }
        const permission = data.permission
        if (!event.permission.every(item => permission[item] === true || permission[item] === undefined || (typeof (permission[item]) == 'number' && Date.now() > permission[item]))) {
          return {
            errCode: 3003,
            errMsg: '权限被封禁',
            errFix: '联系客服'
          }
        } else {
          return {
            errCode: 0,
            errMsg: '成功',
            account: data
          }
        }
      } else {
        return {
          errCode: 3000,
          errMsg: '账号不存在',
          errFix: '传递有效的uid'
        }
      }
    }
    if (event.type == 'sslwxxcx') {
      const wxres = await axios.get('https://api.weixin.qq.com/sns/jscode2session?appid=wxd46f84216a1a856e&secret=' + process.env.sslappsecret + '&js_code=' + checkdata.code + '&grant_type=authorization_code')
      if (wxres.data.errcode) {
        return {
          errCode: 3060,
          errMsg: 'code校验错误，错误信息：' + wxres.data.errmsg,
          errFix: '传递有效的code参数'
        }
      } else {
        const externalaccount = await db.collection('externalaccount').where({
          openid: wxres.data.openid,
          platform: 'sslwxxcx'
        }).get()
        if (externalaccount.data.length == 0) {
          return {
            errCode: 3061,
            errMsg: '此外部平台账号未绑定账号',
            errFix: '传递绑定账号的外部平台账号的code'
          }
        } else {
          const uid = externalaccount.data[0].uid
          const accountres = await db.collection('account').where({
            _id: uid
          }).get()
          return {
            errCode: 0,
            errMsg: '成功',
            account: accountres.data[0]
          }
        }
      }
    }
  } catch {
    return {
      errCode: 5000,
      errMsg: '内部错误',
      errFix: '联系客服'
    }
  }
}