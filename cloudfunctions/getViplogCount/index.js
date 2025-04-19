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
    if (typeof (requestdata.accessToken) != 'string' && typeof (requestdata.accessKey) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的accessToken或accessKey参数'
      }
    }
    let product = db.command.neq('')
    let uid = db.command.neq('')
    let startdate = 0
    let enddate = Date.now() + 86400000
    const validproducts = ['password']
    if (validproducts.includes(requestdata.product)) {
      product = requestdata.product
    }
    if (typeof (requestdata.uid) == 'string' && requestdata.uid) {
      uid = requestdata.uid
    }
    if (Number.isInteger(requestdata.startDate) && requestdata.startDate >= 0) {
      startdate = requestdata.startDate
    }
    if (Number.isInteger(requestdata.endDate) && requestdata.endDate >= 0 && requestdata.endDate >= startdate) {
      enddate = requestdata.endDate
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
        permission: ['account', 'admin'],
        service: ['admin'],
        apiName: 'admin_getViplogCount'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const viplogres = await db.collection('viplog').where({
        date: db.command.and(db.command.gte(startdate), db.command.lte(enddate)),
        product: product,
        uid: uid
      }).count()
      return {
        errCode: 0,
        errMsg: '成功',
        count: viplogres.total
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