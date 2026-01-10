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
  if (typeof (requestdata.id) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的id参数'
    }
  }
  if (!Array.isArray(requestdata.tag)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的tag参数'
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
      permission: ['account', 'resource'],
      service: ['resource'],
      apiName: 'resource_updateAddResource'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const resourceaddres = await db.collection('resourceadd').where({
      _id: requestdata.id,
      uid: res.result.account._id
    }).update({
      tag: requestdata.tag
    })
    if (resourceaddres.updated == 0) {
      return {
        errCode: 8000,
        errMsg: '添加的资源不存在或数据无修改',
        errFix: '无修复建议'
      }
    }
    return {
      errCode: 0,
      errMsg: '成功'
    }
  }
}