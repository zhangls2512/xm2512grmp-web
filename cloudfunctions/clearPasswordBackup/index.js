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
    let types = ['password', 'info', 'tag']
    const validtypes = ['password', 'info', 'tag']
    if (Array.isArray(requestdata.types) && requestdata.types.length > 0 && requestdata.types.every(item => validtypes.includes(item))) {
      types = requestdata.types
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
        service: ['password'],
        apiName: 'password_clearBackup'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const passwordres = await db.collection('password').where({
        type: db.command.in(types),
        uid: res.result.account._id
      }).remove()
      if (passwordres.deleted == 0) {
        return {
          errCode: 8000,
          errMsg: '无数据可清理',
          errFix: '无修复建议'
        }
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