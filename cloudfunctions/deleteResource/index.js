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
    if (typeof (requestdata.id) != 'string') {
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
        apiName: 'resourcecreator_deleteResource'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const resourceres = await db.collection('resource').where({
        _id: requestdata.id,
        uid: res.result.account._id
      }).get()
      if (resourceres.data.length == 0) {
        return {
          errCode: 8000,
          errMsg: '资源不存在',
          errFix: '传递有效的id'
        }
      } else {
        let data = resourceres.data[0]
        if (data.releaseStatus == 'release') {
          return {
            errCode: 8001,
            errMsg: '线上版本已上架',
            errFix: '下架线上版本'
          }
        }
        if (data.reviewStatus == 'processing') {
          return {
            errCode: 8002,
            errMsg: '审核版本审核中',
            errFix: '撤回审核或等待审核完成'
          }
        }
        await db.collection('resource').where({
          _id: requestdata.id
        }).remove()
        return {
          errCode: 0,
          errMsg: '成功'
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