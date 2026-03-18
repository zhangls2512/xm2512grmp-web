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
  if (typeof (requestdata.accessToken) != 'string' && typeof (requestdata.accessKey) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的accessToken或accessKey参数'
    }
  }
  if (typeof (requestdata.id) != 'string' || requestdata.id.length != 32) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的id参数'
    }
  }
  if (typeof (requestdata.desc) != 'string' || requestdata.desc.length > 20) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的desc参数'
    }
  }
  const validautoneworder = ['ari', 'nearexpire', 'close']
  if (!validautoneworder.includes(requestdata.autoNewOrder)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的autoNewOrder参数'
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
      apiName: 'ssl_updateOrder'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const uid = res.result.account._id
    const orderres = await db.collection('sslorder').where({
      _id: requestdata.id,
      uid: uid
    }).get()
    if (orderres.data.length == 0) {
      return {
        errCode: 8000,
        errMsg: '订单不存在',
        errFix: '无修复建议'
      }
    }
    const data = orderres.data[0]
    if (data.status == 'invalid' || data.status == 'expired') {
      return {
        errCode: 8001,
        errMsg: '不可修改状态为已失效或已过期的订单',
        errFix: '无修复建议'
      }
    }
    if (data.isAutoNewOrder) {
      return {
        errCode: 8002,
        errMsg: '订单已自动续期，不可修改',
        errFix: '无修复建议'
      }
    }
    if (requestdata.autoNewOrder == 'ari' && data.ariEndDate && data.ariEndDate < Date.now()) {
      return {
        errCode: 8003,
        errMsg: '已过CA建议续期截止时间，不可修改为CA建议',
        errFix: '无修复建议'
      }
    }
    await db.collection('sslorder').where({
      _id: requestdata.id
    }).update({
      autoNewOrder: requestdata.autoNewOrder,
      desc: requestdata.desc
    })
    return {
      errCode: 0,
      errMsg: '成功'
    }
  }
}