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
    let id = db.command.neq('')
    let keyword = db.command.neq(null)
    let releasestatus = db.command.neq('')
    let reviewstatus = db.command.neq('')
    if (typeof (requestdata.id) == 'string' && requestdata.id) {
      id = requestdata.id
    }
    if (typeof (requestdata.keyword) == 'string' && requestdata.keyword) {
      keyword = db.RegExp({
        regexp: requestdata.keyword
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
        apiName: 'admin_getResourceCount'
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
      }).count()
      return {
        errCode: 0,
        errMsg: '成功',
        count: resourceres.total
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