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
  let keyword = db.command.neq({})
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
      permission: [],
      service: ['resource'],
      apiName: 'resource_getAddResourceCount'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const resourceaddres = await db.collection('resourceadd').where({
      name: keyword,
      tag: tag,
      uid: res.result.account._id
    }).count()
    return {
      errCode: 0,
      errMsg: '成功',
      count: resourceaddres.total
    }
  }
}