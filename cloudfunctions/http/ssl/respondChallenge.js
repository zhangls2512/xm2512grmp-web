'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const acme = require('nodejs-acmeclient')
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
  if (typeof (requestdata.accessToken) != 'string' && typeof (requestdata.accessKey) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的accessToken或accessKey参数'
    }
  }
  if (typeof (requestdata.orderId) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的orderId参数'
    }
  }
  if (typeof (requestdata.url) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的url参数'
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
      permission: ['account', 'ssl'],
      service: ['ssl'],
      apiName: 'ssl_respondChallenge'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const orderres = await db.collection('sslorder').where({
      _id: requestdata.orderId,
      uid: res.result.account._id
    }).get()
    if (orderres.data.length == 0) {
      return {
        errCode: 8000,
        errMsg: '订单不存在',
        errFix: '无修复建议'
      }
    }
    if (orderres.data[0].status != 'pending') {
      return {
        errCode: 8001,
        errMsg: '订单状态为待授权时才可请求验证挑战',
        errFix: '无修复建议'
      }
    }
    const userres = await db.collection('productuser').where({
      product: 'ssl',
      uid: res.result.account._id
    }).get()
    let directoryurl = ''
    if (orderres.data[0].environmentType == 'production') {
      directoryurl = 'https://acme-v02.api.letsencrypt.org/directory'
    }
    if (orderres.data[0].environmentType == 'staging') {
      directoryurl = 'https://acme-staging-v02.api.letsencrypt.org/directory'
    }
    const accountkey = userres.data[0].accountKey[orderres.data[0].environmentType]
    const authorization = await acme.api.getOrderAuthorization(orderres.data[0].orderUrl)
    if (!authorization.some(item =>
      item.challenges.some(challenge => challenge.url == requestdata.url)
    )) {
      return {
        errCode: 8002,
        errMsg: '挑战不存在',
        errFix: '无修复建议'
      }
    }
    try {
      await acme.api.respondChallenge({
        directoryUrl: directoryurl,
        accountKey: accountkey,
        challengeUrl: requestdata.url
      })
      return {
        errCode: 0,
        errMsg: '成功'
      }
    } catch (err) {
      return {
        errCode: 8003,
        errMsg: 'CA返回错误，错误信息：' + err.detail,
        errFix: '联系客服'
      }
    }
  }
}