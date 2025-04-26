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
  try {
    const requestdata = JSON.parse(event.body)
    if (typeof (requestdata.accessToken) != 'string' && typeof (requestdata.accessKey) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的accessToken或accessKey参数'
      }
    }
    const validplatforms = ['aliyun', 'tencentcloud']
    if (!validplatforms.includes(requestdata.platform)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的platform参数'
      }
    }
    if (typeof (requestdata.keyId) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的keyId参数'
      }
    }
    if (typeof (requestdata.keySecret) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的keySecret参数'
      }
    }
    if (!Array.isArray(requestdata.domains) || !requestdata.domains.every(item => validator.isFQDN(item))) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的domains参数'
      }
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
        apiName: 'ssl_updateSslUserDns'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const uid = res.result.account._id
      const userres = await db.collection('productuser').where({
        product: 'ssl',
        uid: uid
      }).get()
      const dns = userres.data[0].dns
      const index = dns.findIndex(item => item.platform == requestdata.platform)
      if (index == -1) {
        dns.push({
          platform: requestdata.platform,
          keyId: requestdata.keyId,
          keySecret: requestdata.keySecret,
          domains: requestdata.domains
        })
      } else {
        dns[index].platform = requestdata.platform
        dns[index].keyId = requestdata.keyId
        dns[index].keySecret = requestdata.keySecret
        dns[index].domains = requestdata.domains
      }
      await db.collection('productuser').where({
        product: 'ssl',
        uid: uid
      }).update({
        dns: dns
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