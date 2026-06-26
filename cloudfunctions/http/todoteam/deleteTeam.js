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
    if (!account.admin) {
      return {
        code: 403,
        msg: '无权限'
      }
    }
    const viplogres = await db.collection('viplog').where({
      product: 'todoteam',
      uid: account.teamId
    }).count()
    if (viplogres.total > 0) {
      return {
        code: 400,
        msg: '存在付费开通记录'
      }
    }
    const accountres = await db.collection('todoteamaccount').where({
      teamId: account.teamId,
      admin: false
    }).count()
    if (accountres.total > 0) {
      return {
        code: 400,
        msg: '用户未清空'
      }
    }
    const todores = await db.collection('teamtodo').where({
      teamId: account.teamId
    }).count()
    if (todores.total > 0) {
      return {
        code: 400,
        msg: '待办未清空'
      }
    }
    await db.collection('todoteamaccount').where({
      teamId: account.teamId,
      admin: true
    }).remove()
    return {
      code: 0,
      msg: '成功'
    }
  }
}