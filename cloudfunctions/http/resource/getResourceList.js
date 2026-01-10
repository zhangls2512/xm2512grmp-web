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
  let keyword = db.command.neq(null)
  if (typeof (requestdata.keyword) == 'string' && requestdata.keyword) {
    keyword = db.RegExp({
      regexp: requestdata.keyword,
      options: 'i'
    })
  }
  let tag = db.command.neq(null)
  if (Array.isArray(requestdata.tag) && requestdata.tag.length > 0) {
    tag = db.command.all(requestdata.tag)
  }
  let skip = 0
  let limit = 10
  if (Number.isInteger(requestdata.skip)) {
    skip = requestdata.skip
  }
  if (Number.isInteger(requestdata.limit) && requestdata.limit > 0 && requestdata.limit <= 20) {
    limit = requestdata.limit
  }
  const resourceres = await db.collection('resource').where({
    name: keyword,
    releaseStatus: 'release',
    searchTag: tag
  }).skip(skip).limit(limit).field({
    _id: true,
    name: true,
    desc: true,
    version: true,
    location: true,
    tag: true,
    info: true
  }).get()
  return {
    errCode: 0,
    errMsg: '成功',
    data: resourceres.data
  }
}