'use strict'
exports.main = async () => {
  const tcb = require('@cloudbase/node-sdk')
  const app = tcb.init()
  const db = app.database()
  const startdate = Date.now() - 2592000000
  await db.collection('loginlog').where({
    date: db.command.lte(startdate)
  }).remove()
}