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
    const validtypes = [0, 1]
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
        permission: ['account', 'resourcecreator'],
        service: ['resourcecreator'],
        apiName: 'resourcecreator_releaseResource'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const uid = res.result.account._id
      const resourceres = await db.collection('resource').where({
        _id: requestdata.id,
        uid: uid
      }).get()
      if (resourceres.data.length == 0) {
        return {
          errCode: 8000,
          errMsg: '资源不存在',
          errFix: '传递有效的id'
        }
      } else {
        const data = resourceres.data[0]
        if (requestdata.type == 0) {
          if (data.reviewStatus != 'valid') {
            return {
              errCode: 8001,
              errMsg: '审核版本未审核通过',
              errFix: '无修复建议'
            }
          }
          await db.collection('resource').where({
            _id: requestdata.id
          }).update({
            desc: data.reviewInfo.desc,
            info: data.reviewInfo.info,
            location: data.reviewInfo.location,
            name: data.reviewInfo.name,
            reviewStatus: 'pending',
            tag: data.reviewInfo.tag,
            version: data.reviewInfo.version
          })
          if (data.version != data.reviewInfo.version && data.reviewInfo.version && data.releaseStatus == 'release') {
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
                  text: '您的账号“资源”产品添加的资源（名称：' + item.name + '）版本已更新，新版本号：' + data.reviewInfo.version + '。'
                }
              })
              app.callFunction({
                name: 'sendWebhook',
                data: {
                  uid: item.uid,
                  data: {
                    noticeName: 'resource_webhook_versionupdate',
                    name: item.name,
                    newVersion: data.reviewInfo.version
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
        if (requestdata.type == 1) {
          if (data.releaseStatus != 'unrelease') {
            return {
              errCode: 8001,
              errMsg: '线上版本未下架',
              errFix: '无需下架'
            }
          }
          if (!data.name) {
            return {
              errCode: 8002,
              errMsg: '无线上版本',
              errFix: '发布线上版本'
            }
          }
          await db.collection('resource').where({
            _id: requestdata.id
          }).update({
            releaseStatus: 'release'
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