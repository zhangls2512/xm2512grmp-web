'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const acme = require('nodejs-acmeclient')
  const app = tcb.init()
  const auth = app.auth()
  const db = app.database()
  try {
    if (typeof (event.accessToken) != 'string' && typeof (event.accessKey) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的accessToken或accessKey参数'
      }
    }
    if (typeof (event.id) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的id参数'
      }
    }
    let type = ''
    let code = ''
    if (event.accessToken) {
      type = 'accesstoken'
      code = event.accessToken
    } else {
      type = 'accesskey'
      code = event.accessKey
    }
    const res = await app.callFunction({
      name: 'authCheck',
      data: {
        type: type,
        data: {
          code: code,
          requestIp: auth.getClientIP()
        },
        permission: [],
        service: ['ssl'],
        apiName: 'ssl_getOrderAuthorization'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const orderres = await db.collection('sslorder').where({
        _id: event.id,
        uid: res.result.account._id
      }).get()
      if (orderres.data.length == 0) {
        return {
          errCode: 8000,
          errMsg: '订单不存在',
          errFix: '无修复建议'
        }
      }
      const userres = await db.collection('productuser').where({
        product: 'ssl',
        uid: res.result.account._id
      }).get()
      const accountkey = userres.data[0].accountKey[orderres.data[0].environmentType]
      try {
        const acmeorderres = await acme.api.getOrderInfo(orderres.data[0].orderUrl)
        let authorization = await acme.api.getOrderAuthorization(orderres.data[0].orderUrl)
        authorization = authorization.map((item, index) => ({
          ...item,
          url: acmeorderres.authorizations[index],
          identifier: item.identifier.value,
          expires: new Date(item.expires).getTime(),
          challenges: item.challenges.map(item => ({
            ...item,
            token: acme.api.getChallengeKeyAuthorization({
              challenge: item,
              accountKey: accountkey
            }),
            validated: new Date(item.validated).getTime()
          }))
        }))
        return {
          errCode: 0,
          errMsg: '成功',
          authorization: authorization
        }
      } catch (err) {
        if (err.detail) {
          return {
            errCode: 8001,
            errMsg: 'CA返回错误，错误信息：' + err.detail,
            errFix: '联系客服'
          }
        } else {
          return {
            errCode: 8002,
            errMsg: '请求CA服务器失败，错误信息：' + err.code,
            errFix: '联系客服'
          }
        }
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