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
  if (typeof (requestdata.accessToken) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的accessToken参数'
    }
  }
  if (typeof (requestdata.ticket) != 'string' || !requestdata.ticket) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的ticket参数'
    }
  }
  const res = await app.callFunction({
    name: 'authCheck',
    data: {
      type: 'accesstoken',
      data: {
        code: requestdata.accessToken
      },
      permission: [],
      service: []
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const ticketres = await db.collection('ticket').where({
      ticket: requestdata.ticket
    }).get()
    if (ticketres.data.length == 0) {
      return {
        errCode: 8000,
        errMsg: 'ticket不存在',
        errFix: '无修复建议'
      }
    }
    const ticket = ticketres.data[0]
    if (ticket.endDate < Date.now()) {
      return {
        errCode: 8001,
        errMsg: 'ticket已过期',
        errFix: '无修复建议'
      }
    }
    if (ticket.uid) {
      return {
        errCode: 8002,
        errMsg: 'ticket已确认',
        errFix: '无修复建议'
      }
    }
    await db.collection('ticket').where({
      _id: ticket._id
    }).update({
      uid: res.result.account._id
    })
    return {
      errCode: 0,
      errMsg: '成功'
    }
  }
}