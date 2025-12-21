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
    const validsettingnames = ['personalizedRecommendation', 'tag']
    if (!validsettingnames.includes(requestdata.settingName)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的settingName参数'
      }
    }
    if (requestdata.settingName == 'personalizedRecommendation' && typeof (requestdata.settingValue) != 'boolean') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的settingValue参数'
      }
    }
    if (requestdata.settingName == 'tag' && (!Array.isArray(requestdata.settingValue) || !requestdata.settingValue.every(item => Array.isArray(item)))) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的settingValue参数'
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
        apiName: 'resource_updateUserSetting'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const uid = res.result.account._id
      const userres = await db.collection('productuser').where({
        product: 'resource',
        uid: uid
      }).get()
      const setting = userres.data[0].setting
      setting[requestdata.settingName] = requestdata.settingValue
      await db.collection('productuser').where({
        product: 'resource',
        uid: uid
      }).update({
        setting: setting
      })
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