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
  if (typeof (requestdata.id) != 'string' || requestdata.id.length != 32) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的id参数'
    }
  }
  if (typeof (requestdata.desc) != 'string' || !requestdata.desc) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的desc参数'
    }
  }
  let type = ''
  let code = ''
  if (requestdata.accessToken) {
    type = 'accesstoken'
    code = requestdata.accessToken
  } else {
    if (!requestdata.accessKey) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的accessKey参数'
      }
    }
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
      apiName: 'admin_updateBaxkDesc'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const baxkres = await db.collection('baxk').where({
      _id: requestdata.id
    }).update({
      date: Date.now(),
      desc: requestdata.desc
    })
    if (baxkres.updated == 0) {
      return {
        errCode: 8000,
        errMsg: '备案/许可不存在或数据无修改',
        errFix: '无修复建议'
      }
    }
    return {
      errCode: 0,
      errMsg: '成功'
    }
  }
}