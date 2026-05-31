'use strict'
exports.main = async (event) => {
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
  if (typeof (requestdata.id) != 'string' || requestdata.id.length != 8) {
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
      teamId: team.teamId,
      userId: requestdata.id,
      admin: false
    }).get()
    if (accountres.data.length == 0) {
      return {
        code: 400,
        msg: '用户不存在'
      }
    }
    await db.collection('todoteamaccount').where({
      teamId: team.teamId,
      userId: requestdata.id
    }).update({
      userEnabled: !accountres.data[0].userEnabled
    })
    return {
      code: 0,
      msg: '成功'
    }
  }
}