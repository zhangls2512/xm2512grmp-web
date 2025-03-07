'use strict'
exports.main = async () => {
  const tcb = require('@cloudbase/node-sdk')
  const app = tcb.init()
  const db = app.database()
  const startdate = Date.now() - 3600000
  const res = await db.collection('dnstask').where({
    status: db.command.in['setpending', 'submitpending'],
    updateDate: db.command.lte(startdate)
  }).get()
  res.data.forEach(async (item) => {
    await db.collection('dnstask').where({
      _id: item._id
    }).update({
      status: 'timeoutend',
      updateDate: Date.now()
    })
    app.callFunction({
      name: 'sendEmail',
      data: {
        uid: item.uid,
        noticeName: 'ssl_email_autodnstaskstatuschange',
        subject: 'SSL证书DNS自动配置任务状态变更通知',
        text: '您的账号SSL证书产品DNS自动配置任务（ID：' + item._id + '）状态已变更为超时结束。'
      }
    })
    app.callFunction({
      name: 'sendWebhook',
      data: {
        uid: item.uid,
        data: {
          noticeName: 'ssl_webhook_autodnstaskstatuschange',
          dnstaskId: item._id,
          status: 'timeoutend'
        }
      }
    })
  })
}