'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const crypto = require('crypto')
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
  if (!Number.isInteger(requestdata.count) || requestdata.count <= 0) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的count参数'
    }
  }
  let type = ''
  let code = ''
  if (requestdata.accessToken) {
    type = 'accesstoken'
    code = requestdata.accessToken
  } else {
    if (!requestdata.accessKey) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的accessKey参数'
      }
    }
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
      apiName: 'ssl_newPayOrder'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const uid = res.result.account._id
    const ordergetres = await db.collection('sslpayorder').where({
      uid: uid,
      finished: false
    }).get()
    if (ordergetres.data.length > 0) {
      return {
        errCode: 8000,
        errMsg: '存在未完成的订单',
        errFix: '无修复建议'
      }
    }
    const orderid = crypto.randomUUID()
    await db.collection('sslpayorder').add({
      orderId: orderid,
      wxOrderId: '',
      productId: '961e8d7b6f6745f59b2d',
      count: requestdata.count,
      finished: false,
      uid: uid,
      createTime: Date.now(),
      finishTime: -1
    })
    return {
      errCode: 0,
      errMsg: '成功',
      id: orderid
    }
  }
}