'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const net = require('net')
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
    if (typeof (requestdata.accessToken) != 'string' && typeof (requestdata.accessKey) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的accessToken或accessKey参数'
      }
    }
    let domains = db.command.neq('')
    let status = db.command.neq('')
    const validchangestatus = ['pending', 'ready', 'processing', 'valid', 'invalid', 'expired']
    if (typeof (requestdata.domain) == 'string' && (validator.isFQDN(requestdata.domain, {
      allow_wildcard: true
    }) || net.isIP(requestdata.domain))) {
      domains = db.command.all([requestdata.domain])
    }
    if (validchangestatus.includes(requestdata.status)) {
      status = requestdata.status
    }
    let type = ''
    let code = ''
    if (requestdata.accessToken) {
      type = 'accesstoken'
      code = requestdata.accessToken
    } else {
      type = 'accesskey'
      code = requestdata.accessKey
    }
    const res = await app.callFunction({
      name: 'authCheck',
      data: {
        type: type,
        data: {
          code: code,
          requestIp: event.headers['x-real-ip']
        },
        permission: [],
        service: ['ssl'],
        apiName: 'ssl_getOrderCount'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const orderres = await db.collection('sslorder').where({
        domains: domains,
        status: status,
        uid: res.result.account._id
      }).count()
      return {
        errCode: 0,
        errMsg: '成功',
        count: orderres.total
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