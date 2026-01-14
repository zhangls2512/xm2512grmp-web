'use strict'
exports.main = async () => {
  const tcb = require('@cloudbase/node-sdk')
  const app = tcb.init()
  const db = app.database()
  const startdate = Date.now() - 604800000
  await db.collection('dnstask').where({
    updateDate: db.command.lte(startdate)
  }).remove()
}