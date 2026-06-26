'use strict'
exports.main = async (event) => {
  const bcrypt = require('bcrypt')
  const tcb = require('@cloudbase/node-sdk')
  const app = tcb.init()
  const db = app.database()
  if (event.httpMethod != 'POST') {
    return {
      code: 405,
      msg: '请求方法错误'
    }
  }
  const requestdata = JSON.parse(event.body)
  if (typeof (requestdata.name) != 'string' || !requestdata.name) {
    return {
      code: 400,
      msg: '请求参数错误'
    }
  }
  if (typeof (requestdata.enabled) != 'boolean') {
    return {
      code: 400,
      msg: '请求参数错误'
    }
  }
  if (!Array.isArray(requestdata.permission) || !requestdata.permission.every(item => ['newTodo', 'getTodo'].includes(item))) {
    return {
      code: 400,
      msg: '请求参数错误'
    }
  }
  const res = await app.callFunction({
    name: 'authCheck',
    data: {
      type: 'todoteam',
      headers: event.headers
    }
  })
  if (res.result.code != 0) {
    return res.result
  } else {
    const account = res.result.account
    const team = res.result.team
    if (!account.admin) {
      return {
        code: 403,
        msg: '无权限'
      }
    }
    const accountres = await db.collection('todoteamaccount').where({
      teamId: account.teamId
    }).count()
    if (accountres.total >= team.userMaxCount) {
      return {
        code: 403,
        msg: '用户数量达到上限'
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
    let userid = generateuserid()
    let finished = false
    while (!finished) {
      const userres = await db.collection('todoteamaccount').where({
        teamId: account.teamId,
        userId: userid
      }).count()
      if (userres.total == 0) {
        finished = true
      } else {
        userid = generateuserid()
      }
    }
    await db.collection('todoteamaccount').add({
      teamId: account.teamId,
      userId: userid,
      userName: requestdata.name,
      password: bcrypt.hashSync(userid, 12),
      userEnabled: requestdata.enabled,
      admin: false,
      permission: [...new Set(requestdata.permission)],
      userSetting: {}
    })
    return {
      code: 0,
      msg: '成功'
    }
  }
}