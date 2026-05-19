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
  if (typeof (requestdata.id) != 'string' || requestdata.id.length != 36) {
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
    const team = res.result.team
    const todores = await db.collection('teamtodo').where({
      teamId: team.teamId,
      id: requestdata.id
    }).get()
    if (todores.data.length == 0) {
      return {
        code: 400,
        msg: '待办不存在'
      }
    }
    if (!team.admin && todores.data[0].uid != res.result.account.userId) {
      return {
        code: 403,
        msg: '无权限'
      }
    }
    await db.collection('teamtodo').where({
      teamId: team.teamId,
      id: requestdata.id
    }).remove()
    return {
      code: 0,
      msg: '成功'
    }
  }
}