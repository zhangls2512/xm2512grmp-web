'use strict'
exports.main = async () => {
  const tcb = require('@cloudbase/node-sdk')
  const nodemailer = require('nodemailer')
  const app = tcb.init()
  const db = app.database()
  const nodemailertransport = nodemailer.createTransport({
    host: 'smtp.qq.com',
    secure: true,
    auth: {
      user: 'zhangls2512@vip.qq.com',
      pass: process.env.mailtoken
    }
  })
  const startdate = Date.now() - 604800000
  const res = await db.collection('account').where({
    endDate: db.command.lte(startdate),
    service: []
  }).get()
  res.data.forEach(async (item) => {
    const banres = await db.collection('banlog').where({
      uid: item._id
    }).count()
    if (banres.total == 0) {
      await db.collection('account').where({
        _id: item._id
      }).remove()
      await db.collection('externalaccount').where({
        uid: item._id
      }).remove()
      await db.collection('loginlog').where({
        uid: item._id
      }).remove()
      const email = item.email
      if (email) {
        await nodemailertransport.sendMail({
          from: 'zhangls2512@vip.qq.com',
          to: email,
          subject: '轩铭2512统一账号被系统自动注销通知',
          text: '您的账号因未开通任何服务、长期未登录，为了节省服务器资源，已被系统自动注销。如需继续使用，请重新注册，谢谢。给您带来的不便，敬请谅解。'
        })
      }
    }
  })
}