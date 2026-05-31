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
    const account = res.result.account
    const team = res.result.team
    if (!account.admin) {
      return {
        code: 403,
        msg: '无权限'
      }
    }
    const accountres = await db.collection('todoteamaccount').where({
      teamId: team.teamId
    }).count()
    const todores = await db.collection('teamtodo').where({
      teamId: team.teamId
    }).count()
    return {
      code: 0,
      msg: '成功',
      data: {
        teamId: team.teamId,
        teamName: team.teamName,
        userCount: accountres.total,
        todoCount: todores.total,
        userMaxCount: team.userMaxCount,
        todoMaxCount: team.todoMaxCount,
        teamSetting: team.teamSetting
      }
    }
  }
}