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
        permission: ['account', 'resourcecreator'],
        service: ['resourcecreator'],
        apiName: 'resourcecreator_unreleaseResource'
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
        if (data.reviewStatus == 'processing') {
          return {
            errCode: 8001,
            errMsg: '审核版本审核中',
            errFix: '撤回审核'
          }
        }
        if (data.disallowUpdateReview == true) {
          return {
            errCode: 8002,
            errMsg: '禁止更新审核版本',
            errFix: '联系客服'
          }
        }
        await db.collection('resource').where({
          _id: requestdata.id
        }).update({
          reviewStatus: 'processing',
          submitReviewDate: Date.now()
        })
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
              text: '有新资源“' + data.reviewInfo.name + '”（ID：' + data._id + '）等待审核。'
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