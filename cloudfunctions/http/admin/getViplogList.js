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
  let product = db.command.neq('')
  let uid = db.command.neq('')
  let startdate = 0
  let enddate = Date.now()
  const validproducts = ['password']
  if (validproducts.includes(requestdata.product)) {
    product = requestdata.product
  }
  if (typeof (requestdata.uid) == 'string' && requestdata.uid.length == 32) {
    uid = requestdata.uid
  }
  if (Number.isInteger(requestdata.startDate) && requestdata.startDate >= 0) {
    startdate = requestdata.startDate
  }
  if (Number.isInteger(requestdata.endDate) && requestdata.endDate >= 0 && requestdata.endDate >= startdate) {
    enddate = requestdata.endDate
  }
  let skip = 0
  let limit = 10
  if (Number.isInteger(requestdata.skip)) {
    skip = requestdata.skip
  }
  if (Number.isInteger(requestdata.limit) && requestdata.limit > 0 && requestdata.limit <= 20) {
    limit = requestdata.limit
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
      permission: ['account', 'admin'],
      service: ['admin'],
      apiName: 'admin_getViplogList'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const viplogres = await db.collection('viplog').where({
      date: db.command.and(db.command.gte(startdate), db.command.lte(enddate)),
      product: product,
      uid: uid
    }).orderBy('date', 'desc').skip(skip).limit(limit).field({
      _id: false
    }).get()
    return {
      errCode: 0,
      errMsg: '成功',
      data: viplogres.data
    }
  }
}