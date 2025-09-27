'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const nodemailer = require('nodemailer')
  const app = tcb.init()
  const db = app.database()
  const mailerconfig = {
    host: 'smtp.qq.com',
    secure: true,
    auth: {
      user: 'zhangls2512@vip.qq.com',
      pass: process.env.mailtoken
    }
  }
  try {
    const product = event.noticeName.split('_')[0]
    const res = await db.collection('productuser').where({
      product: product,
      uid: event.uid
    }).get()
    if (res.data.length > 0) {
      const noticesetting = res.data[0].noticeSetting
      if (!noticesetting.includes(event.noticeName)) {
        return {
          errCode: 8000,
          errMsg: '通知未开启',
          errFix: '开启通知'
        }
      }
      const accountres = await db.collection('account').where({
        _id: event.uid
      }).get()
      if (accountres.data.length > 0) {
        const email = accountres.data[0].email
        if (email) {
          await nodemailer.createTransport(mailerconfig).sendMail({
            from: 'zhangls2512@vip.qq.com',
            to: email,
            subject: event.subject,
            text: event.text
          })
          return {
            errCode: 0,
            errMsg: '成功'
          }
        }
        return {
          errCode: 8001,
          errMsg: '账号未绑定邮箱',
          errFix: '绑定邮箱'
        }
      }
      return {
        errCode: 3000,
        errMsg: '账号不存在',
        errFix: '传递有效的uid'
      }
    }
    return {
      errCode: 3002,
      errMsg: '产品/功能未开通',
      errFix: '开通产品/功能'
    }
  } catch {
    return {
      errCode: 5000,
      errMsg: '内部错误',
      errFix: '联系客服'
    }
  }
}