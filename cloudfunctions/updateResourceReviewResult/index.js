'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const lodash = require('lodash')
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
    if (requestdata.status == 'invalid' && (typeof (requestdata.reason) != 'string' || !requestdata.reason)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的reason参数'
      }
    }
    if (requestdata.status == 'invalid' && typeof (requestdata.disallowUpdateReview) != 'boolean') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的disallowUpdateReview参数'
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
      } else {
        let data = resourceres.data[0]
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
        let reviewinfo = data.reviewInfo
        if ((typeof (requestdata.name) == 'string' && requestdata.name) && reviewinfo.name != requestdata.name) {
          if (data.allowReviewerUpdate) {
            reviewinfo.name = requestdata.name
          } else {
            return {
              errCode: 8003,
              errMsg: '未允许审核人员修改信息',
              errFix: '不修改信息'
            }
          }
        }
        if (typeof (requestdata.desc) == 'string' && reviewinfo.desc != requestdata.desc) {
          if (data.allowReviewerUpdate) {
            reviewinfo.desc = requestdata.desc
          } else {
            return {
              errCode: 8003,
              errMsg: '未允许审核人员修改信息',
              errFix: '不修改信息'
            }
          }
        }
        if (typeof (requestdata.version) == 'string' && reviewinfo.version != requestdata.version) {
          if (data.allowReviewerUpdate) {
            reviewinfo.version = requestdata.version
          } else {
            return {
              errCode: 8003,
              errMsg: '未允许审核人员修改信息',
              errFix: '不修改信息'
            }
          }
        }
        if ((Array.isArray(requestdata.location) && requestdata.location.length > 0) && !lodash.isEqual(reviewinfo.location, requestdata.location)) {
          if (data.allowReviewerUpdate) {
            reviewinfo.location = requestdata.location
          } else {
            return {
              errCode: 8003,
              errMsg: '未允许审核人员修改信息',
              errFix: '不修改信息'
            }
          }
        }
        if (Array.isArray(requestdata.tag) && !lodash.isEqual(reviewinfo.tag, requestdata.tag)) {
          if (data.allowReviewerUpdate) {
            reviewinfo.tag = requestdata.tag
          } else {
            return {
              errCode: 8003,
              errMsg: '未允许审核人员修改信息',
              errFix: '不修改信息'
            }
          }
        }
        if (Array.isArray(requestdata.info) && !lodash.isEqual(reviewinfo.info, requestdata.info)) {
          if (data.allowReviewerUpdate) {
            reviewinfo.info = requestdata.info
          } else {
            return {
              errCode: 8003,
              errMsg: '未允许审核人员修改信息',
              errFix: '不修改信息'
            }
          }
        }
        if (requestdata.status == 'valid') {
          if (data.reviewStatus == 'valid') {
            return {
              errCode: 8004,
              errMsg: '审核版本已审核通过',
              errFix: '无需重复通过审核'
            }
          }
          await db.collection('resource').where({
            _id: requestdata.id
          }).update({
            disallowUpdateReview: false,
            reviewInfo: reviewinfo,
            reviewInvalidReason: '',
            reviewStatus: 'valid'
          })
          app.callFunction({
            name: 'sendEmail',
            data: {
              uid: data.uid,
              noticeName: 'resourcecreator_email_result',
              subject: '资源审核版本审核结果',
              text: '您的账号资源产品的资源“' + data.reviewInfo.name + '”（ID：' + data._id + '）审核版本审核通过。'
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
          return {
            errCode: 0,
            errMsg: '成功'
          }
        }
        if (requestdata.status == 'invalid') {
          await db.collection('resource').where({
            _id: requestdata.id
          }).update({
            disallowUpdateReview: requestdata.disallowUpdateReview,
            reviewInfo: reviewinfo,
            reviewInvalidReason: requestdata.reason,
            reviewStatus: 'invalid'
          })
          app.callFunction({
            name: 'sendEmail',
            data: {
              uid: data.uid,
              noticeName: 'resourcecreator_email_result',
              subject: '资源审核版本审核结果',
              text: '您的账号资源产品的资源“' + data.reviewInfo.name + '”（ID：' + data._id + '）审核版本审核不通过。\n不通过原因：' + requestdata.reason
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
    }
  } catch {
    return {
      errCode: 5000,
      errMsg: '内部错误',
      errFix: '联系客服'
    }
  }
}