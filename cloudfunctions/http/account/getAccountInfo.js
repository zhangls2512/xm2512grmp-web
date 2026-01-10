'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const app = tcb.init()
  if (event.httpMethod != 'POST') {
    return {
      errCode: 1000,
      errMsg: '请求方法错误',
      errFix: '使用POST方法请求'
    }
  }
  const requestdata = JSON.parse(event.body)
  if (typeof (requestdata.accessToken) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的accessToken参数'
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
    let mfa = false
    let password = false
    if (account.mfa) {
      mfa = true
    }
    if (account.password) {
      password = true
    }
    const accesskey = account.accessKey
    if (accesskey.length > 0) {
      accesskey.forEach(item => {
        delete item.value
      })
    }
    return {
      errCode: 0,
      errMsg: '成功',
      data: {
        uid: account._id,
        email: account.email,
        mfa: mfa,
        password: password,
        duration: account.duration,
        endDate: account.endDate,
        permission: account.permission,
        service: account.service,
        accessKey: accesskey
      }
    }
  }
}