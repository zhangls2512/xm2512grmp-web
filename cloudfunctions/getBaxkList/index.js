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
    let productnumber = db.command.neq('')
    let maintype = db.command.neq('')
    if (typeof (requestdata.productNumber) == 'string' && requestdata.productNumber) {
      productnumber = requestdata.productNumber
    }
    const validmaintypes = ['0', '1', '2', '3', '4']
    if (validmaintypes.includes(requestdata.mainType)) {
      maintype = requestdata.mainType
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
        apiName: 'admin_getBaxkList'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const baxkres = await db.collection('baxk').where({
        mainType: maintype,
        productNumber: productnumber
      }).orderBy('date', 'desc').skip(skip).limit(limit).get()
      return {
        errCode: 0,
        errMsg: '成功',
        data: baxkres.data
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