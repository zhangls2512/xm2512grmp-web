'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
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
  if (typeof (requestdata.accessToken) != 'string' || !requestdata.accessToken) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的accessToken参数'
    }
  }
  if (!Number.isInteger(requestdata.index) || requestdata.index < 0 || requestdata.index > 9) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的index参数'
    }
  }
  const res = await app.callFunction({
    name: 'authCheck',
    data: {
      type: 'accesstoken',
      data: {
        code: requestdata.accessToken
      },
      permission: [],
      service: []
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const account = res.result.account
    const accesskeys = account.accessKey
    if (accesskeys.length == 0 || requestdata.index > accesskeys.length) {
      return {
        errCode: 8000,
        errMsg: '不存在索引为index的accessKey',
        errFix: '无修复建议'
      }
    }
    const accesskey = accesskeys[requestdata.index]
    if (accesskey.status) {
      accesskey.status = false
    } else {
      accesskey.status = true
    }
    accesskeys[requestdata.index] = accesskey
    await db.collection('account').where({
      _id: account._id
    }).update({
      accessKey: accesskeys
    })
    return {
      errCode: 0,
      errMsg: '成功'
    }
  }
}