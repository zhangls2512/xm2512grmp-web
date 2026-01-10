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
      apiName: 'password_getBackupCount'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const count = {
      password: 0,
      info: 0,
      tag: 0
    }
    const types = ['password', 'info', 'tag']
    const promises = types.map(async (item) => {
      const countres = await db.collection('password').where({
        type: item,
        uid: res.result.account._id
      }).count()
      count[item] = countres.total
    })
    await Promise.all(promises)
    return {
      errCode: 0,
      errMsg: '成功',
      count: count
    }
  }
}