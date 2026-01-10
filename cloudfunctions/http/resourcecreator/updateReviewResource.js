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
  if (typeof (requestdata.name) != 'string' || !requestdata.name) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的name参数'
    }
  }
  if (typeof (requestdata.desc) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的desc参数'
    }
  }
  if (typeof (requestdata.version) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的version参数'
    }
  }
  if (!Array.isArray(requestdata.location) || requestdata.location.length == 0) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的location参数'
    }
  }
  if (!Array.isArray(requestdata.tag)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的tag参数'
    }
  }
  if (!Array.isArray(requestdata.info)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的info参数'
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
      permission: ['account', 'resourcecreator'],
      service: ['resourcecreator'],
      apiName: 'resourcecreator_updateReviewResource'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const uid = res.result.account._id
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
    let status = 'processing'
    if (data.uid) {
      if (data.uid != uid) {
        return {
          errCode: 8001,
          errMsg: '无权限',
          errFix: '无修复建议'
        }
      }
      status = 'pending'
    } else {
      if (data.allowUpdateUser.length > 0 && !data.allowUpdateUser.includes(uid)) {
        return {
          errCode: 8001,
          errMsg: '无权限',
          errFix: '联系客服'
        }
      }
    }
    if (data.reviewStatus == 'processing') {
      return {
        errCode: 8002,
        errMsg: '审核版本审核中',
        errFix: '无修复建议'
      }
    }
    if (data.disallowUpdate) {
      return {
        errCode: 8003,
        errMsg: '禁止修改审核版本',
        errFix: '联系客服'
      }
    }
    await db.collection('resource').where({
      _id: requestdata.id
    }).update({
      reviewInfo: {
        desc: requestdata.desc,
        info: requestdata.info,
        location: requestdata.location,
        name: requestdata.name,
        tag: requestdata.tag,
        version: requestdata.version
      },
      reviewInvalidReason: '',
      reviewStatus: status,
      submitReviewDate: Date.now(),
      uid: uid
    })
    if (status == 'processing') {
      const userres = await db.collection('account').where({
        service: db.command.in(['admin'])
      }).get()
      userres.data.forEach(item => {
        app.callFunction({
          name: 'sendEmail',
          data: {
            uid: item._id,
            noticeName: 'admin_email_newresourcetask',
            subject: '资源待审提醒',
            text: '有新资源“' + requestdata.name + '”（ID：' + data._id + '）等待审核。'
          }
        })
        app.callFunction({
          name: 'sendWebhook',
          data: {
            uid: item._id,
            data: {
              noticeName: 'admin_webhook_newresourcetask'
            }
          }
        })
      })
    }
    return {
      errCode: 0,
      errMsg: '成功'
    }
  }
}