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
  if (typeof (requestdata.id) != 'string' || requestdata.id.length != 32) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的id参数'
    }
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
      permission: [],
      service: ['resourcecreator'],
      apiName: 'resourcecreator_getResourceInfo'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const resourceres = await db.collection('resource').where({
      _id: requestdata.id
    }).get()
    if (resourceres.data.length == 0) {
      return {
        errCode: 8000,
        errMsg: '资源不存在',
        errFix: '无修复建议'
      }
    }
    const data = resourceres.data[0]
    if (data.uid == res.result.account._id) {
      return {
        errCode: 0,
        errMsg: '成功',
        data: resourceres.data[0]
      }
    }
    if (!data.uid) {
      if (data.allowUpdateUser.length > 0 && !data.allowUpdateUser.includes(res.result.account._id)) {
        return {
          errCode: 8001,
          errMsg: '无权限',
          errFix: '联系客服'
        }
      }
      if (data.reviewStatus == 'unrelease') {
        return {
          errCode: 8002,
          errMsg: '资源未上架',
          errFix: '无修复建议'
        }
      }
      return {
        errCode: 0,
        errMsg: '成功',
        data: resourceres.data[0]
      }
    }
    return {
      errCode: 8001,
      errMsg: '无权限',
      errFix: '联系客服'
    }
  }
}