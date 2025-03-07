'use strict'
exports.main = async () => {
  const tcb = require('@cloudbase/node-sdk')
  const app = tcb.init()
  const db = app.database()
  const startdate = Date.now() + 86400000
  const res = await db.collection('sslorder').where({
    isNoticeOrderNearexpire: false,
    orderEndDate: db.command.lte(startdate),
    status: db.command.in(['pending', 'ready'])
  }).get()
  res.data.forEach(async (item) => {
    await db.collection('sslorder').where({
      _id: item._id
    }).update({
      isNoticeOrderNearexpire: true
    })
    app.callFunction({
      name: 'sendEmail',
      data: {
        uid: item.uid,
        noticeName: 'ssl_email_ordernearexpire',
        subject: 'SSL证书订单即将到期提醒',
        text: '您的账号SSL证书产品订单（ID：' + item._id + '）将于1天内到期。'
      }
    })
    app.callFunction({
      name: 'sendWebhook',
      data: {
        uid: item.uid,
        data: {
          noticeName: 'ssl_webhook_ordernearexpire',
          orderId: item._id
        }
      }
    })
  })
}