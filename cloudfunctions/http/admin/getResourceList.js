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
  let id = db.command.neq('')
  let keyword = db.command.neq(null)
  let releasestatus = db.command.neq('')
  let reviewstatus = db.command.neq('')
  if (typeof (requestdata.id) == 'string' && requestdata.id.length == 32) {
    id = requestdata.id
  }
  if (typeof (requestdata.keyword) == 'string' && requestdata.keyword) {
    keyword = db.RegExp({
      regexp: requestdata.keyword,
      options: 'i'
    })
  }
  const validreleasestatus = ['release', 'unrelease']
  const validreviewstatus = ['pending', 'processing', 'invalid']
  if (validreleasestatus.includes(requestdata.releaseStatus)) {
    releasestatus = requestdata.releaseStatus
  }
  if (validreviewstatus.includes(requestdata.reviewStatus)) {
    reviewstatus = requestdata.reviewStatus
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
      apiName: 'admin_getResourceList'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const resourceres = await db.collection('resource').where({
      _id: id,
      name: keyword,
      releaseStatus: releasestatus,
      reviewStatus: reviewstatus
    }).orderBy('createDate', 'desc').skip(skip).limit(limit).get()
    return {
      errCode: 0,
      errMsg: '成功',
      data: resourceres.data
    }
  }
}