'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const app = tcb.init()
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
    return {
      code: 0,
      msg: '成功',
      data: {
        teamId: team.teamId,
        teamName: team.teamName,
        userId: account.userId,
        userName: account.userName,
        userEnabled: account.userEnabled,
        admin: account.admin,
        permission: account.permission,
        userSetting: account.userSetting
      }
    }
  }
}