'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const app = tcb.init()
  const db = app.database()
  if (event.httpMethod != 'POST') {
    return {
      code: 405,
      msg: '请求方法错误'
    }
  }
  const requestdata = JSON.parse(event.body)
  let skip = 0
  let limit = 10
  if (Number.isInteger(requestdata.skip) && requestdata.skip >= 0) {
    skip = requestdata.skip
  }
  if (Number.isInteger(requestdata.limit) && requestdata.limit > 0 && requestdata.limit <= 20) {
    limit = requestdata.limit
  }
  const res = await app.callFunction({
    name: 'authCheck',
    data: {
      type: 'todoteam',
      headers: event.headers
    }
  })
  if (res.result.code != 0) {
    return res.result
  } else {
    const account = res.result.account
    if (!account.admin) {
      return {
        code: 403,
        msg: '无权限'
      }
    }
    const viplogres = await db.collection('viplog').where({
      product: 'todoteam',
      uid: account.teamId
    }).orderBy('date', 'desc').skip(skip).limit(limit).field({
      _id: false
    }).get()
    return {
      code: 0,
      msg: '成功',
      data: viplogres.data
    }
  }
}