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
    if (!Number.isInteger(requestdata.date)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的date参数'
      }
    }
    const validstatuss = ['valid', 'invalid']
    if (!validstatuss.includes(requestdata.status)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的status参数'
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
    if (requestdata.status == 'invalid' && (typeof (requestdata.reason) != 'string' || !requestdata.reason)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的reason参数'
      }
    }
    if (requestdata.status == 'invalid' && typeof (requestdata.disallowUpdate) != 'boolean') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的disallowUpdate参数'
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
        apiName: 'admin_updateResourceReviewResult'
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
          errFix: '传递有效的id'
        }
      }
      const data = resourceres.data[0]
      if (data.reviewStatus == 'pending') {
        return {
          errCode: 8001,
          errMsg: '审核版本未提交审核',
          errFix: '无修复建议'
        }
      }
      if (data.submitReviewDate != requestdata.date) {
        return {
          errCode: 8002,
          errMsg: '提交审核时间比对不通过',
          errFix: '重新获取审核版本信息'
        }
      }
      if (requestdata.status == 'valid') {
        await db.collection('resource').where({
          _id: requestdata.id
        }).update({
          desc: requestdata.desc,
          disallowUpdate: false,
          info: requestdata.info,
          location: requestdata.location,
          name: requestdata.name,
          reviewInfo: {
            desc: requestdata.desc,
            info: requestdata.info,
            location: requestdata.location,
            name: requestdata.name,
            tag: requestdata.tag,
            version: requestdata.version
          },
          reviewInvalidReason: '',
          reviewStatus: 'pending',
          searchTag: requestdata.tag.map(item => item.value),
          tag: requestdata.tag,
          uid: '',
          version: requestdata.version
        })
        app.callFunction({
          name: 'sendEmail',
          data: {
            uid: data.uid,
            noticeName: 'resourcecreator_email_result',
            subject: '资源审核版本审核结果',
            text: '您的账号“资源投稿”产品的资源“' + data.reviewInfo.name + '”（ID：' + data._id + '）审核版本审核通过。'
          }
        })
        app.callFunction({
          name: 'sendWebhook',
          data: {
            uid: data.uid,
            data: {
              noticeName: 'resourcecreator_webhook_result',
              id: data._id,
              status: 'valid'
            }
          }
        })
        if (requestdata.version && requestdata.version != data.version && data.releaseStatus == 'release') {
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
      if (requestdata.status == 'invalid') {
        await db.collection('resource').where({
          _id: requestdata.id
        }).update({
          disallowUpdate: requestdata.disallowUpdate,
          reviewInfo: {
            desc: requestdata.desc,
            info: requestdata.info,
            location: requestdata.location,
            name: requestdata.name,
            tag: requestdata.tag,
            version: requestdata.version
          },
          reviewInvalidReason: requestdata.reason,
          reviewStatus: 'invalid'
        })
        app.callFunction({
          name: 'sendEmail',
          data: {
            uid: data.uid,
            noticeName: 'resourcecreator_email_result',
            subject: '资源审核版本审核结果',
            text: '您的账号“资源投稿”产品的资源“' + data.reviewInfo.name + '”（ID：' + data._id + '）审核版本审核不通过。\n不通过原因：' + requestdata.reason
          }
        })
        app.callFunction({
          name: 'sendWebhook',
          data: {
            uid: data.uid,
            data: {
              noticeName: 'resourcecreator_webhook_result',
              id: data._id,
              status: 'invalid',
              reason: requestdata.reason
            }
          }
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