'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const axios = require('axios')
  const moment = require('moment-timezone')
  const nodemailer = require('nodemailer')
  const { sm4 } = require('sm-crypto-v2')
  const validator = require('validator')
  const { nanoid } = await import('nanoid')
  const mailerconfig = {
    host: 'smtp.qq.com',
    secure: true,
    auth: {
      user: 'zhangls2512@vip.qq.com',
      pass: process.env.mailtoken
    }
  }
  const app = tcb.init()
  const auth = app.auth()
  const issdk = (auth.getUserInfo().isAnonymous || auth.getUserInfo().openId)
  const db = app.database()
  let requestdata = ''
  let requestip = ''
  let useragent = ''
  if (issdk) {
    requestdata = event
    requestip = auth.getClientIP()
    useragent = event.userAgent
  } else {
    requestdata = JSON.parse(event.body)
    requestip = event.headers['x-real-ip']
    useragent = event.headers['user-agent']
    if (event.httpMethod != 'POST') {
      return {
        errCode: 1000,
        errMsg: '请求方法错误',
        errFix: '使用POST方法请求'
      }
    }
  }
  try {
    const validtypes = ['emailcode', 'mfa', 'password', 'sslwxxcx', 'huaweiaipasswordmemoapp']
    if (!validtypes.includes(requestdata.verifyType)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的verifyType参数'
      }
    }
    let verifytypetext
    if (requestdata.verifyType == 'emailcode') {
      verifytypetext = '邮箱验证码'
    }
    if (requestdata.verifyType == 'mfa') {
      verifytypetext = 'MFA'
    }
    if (requestdata.verifyType == 'password') {
      verifytypetext = '密码'
    }
    if (requestdata.verifyType == 'sslwxxcx') {
      verifytypetext = 'SSL证书（微信小程序）'
    }
    if (requestdata.verifyType == 'huaweiaipasswordmemoapp') {
      verifytypetext = '华为账号'
    }
    if (typeof (requestdata.verifyCode) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的verifyCode参数'
      }
    }
    let email = ''
    const platforms = ['sslwxxcx', 'huaweiaipasswordmemoapp']
    if (!platforms.includes(requestdata.verifyType)) {
      if (typeof (requestdata.email) != 'string' || !validator.isEmail(requestdata.email)) {
        return {
          errCode: 1001,
          errMsg: '请求参数错误',
          errFix: '传递有效的email参数'
        }
      }
      email = requestdata.email
      if (requestdata.verifyType == 'emailcode' && requestdata.verifyCode.length != 8) {
        return {
          errCode: 1001,
          errMsg: '请求参数错误',
          errFix: '传递有效的verifyCode参数'
        }
      }
      if (requestdata.verifyType == 'mfa' && requestdata.verifyCode.length != 6) {
        return {
          errCode: 1001,
          errMsg: '请求参数错误',
          errFix: '传递有效的verifyCode参数'
        }
      }
      if (requestdata.verifyType == 'password' && (requestdata.verifyCode.length < 8 || requestdata.verifyCode.length > 30)) {
        return {
          errCode: 1001,
          errMsg: '请求参数错误',
          errFix: '传递有效的verifyCode参数'
        }
      }
    }
    const res = await app.callFunction({
      name: 'authCheck',
      data: {
        type: requestdata.verifyType,
        data: {
          email: email,
          code: requestdata.verifyCode
        },
        permission: []
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const account = res.result.account
      if (account.accessToken == '已冻结') {
        return {
          errCode: 3001,
          errMsg: '账号已冻结',
          errFix: '解冻账号'
        }
      }
      let accesstoken = account.accessToken
      const enddate = Date.now() + account.duration * 86400000
      if (Date.now() > account.endDate) {
        const outaccesstoken = account._id + '\0' + nanoid(60)
        accesstoken = sm4.encrypt(outaccesstoken, process.env.key)
      }
      await db.collection('account').where({
        _id: account._id
      }).update({
        accessToken: accesstoken,
        endDate: enddate
      })
      const ipconfig = await axios.get('https://api.vore.top/api/IPdata?ip=' + requestip)
      const ipaddress = ipconfig.data.ipdata.info1 + ' ' + ipconfig.data.ipdata.info2 + ' ' + ipconfig.data.ipdata.info3 + ' ' + ipconfig.data.ipdata.isp
      await db.collection('loginlog').add({
        date: Date.now(),
        ip: requestip,
        ipAddress: ipaddress,
        verifyType: requestdata.verifyType,
        ua: useragent,
        uid: account._id
      })
      if (!email) {
        email = account.email
      }
      await nodemailer.createTransport(mailerconfig).sendMail({
        from: 'zhangls2512@vip.qq.com',
        to: email,
        subject: '轩铭2512统一账号登录提醒',
        text: '您的账号于北京时间' + moment().tz('Asia/Shanghai').format('YYYY年MM月DD日 HH:mm') + '登录。\n' + '验证方式：' + verifytypetext + '\n' + '登录地点：' + ipaddress + '（IP：' + requestip + '）'
      })
      return {
        errCode: 0,
        errMsg: '成功',
        accessToken: accesstoken,
        endDate: account.endDate
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