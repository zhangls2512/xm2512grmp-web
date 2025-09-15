'use strict'
exports.main = async () => {
  const tcb = require('@cloudbase/node-sdk')
  const app = tcb.init()
  const db = app.database()
  const startdate = Date.now() - 604800000
  const res = await db.collection('account').where({
    endDate: db.command.lte(startdate),
    service: []
  }).get()
  res.data.forEach((item) => {
    db.collection('account').where({
      _id: item._id
    }).remove()
    db.collection('loginlog').where({
      uid: item._id
    }).remove()
  })
}