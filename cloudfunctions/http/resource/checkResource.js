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
  if (typeof (requestdata.resourceId) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的resourceId参数'
    }
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
      apiName: 'resource_checkResource'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const uid = res.result.account._id
    const resourceres = await db.collection('resource').where({
      _id: requestdata.resourceId,
      releaseStatus: 'release'
    }).get()
    if (resourceres.data.length == 0) {
      return {
        errCode: 8000,
        errMsg: '资源不存在',
        errFix: '无修复建议'
      }
    }
    let added = false
    let canUpdate = false
    const data = resourceres.data[0]
    if (data.uid == res.result.account._id) {
      canUpdate = true
    }
    if (!data.uid) {
      if (data.allowUpdateUser.length == 0 || data.allowUpdateUser.includes(uid))
        canUpdate = true
    }
    const resourceaddres = await db.collection('resourceadd').where({
      resourceId: requestdata.resourceId,
      uid: uid
    }).get()
    if (resourceaddres.data.length == 0) {
      added = true
    }
    return {
      errCode: 0,
      errMsg: '成功',
      added: added,
      canUpdate: canUpdate
    }
  }
}