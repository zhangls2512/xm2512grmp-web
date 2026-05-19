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
    const team = res.result.team
    if (!team.admin) {
      return {
        code: 403,
        msg: '无权限'
      }
    }
    const accountres = await db.collection('todoteamaccount').where({
      teamId: team.teamId,
      admin: false
    }).count()
    if (accountres.total > 0) {
      return {
        code: 400,
        msg: '用户未清空'
      }
    }
    const todores = await db.collection('teamtodo').where({
      teamId: team.teamId
    }).count()
    if (todores.total > 0) {
      return {
        code: 400,
        msg: '待办未清空'
      }
    }
    await db.collection('todoteamaccount').where({
      teamId: team.teamId,
      admin: true
    }).remove()
    return {
      code: 0,
      msg: '成功'
    }
  }
}