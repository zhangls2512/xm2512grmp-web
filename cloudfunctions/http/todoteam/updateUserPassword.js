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
  if (typeof (requestdata.password) != 'string' || requestdata.password.length < 8 || requestdata.password.length > 32) {
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
    await db.collection('todoteamaccount').where({
      teamId: account.teamId,
      userId: account.userId
    }).update({
      password: bcrypt.hashSync(requestdata.password, 12)
    })
    return {
      code: 0,
      msg: '成功'
    }
  }
}