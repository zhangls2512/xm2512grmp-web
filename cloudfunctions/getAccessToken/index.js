'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const https = require('https')
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
    requestip = event.headers['x-real-ip']
    useragent = event.headers['user-agent']
    if (event.httpMethod != 'POST') {
      return {
        errCode: 1000,
        errMsg: '请求方法错误',
        errFix: '使用POST方法请求'
      }
    }
    try {
      requestdata = JSON.parse(event.body)
    } catch {
      return {
        errCode: 5000,
        errMsg: '内部错误',
        errFix: '联系客服'
      }
    }
  }
  try {
    const validtypes = ['emailcode', 'mfa', 'password', 'passkey', 'sslwxxcx', 'huaweiaipasswordmemoapp']
    if (!validtypes.includes(requestdata.verifyType)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的verifyType参数'
      }
    }
    let verifytype = requestdata.verifyType
    let verifytypetext = ''
    if (verifytype == 'emailcode') {
      verifytypetext = '邮箱验证码'
    }
    if (verifytype == 'mfa') {
      verifytypetext = 'MFA'
    }
    if (verifytype == 'password') {
      verifytypetext = '密码'
    }
    if (verifytype == 'passkey') {
      verifytypetext = '通行密钥'
    }
    if (verifytype == 'sslwxxcx') {
      verifytypetext = 'SSL证书（微信小程序）'
    }
    if (verifytype == 'huaweiaipasswordmemoapp') {
      verifytype = 'huawei'
      verifytypetext = '华为账号'
    }
    let verifycode = ''
    let rawId = ''
    let authenticatorData = ''
    let clientDataJSON = ''
    let signature = ''
    if (verifytype == 'passkey') {
      if (typeof (requestdata.rawId) != 'string' || !requestdata.rawId) {
        return {
          errCode: 1001,
          errMsg: '请求参数错误',
          errFix: '传递有效的rawId参数'
        }
      }
      if (typeof (requestdata.authenticatorData) != 'string' || !requestdata.authenticatorData) {
        return {
          errCode: 1001,
          errMsg: '请求参数错误',
          errFix: '传递有效的authenticatorData参数'
        }
      }
      if (typeof (requestdata.clientDataJSON) != 'string' || !requestdata.clientDataJSON) {
        return {
          errCode: 1001,
          errMsg: '请求参数错误',
          errFix: '传递有效的clientDataJSON参数'
        }
      }
      if (typeof (requestdata.signature) != 'string' || !requestdata.signature) {
        return {
          errCode: 1001,
          errMsg: '请求参数错误',
          errFix: '传递有效的signature参数'
        }
      }
      rawId = requestdata.rawId
      authenticatorData = requestdata.authenticatorData
      clientDataJSON = requestdata.clientDataJSON
      signature = requestdata.signature
    } else {
      if (typeof (requestdata.verifyCode) != 'string') {
        return {
          errCode: 1001,
          errMsg: '请求参数错误',
          errFix: '传递有效的verifyCode参数'
        }
      }
      verifycode = requestdata.verifyCode
    }
    let email = ''
    const platforms = ['passkey', 'sslwxxcx', 'huaweiaipasswordmemoapp']
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
          code: verifycode,
          rawId: rawId,
          authenticatorData: authenticatorData,
          clientDataJSON: clientDataJSON,
          signature: signature
        },
        permission: []
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const account = res.result.account
      if (!account) {
        return {
          errCode: 8000,
          errMsg: '未获取到账号的accessToken',
          errFix: '请稍后再试，如仍有此问题请联系客服'
        }
      }
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
      let ipaddress = '未知'
      if (requestip) {
        try {
          const data = await httpsget('https://ip.cn/ip/' + requestip + '.html')
          ipaddress = data.match(/<span\s+id="tab0_address"\s*>(.*?)<\/span>/)[1]
        } catch (err) {
          await nodemailer.createTransport(mailerconfig).sendMail({
            from: 'zhangls2512@vip.qq.com',
            to: '2300990296@qq.com',
            subject: '获取IP归属地失败通知',
            text: '获取IP归属地失败。\n' + err.stack
          })
        }
        function httpsget(url) {
          return new Promise((resolve, reject) => {
            https.get(url, (res) => {
              let data = ''
              res.on('data', (chunk) => {
                data += chunk
              })
              res.on('end', () => {
                resolve(data)
              })
            }).on('error', (err) => {
              reject(err)
            })
          })
        }
      }
      if (!requestip) {
        requestip = '未知'
      }
      await db.collection('loginlog').add({
        date: Date.now(),
        ip: requestip,
        ipAddress: ipaddress,
        verifyType: verifytype,
        ua: useragent,
        uid: account._id
      })
      await nodemailer.createTransport(mailerconfig).sendMail({
        from: 'zhangls2512@vip.qq.com',
        to: account.email,
        subject: '轩铭2512统一账号登录提醒',
        text: '您的账号于北京时间' + moment().tz('Asia/Shanghai').format('YYYY年MM月DD日 HH:mm') + '登录。\n' + '验证方式：' + verifytypetext + '\n' + '登录地点：' + ipaddress + '（IP：' + requestip + '）'
      })
      return {
        errCode: 0,
        errMsg: '成功',
        accessToken: accesstoken,
        uid: account._id,
        email: account.email,
        endDate: enddate
      }
    }
  } catch (err) {
    await nodemailer.createTransport(mailerconfig).sendMail({
      from: 'zhangls2512@vip.qq.com',
      to: '2300990296@qq.com',
      subject: '登录接口内部错误通知',
      text: '登录接口内部错误。\n' + err.stack
    })
    return {
      errCode: 5000,
      errMsg: '内部错误',
      errFix: '联系客服'
    }
  }
}