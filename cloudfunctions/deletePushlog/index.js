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
        permission: ['account', 'admin'],
        service: ['admin'],
        apiName: 'admin_deletePushlog'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const pushlogres = await db.collection('pushlog').where({
        _id: requestdata.id
      }).get()
      if (pushlogres.data.length == 0) {
        return {
          errCode: 8000,
          errMsg: '日志不存在',
          errFix: '传递有效的id'
        }
      }
      const status = pushlogres.data[0].status
      if (status == 'pending' || status == 'success') {
        return {
          errCode: 8001,
          errMsg: '日志状态不支持删除',
          errFix: '等待日志状态变为推送失败或撤回推送'
        }
      }
      await db.collection('pushlog').where({
        _id: requestdata.id
      }).remove()
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