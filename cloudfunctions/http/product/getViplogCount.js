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
  const validproducts = ['password']
  if (!validproducts.includes(requestdata.product)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的product参数'
    }
  }
  let startdate = 0
  let enddate = Date.now()
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
      permission: [],
      service: [requestdata.product],
      apiName: 'product_getViplogCount'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const viplogres = await db.collection('viplog').where({
      date: db.command.and(db.command.gte(startdate), db.command.lte(enddate)),
      product: requestdata.product,
      uid: res.result.account._id
    }).count()
    return {
      errCode: 0,
      errMsg: '成功',
      count: viplogres.total
    }
  }
}