'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const argon2 = require('argon2')
  const validator = require('validator')
  const app = tcb.init()
  const db = app.database()
  if (event.httpMethod != 'POST') {
    return {
      errCode: 1000,
      errMsg: '请求方法错误',
      errFix: '使用POST方法请求'
    }
  }
  try {
    const requestdata = JSON.parse(event.body)
    if (typeof (requestdata.email) != 'string' || !validator.isEmail(requestdata.email)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的email参数'
      }
    }
    const validtypes = ['emailcode', 'mfa', 'password']
    if (!validtypes.includes(requestdata.verifyType)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的verifyType参数'
      }
    }
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
    if (requestdata.verifyType == 'password' && (requestdata.verifyCode && (requestdata.verifyCode.length < 8 || requestdata.verifyCode.length > 30))) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的password参数'
      }
    }
    if (typeof (requestdata.newPassword) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的newPassword参数'
      }
    }
    if (requestdata.newPassword && (requestdata.newPassword.length < 8 || requestdata.newPassword.length > 30)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的newPassword参数'
      }
    }
    const res = await app.callFunction({
      name: 'authCheck',
      data: {
        type: requestdata.verifyType,
        data: {
          email: requestdata.email,
          code: requestdata.verifyCode
        },
        permission: []
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const account = res.result.account
      let passwordhash = requestdata.newPassword
      if (requestdata.newPassword) {
        passwordhash = await argon2.hash(requestdata.newPassword)
      }
      await db.collection('account').where({
        _id: account._id
      }).update({
        password: passwordhash,
        passwordVerifyTimes: 0
      })
      return {
        errCode: 0,
        errMsg: '成功'
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