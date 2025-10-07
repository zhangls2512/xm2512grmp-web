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
  try {
    const requestdata = JSON.parse(event.body)
    const validproducts = ['password', 'synologydsmhelper']
    if (!validproducts.includes(requestdata.product)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的product参数'
      }
    }
    if (typeof (requestdata.pushToken) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的pushToken参数'
      }
    }
    const pushres = await db.collection('push').where({
      product: requestdata.product
    }).field({
      product: false
    }).get()
    if (pushres.data.length > 0) {
      pushres.data.forEach(item => {
        item.status = item.pushToken.includes(requestdata.pushToken)
        delete item.pushToken
      })
    }
    return {
      errCode: 0,
      errMsg: '成功',
      data: pushres.data
    }
  } catch {
    return {
      errCode: 5000,
      errMsg: '内部错误',
      errFix: '联系客服'
    }
  }
}