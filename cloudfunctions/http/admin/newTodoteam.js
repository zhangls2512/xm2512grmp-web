'use strict'
exports.main = async (event) => {
  const bcrypt = require('bcrypt')
  const crypto = require('crypto')
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
  if (typeof (requestdata.name) != 'string' || !requestdata.name) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的name参数'
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
      apiName: 'admin_newTodoteam'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const accountres = await db.collection('todoteamaccount').where({
      teamName: requestdata.name
    }).count()
    if (accountres.total > 0) {
      return {
        errCode: 8000,
        errMsg: '名称已存在',
        errFix: '无修复建议'
      }
    }
    function generateuserid() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let result = ''
      for (let i = 0; i < 8; i++) {
        const idx = Math.floor(Math.random() * chars.length)
        result += chars[idx]
      }
      return result
    }
    const userid = generateuserid()
    await db.collection('todoteamaccount').add({
      teamId: crypto.randomUUID(),
      teamName: requestdata.name,
      teamEnabled: true,
      userMaxCount: 2,
      todoMaxCount: 10,
      teamSetting: {},
      userId: userid,
      userName: '管理员',
      password: await bcrypt.hash(userid, 12),
      admin: true,
      permission: [],
      userSetting: {}
    })
    return {
      errCode: 0,
      errMsg: '成功'
    }
  }
}