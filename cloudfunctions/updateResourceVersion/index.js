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
    if (typeof (requestdata.version) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的version参数'
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
        apiName: 'resourcecreator_updateResourceVersion'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const resourceres = await db.collection('resource').where({
        _id: requestdata.id,
        releaseStatus: 'release'
      }).get()
      if (resourceres.data.length == 0) {
        return {
          errCode: 8000,
          errMsg: '资源不存在',
          errFix: '传递有效的id'
        }
      }
      const data = resourceres.data[0]
      if (data.updateVersionWithoutReview != res.result.account._id) {
        return {
          errCode: 8001,
          errMsg: '无权限',
          errFix: '联系客服'
        }
      }
      const reviewinfo = data.reviewInfo
      reviewinfo.version = requestdata.version
      await db.collection('resource').where({
        _id: requestdata.id
      }).update({
        reviewInfo: reviewinfo,
        submitReviewDate: Date.now(),
        version: requestdata.version
      })
      if (requestdata.version && data.version != requestdata.version && data.releaseStatus == 'release') {
        const userres = await db.collection('resourceadd').where({
          resourceId: requestdata.id
        }).get()
        userres.data.forEach(item => {
          app.callFunction({
            name: 'sendEmail',
            data: {
              uid: item.uid,
              noticeName: 'resource_email_versionupdate',
              subject: '资源版本更新通知',
              text: '您的账号“资源”产品添加的资源（名称：' + item.name + '）版本已更新，新版本号：' + requestdata.version + '。'
            }
          })
          app.callFunction({
            name: 'sendWebhook',
            data: {
              uid: item.uid,
              data: {
                noticeName: 'resource_webhook_versionupdate',
                resourceId: requestdata.id,
                newVersion: requestdata.version
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
  } catch {
    return {
      errCode: 5000,
      errMsg: '内部错误',
      errFix: '联系客服'
    }
  }
}