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
  try {
    const requestdata = JSON.parse(event.body)
    if (typeof (requestdata.jwsNotification) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的jwsNotification参数'
      }
    }
    const parts = requestdata.jwsNotification.split('.')
    if (parts.length != 3) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的jwsNotification参数'
      }
    }
    const payloadbase64url = parts[1]
    let base64 = payloadbase64url.replace(/-/g, '+').replace(/_/g, '/')
    const padding = base64.length % 4
    if (padding) {
      base64 += '='.repeat(4 - padding)
    }
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'))
    if (payload.notificationType != 'DID_NEW_TRANSACTION') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的jwsNotification参数'
      }
    }
    app.callFunction({
      name: 'openVip',
      data: payload
    })
    return {
      errCode: 0,
      errMsg: '成功'
    }
  } catch {
    return {
      errCode: 5000,
      errMsg: '内部错误',
      errFix: '联系客服'
    }
  }
}