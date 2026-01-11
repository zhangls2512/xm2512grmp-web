'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const { nanoid } = await import('nanoid')
  const app = tcb.init()
  const db = app.database()
  if (event.httpMethod != 'POST') {
    return {
      errCode: 1000,
      errMsg: '请求方法错误',
      errFix: '使用POST方法请求'
    }
  }
  const ticket = nanoid(60)
  await db.collection('ticket').add({
    ticket: ticket,
    endDate: Date.now() + 60000,
    uid: ''
  })
  return {
    errCode: 0,
    errMsg: '成功',
    ticket: ticket
  }
}