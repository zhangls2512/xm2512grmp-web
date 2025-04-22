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
    const validproducts = ['password']
    if (validproducts.includes(requestdata.product)) {
      product = requestdata.product
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
        apiName: 'admin_getVipcodeList'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const vipcoderes = await db.collection('vipcode').where({
        product: product
      }).orderBy('date', 'desc').skip(skip).limit(limit).get()
      let vipcodes = vipcoderes.data
      const promises = vipcodes.map(async (item, index) => {
        const countres = await db.collection('viplog').where({
          info: item._id,
          type: 'vipcode'
        }).count()
        vipcodes[index].count = countres.total
      })
      await Promise.all(promises)
      return {
        errCode: 0,
        errMsg: '成功',
        data: vipcodes
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