'use strict'
exports.main = async () => {
  const tcb = require('@cloudbase/node-sdk')
  const app = tcb.init()
  const db = app.database()
  await db.collection('ticket').where({
    endDate: db.command.lte(Date.now())
  }).remove()
}