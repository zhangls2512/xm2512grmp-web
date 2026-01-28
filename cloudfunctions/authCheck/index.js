'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const argon2 = require('argon2')
  const axios = require('axios')
  const crypto = require('crypto')
  const ipaddr = require('ipaddr.js')
  const nodemailer = require('nodemailer')
  const { sm4 } = require('sm-crypto-v2')
  const speakeasy = require('speakeasy')
  const { nanoid } = await import('nanoid')
  const app = tcb.init()
  const db = app.database()
  const nodemailertransport = nodemailer.createTransport({
    host: 'smtp.qq.com',
    secure: true,
    auth: {
      user: 'zhangls2512@vip.qq.com',
      pass: process.env.mailtoken
    }
  })
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
            errFix: '无修复建议'
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
            errFix: '无修复建议'
          }
        }
        if (Date.now() > data.timeStamp + 300000) {
          return {
            errCode: 3011,
            errMsg: '邮箱验证码已过期',
            errFix: '无修复建议'
          }
        }
        if (data.used) {
          return {
            errCode: 3012,
            errMsg: '邮箱验证码已使用',
            errFix: '无修复建议'
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
        }
        const accountres = await db.collection('account').where({
          email: checkdata.email
        }).get()
        if (accountres.data.length > 0) {
          const data = accountres.data[0]
          return {
            errCode: 0,
            errMsg: '成功',
            account: data
          }
        }
        return {
          errCode: 3000,
          errMsg: '邮箱未注册账号',
          errFix: '无修复建议'
        }
      }
      return {
        errCode: 3010,
        errMsg: '邮箱验证码错误',
        errFix: '无修复建议'
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
            errFix: '无修复建议'
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
            errFix: '无修复建议'
          }
        }
        return {
          errCode: 0,
          errMsg: '成功',
          account: data
        }
      }
      return {
        errCode: 3000,
        errMsg: '邮箱未注册账号',
        errFix: '无修复建议'
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
            errFix: '无修复建议'
          }
        }
        if (data.passwordVerifyTimes >= 5) {
          return {
            errCode: 3032,
            errMsg: '密码错误尝试次数过多',
            errFix: '无修复建议'
          }
        }
        if (!await argon2.verify(password, checkdata.code)) {
          if (data.passwordVerifyTimes == 4) {
            nodemailertransport.sendMail({
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
            errFix: '无修复建议'
          }
        }
        return {
          errCode: 0,
          errMsg: '成功',
          account: data
        }
      }
      return {
        errCode: 3000,
        errMsg: '邮箱未注册账号',
        errFix: '无修复建议'
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
            errFix: '无修复建议'
          }
        }
        if (checkdata.code != data.accessToken) {
          return {
            errCode: 3040,
            errMsg: '无效的accessToken',
            errFix: '无修复建议'
          }
        }
        if (Date.now() > data.endDate) {
          return {
            errCode: 3041,
            errMsg: 'accessToken已过期',
            errFix: '无修复建议'
          }
        }
        if (!event.service.every(item => data.service.includes(item))) {
          return {
            errCode: 3002,
            errMsg: '产品/功能未开通',
            errFix: '无修复建议'
          }
        }
        const permission = data.permission
        if (!event.permission.every(item => permission[item] === true || permission[item] === undefined || (typeof (permission[item]) == 'number' && Date.now() > permission[item]))) {
          return {
            errCode: 3003,
            errMsg: '权限被封禁',
            errFix: '联系客服'
          }
        }
        return {
          errCode: 0,
          errMsg: '成功',
          account: data
        }
      }
      return {
        errCode: 3040,
        errMsg: '无效的accessToken',
        errFix: '无修复建议'
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
            errFix: '无修复建议'
          }
        }
        const accesskeys = data.accessKey
        const accesskeyvalues = accesskeys.map(item => item.value)
        if (!accesskeyvalues.includes(checkdata.code)) {
          return {
            errCode: 3050,
            errMsg: '无效的accessKey',
            errFix: '无修复建议'
          }
        }
        const accesskeyinfo = accesskeys.find(item => item.value == checkdata.code)
        if (Date.now() > accesskeyinfo.endDate && accesskeyinfo.endDate != 0) {
          return {
            errCode: 3051,
            errMsg: 'accessKey已过期',
            errFix: '无修复建议'
          }
        }
        if (!accesskeyinfo.status) {
          return {
            errCode: 3052,
            errMsg: 'accessKey未启用',
            errFix: '无修复建议'
          }
        }
        if (!accesskeyinfo.allowApi.includes(event.apiName)) {
          return {
            errCode: 3053,
            errMsg: 'accessKey无此接口调用权限',
            errFix: '无修复建议'
          }
        }
        if (!accesskeyinfo.allowIp.some(item => ipaddr.parse(checkdata.requestIp).match(ipaddr.parseCIDR(item)))) {
          return {
            errCode: 3054,
            errMsg: '请求IP不在IP白名单内',
            errFix: '无修复建议'
          }
        }
        if (!event.service.every(item => data.service.includes(item))) {
          return {
            errCode: 3002,
            errMsg: '产品/功能未开通',
            errFix: '无修复建议'
          }
        }
        const permission = data.permission
        if (!event.permission.every(item => permission[item] === true || permission[item] === undefined || (typeof (permission[item]) == 'number' && Date.now() > permission[item]))) {
          return {
            errCode: 3003,
            errMsg: '权限被封禁',
            errFix: '联系客服'
          }
        }
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
      return {
        errCode: 3050,
        errMsg: '无效的accessKey',
        errFix: '无修复建议'
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
            errFix: '无修复建议'
          }
        }
        const permission = data.permission
        if (!event.permission.every(item => permission[item] === true || permission[item] === undefined || (typeof (permission[item]) == 'number' && Date.now() > permission[item]))) {
          return {
            errCode: 3003,
            errMsg: '权限被封禁',
            errFix: '联系客服'
          }
        }
        return {
          errCode: 0,
          errMsg: '成功',
          account: data
        }
      }
      return {
        errCode: 3000,
        errMsg: '账号不存在',
        errFix: '无修复建议'
      }
    }
    if (event.type == 'passkey') {
      const passkeyres = await db.collection('externalaccount').where({
        openid: checkdata.credentialid,
        platform: 'passkey'
      }).get()
      if (passkeyres.data.length == 0) {
        return {
          errCode: 3061,
          errMsg: 'ID为credentialId的passkey未绑定账号',
          errFix: '无修复建议'
        }
      }
      function base64url(buffer) {
        let binary = ''
        const bytes = new Uint8Array(buffer)
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      }
      function base64urlToBuffer(base64url) {
        let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
        const padlength = (4 - (base64.length % 4)) % 4
        base64 += '='.repeat(padlength)
        return Buffer.from(base64, 'base64')
      }
      const authenticatordatabuffer = base64urlToBuffer(checkdata.authenticatordata)
      const signcount = authenticatordatabuffer.readUInt32BE(33)
      if (!Number.isInteger(signcount) || (signcount <= passkeyres.data[0].signCount && passkeyres.data[0].signCount != 0)) {
        return {
          errCode: 3060,
          errMsg: 'signCount校验失败',
          errFix: '无修复建议'
        }
      }
      const clientdatajsonbuffer = base64urlToBuffer(checkdata.clientdatajson)
      if (JSON.parse(new TextDecoder().decode(new Uint8Array(clientdatajsonbuffer))).challenge != base64url(new TextEncoder().encode(String(Date.now()).slice(0, -5) + '00000'))) {
        return {
          errCode: 3060,
          errMsg: 'challenge校验失败',
          errFix: '无修复建议'
        }
      }
      const publickey = crypto.createPublicKey({
        key: base64urlToBuffer(passkeyres.data[0].publicKey),
        format: 'der',
        type: 'spki'
      })
      const signaturebuffer = base64urlToBuffer(checkdata.signature)
      const clientdatahash = crypto.createHash('sha256').update(clientdatajsonbuffer).digest()
      const datatoverify = Buffer.concat([authenticatordatabuffer, clientdatahash])
      const verify = crypto.createVerify('sha256')
      verify.update(datatoverify)
      if (!verify.verify(publickey, signaturebuffer)) {
        return {
          errCode: 3060,
          errMsg: 'signature校验失败',
          errFix: '无修复建议'
        }
      }
      await db.collection('externalaccount').where({
        openid: checkdata.credentialid,
        platform: 'passkey'
      }).update({
        signCount: signcount
      })
      const uid = passkeyres.data[0].uid
      const accountres = await db.collection('account').where({
        _id: uid
      }).get()
      return {
        errCode: 0,
        errMsg: '成功',
        account: accountres.data[0]
      }
    }
    if (event.type == 'ticket') {
      const ticketres = await db.collection('ticket').where({
        ticket: checkdata.code
      }).get()
      if (ticketres.data.length == 0) {
        return {
          errCode: 3060,
          errMsg: 'ticket不存在',
          errFix: '无修复建议'
        }
      }
      const ticket = ticketres.data[0]
      if (ticket.endDate < Date.now()) {
        return {
          errCode: 3061,
          errMsg: 'ticket已过期',
          errFix: '无修复建议'
        }
      }
      if (!ticket.uid) {
        return {
          errCode: 3062,
          errMsg: 'ticket未确认',
          errFix: '无修复建议'
        }
      }
      await db.collection('ticket').where({
        _id: ticket._id
      }).remove()
      const accountres = await db.collection('account').where({
        _id: ticket.uid
      }).get()
      return {
        errCode: 0,
        errMsg: '成功',
        account: accountres.data[0]
      }
    }
    if (event.type == 'sslwxxcx') {
      const wxres = await axios.get('https://api.weixin.qq.com/sns/jscode2session?appid=wxd46f84216a1a856e&secret=' + process.env.sslappsecret + '&js_code=' + checkdata.code + '&grant_type=authorization_code')
      if (wxres.data.errcode) {
        return {
          errCode: 3060,
          errMsg: 'code校验失败，原因：' + wxres.data.errmsg,
          errFix: '无修复建议'
        }
      }
      const externalaccount = await db.collection('externalaccount').where({
        openid: wxres.data.openid,
        platform: 'sslwxxcx'
      }).get()
      if (externalaccount.data.length == 0) {
        return {
          errCode: 3061,
          errMsg: '此外部平台账号未绑定账号',
          errFix: '无修复建议'
        }
      }
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
    if (event.type == 'huaweiaipasswordmemoapp') {
      let clientid = ''
      let clientsecret = ''
      if (event.type == 'huaweiaipasswordmemoapp') {
        clientid = '6917568345502278703'
        clientsecret = process.env.huaweiaipasswordmemoappclientsecret
      }
      try {
        const huaweitokenres = await axios.post('https://oauth-login.cloud.huawei.com/oauth2/v3/token', null, {
          params: {
            grant_type: 'authorization_code',
            client_id: clientid,
            client_secret: clientsecret,
            code: checkdata.code
          }
        })
        const huaweitokeninfores = await axios.post('https://oauth-api.cloud.huawei.com/rest.php?nsp_fmt=JSON&nsp_svc=huawei.oauth2.user.getTokenInfo', null, {
          params: {
            access_token: huaweitokenres.data.access_token
          }
        })
        await axios.post('https://oauth-login.cloud.huawei.com/oauth2/v3/revoke', null, {
          params: {
            token: huaweitokenres.data.access_token
          }
        })
        const externalaccount = await db.collection('externalaccount').where({
          openid: huaweitokeninfores.data.union_id,
          platform: 'huawei'
        }).get()
        if (externalaccount.data.length == 0) {
          if (!event.register) {
            return {
              errCode: 3061,
              errMsg: '此外部平台账号未绑定账号',
              errFix: '无修复建议'
            }
          }
          if (event.register) {
            const addres = await db.collection('account').add({
              accessKey: [],
              accessToken: '',
              duration: 7,
              email: '',
              endDate: 0,
              mfa: '',
              password: '',
              passwordVerifyTimes: 0,
              permission: {
                account: true,
                admin: false,
                password: true,
                resource: true,
                resourcecreator: false,
                smdztj: true,
                ssl: true,
                todo: true
              },
              service: []
            })
            const accesstoken = addres.id + '\0' + nanoid(60)
            const encryptaccesstoken = sm4.encrypt(accesstoken, process.env.key)
            await db.collection('account').where({
              _id: addres.id
            }).update({
              accessToken: encryptaccesstoken,
              endDate: Date.now() + 172800000
            })
            await db.collection('externalaccount').add({
              openid: huaweitokeninfores.data.union_id,
              platform: 'huawei',
              uid: addres.id
            })
            const accountres = await db.collection('account').where({
              _id: addres.id
            }).get()
            return {
              errCode: 0,
              errMsg: '成功',
              account: accountres.data[0]
            }
          }
        }
        const uid = externalaccount.data[0].uid
        const accountres = await db.collection('account').where({
          _id: uid
        }).get()
        return {
          errCode: 0,
          errMsg: '成功',
          account: accountres.data[0]
        }
      } catch (err) {
        return {
          errCode: 3060,
          errMsg: 'code校验失败，原因：' + err.response.data.error_description,
          errFix: '无修复建议'
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