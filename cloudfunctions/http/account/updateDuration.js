'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
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
  const requestdata = JSON.parse(event.body)
  if (typeof (requestdata.email) != 'string' || !validator.isEmail(requestdata.email)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的email参数'
    }
  }
  const validtypes = ['emailcode', 'mfa']
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
  if (!Number.isInteger(requestdata.duration) || requestdata.duration < 1 || requestdata.duration > 60) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的duration参数'
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
    await db.collection('account').where({
      _id: res.result.account._id
    }).update({
      duration: requestdata.duration
    })
    return {
      errCode: 0,
      errMsg: '成功'
    }
  }
}