'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const https = require('https')
  const moment = require('moment-timezone')
  const nodemailer = require('nodemailer')
  const { sm4 } = require('sm-crypto-v2')
  const validator = require('validator')
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
  if (event.httpMethod != 'POST') {
    return {
      errCode: 1000,
      errMsg: '请求方法错误',
      errFix: '使用POST方法请求'
    }
  }
  const requestdata = JSON.parse(event.body)
  const validtypes = ['emailcode', 'mfa', 'password', 'passkey', 'ticket', 'sslwxxcx', 'huaweiaipasswordmemoapp', 'huaweiaitodoapp']
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
  if (verifytype == 'ticket') {
    verifytypetext = '票证'
  }
  if (verifytype == 'sslwxxcx') {
    verifytypetext = 'SSL证书（微信小程序）'
  }
  if (verifytype == 'huaweiaipasswordmemoapp' || verifytype == 'huaweiaitodoapp') {
    verifytype = 'huawei'
    verifytypetext = '华为账号'
  }
  let verifycode = ''
  let credentialid = ''
  let authenticatordata = ''
  let clientdatajson = ''
  let signature = ''
  if (verifytype == 'passkey') {
    if (typeof (requestdata.credentialId) != 'string' || !requestdata.credentialId) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的credentialId参数'
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
    credentialid = requestdata.credentialId
    authenticatordata = requestdata.authenticatorData
    clientdatajson = requestdata.clientDataJSON
    signature = requestdata.signature
  } else {
    if (typeof (requestdata.verifyCode) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的verifyCode参数'
      }
    }
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
    if (requestdata.verifyType == 'password' && (requestdata.verifyCode.length < 8 || requestdata.verifyCode.length > 32)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的verifyCode参数'
      }
    }
    if (requestdata.verifyType == 'ticket' && requestdata.verifyCode.length != 60) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的verifyCode参数'
      }
    }
    verifycode = requestdata.verifyCode
  }
  let email = ''
  const platforms = ['passkey', 'ticket', 'sslwxxcx', 'huaweiaipasswordmemoapp', 'huaweiaitodoapp']
  if (!platforms.includes(requestdata.verifyType)) {
    if (typeof (requestdata.email) != 'string' || !validator.isEmail(requestdata.email)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的email参数'
      }
    }
    email = requestdata.email
  }
  const res = await app.callFunction({
    name: 'authCheck',
    data: {
      type: requestdata.verifyType,
      data: {
        email: email,
        code: verifycode,
        credentialid: credentialid,
        authenticatordata: authenticatordata,
        clientdatajson: clientdatajson,
        signature: signature
      },
      permission: [],
      register: true
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
        errFix: '无修复建议'
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
    try {
      const data = await httpsget('https://ip.cn/ip/' + event.headers['x-real-ip'] + '.html')
      ipaddress = data.match(/<span\s+id="tab0_address"\s*>(.*?)<\/span>/)[1]
    } catch (err) {
      await nodemailertransport.sendMail({
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
    await db.collection('loginlog').add({
      date: Date.now(),
      ip: event.headers['x-real-ip'],
      ipAddress: ipaddress,
      verifyType: verifytype,
      ua: event.headers['user-agent'],
      uid: account._id
    })
    if (account.email) {
      await nodemailertransport.sendMail({
        from: 'zhangls2512@vip.qq.com',
        to: account.email,
        subject: '轩铭2512统一账号登录提醒',
        text: '您的账号于北京时间' + moment().tz('Asia/Shanghai').format('YYYY年MM月DD日 HH:mm') + '登录。\n' + '验证方式：' + verifytypetext + '\n' + '登录地点：' + ipaddress + '（IP：' + event.headers['x-real-ip'] + '）'
      })
    }
    return {
      errCode: 0,
      errMsg: '成功',
      accessToken: accesstoken,
      uid: account._id,
      email: account.email,
      endDate: enddate
    }
  }
}