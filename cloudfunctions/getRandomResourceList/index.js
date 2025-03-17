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
    let limit = 10
    if (Number.isInteger(requestdata.limit) && requestdata.limit > 0 && requestdata.limit <= 20) {
      limit = requestdata.limit
    }
    const resourceres = await db.collection('resource').aggregate().match({
      releaseStatus: 'release'
    }).sample({
      size: limit
    }).end()
    let array = resourceres.data
    array = array.map(item => ({
      _id: item._id,
      name: item.name,
      desc: item.desc,
      version: item.version,
      location: item.location,
      tag: item.tag,
      info: item.info
    }))
    return {
      errCode: 0,
      errMsg: '成功',
      data: array
    }
  } catch {
    return {
      errCode: 5000,
      errMsg: '内部错误',
      errFix: '联系客服'
    }
  }
}