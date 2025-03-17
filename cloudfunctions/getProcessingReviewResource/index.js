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
    const validtypes = ['sorted', 'random']
    if (!validtypes.includes(requestdata.type)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的type参数'
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
        permission: ['account', 'admin'],
        service: ['admin'],
        apiName: 'admin_getProcessingReviewResource'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      if (requestdata.type == 'sorted') {
        const resourceres = await db.collection('resource').where({
          reviewStatus: 'processing'
        }).orderBy('submitReviewDate', 'asc').limit(1).get()
        if (resourceres.data.length == 0) {
          return {
            errCode: 8000,
            errMsg: '无待审资源',
            errFix: '无修复建议'
          }
        } else {
          return {
            errCode: 0,
            errMsg: '成功',
            data: resourceres.data[0]
          }
        }
      }
      if (requestdata.type == 'random') {
        const resourceres = await db.collection('resource').aggregate().match({
          reviewStatus: 'processing'
        }).sample({
          size: 1
        }).end()
        if (resourceres.data.length == 0) {
          return {
            errCode: 8000,
            errMsg: '无待审资源',
            errFix: '无修复建议'
          }
        } else {
          return {
            errCode: 0,
            errMsg: '成功',
            data: resourceres.data[0]
          }
        }
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