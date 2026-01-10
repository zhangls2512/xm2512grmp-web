'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const argon2 = require('@node-rs/argon2')
  const { sm4 } = require('sm-crypto-v2')
  const validator = require('validator')
  const { nanoid } = await import('nanoid')
  const app = tcb.init()
  const db = app.database()
  if (event.httpMethod != 'POST') {
    return {
      errCode: 1000,
      errMsg: '请求方法错误',
      errFix: '使用POST方法请求'
    }
  }
  const requestdata = JSON.parse(event.body)
  if (typeof (requestdata.email) != 'string' || !validator.isEmail(requestdata.email)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的email参数'
    }
  }
  if (typeof (requestdata.emailCode) != 'string' || requestdata.emailCode.length != 8) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的emailCode参数'
    }
  }
  let password = ''
  if (typeof (requestdata.password) == 'string' && requestdata.password.length >= 8 && requestdata.password.length <= 30) {
    password = requestdata.password
  }
  const res = await app.callFunction({
    name: 'authCheck',
    data: {
      type: 'emailcode',
      data: {
        email: requestdata.email,
        code: requestdata.emailCode
      },
      permission: false
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const accountres = await db.collection('account').where({
      email: requestdata.email
    }).count()
    if (accountres.total > 0) {
      return {
        errCode: 8000,
        errMsg: '邮箱已注册',
        errFix: '无修复建议'
      }
    }
    let passwordhash = password
    if (password) {
      passwordhash = await argon2.hash(password)
    }
    const addres = await db.collection('account').add({
      accessKey: [],
      accessToken: '',
      duration: 7,
      email: requestdata.email,
      endDate: 0,
      mfa: '',
      password: passwordhash,
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
    return {
      errCode: 0,
      errMsg: '成功'
    }
  }
}