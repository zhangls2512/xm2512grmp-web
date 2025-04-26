'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const nodemailer = require('nodemailer')
  const validator = require('validator')
  const { customAlphabet } = await import('nanoid')
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
  if (event.httpMethod != 'POST') {
    return {
      errCode: 1000,
      errMsg: '请求方法错误',
      errFix: '使用POST方法请求'
    }
  }
  try {
    const requestdata = JSON.parse(event.body)
    if (typeof (requestdata.email) != 'string' || !validator.isEmail(requestdata.email)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的email参数'
      }
    }
    const res = await db.collection('emailcode').where({
      email: requestdata.email
    }).get()
    if (res.data.length > 0) {
      const data = res.data[0]
      if (Date.now() < data.timeStamp + 60000 && !data.used) {
        return {
          errCode: 8000,
          errMsg: '获取验证码过于频繁',
          errFix: (((data.timeStamp + 60000) - Date.now()) / 1000).toFixed(0) + '秒后重试'
        }
      }
      const random = customAlphabet('0123456789', 8)
      const emailcode = random()
      await db.collection('emailcode').where({
        _id: data._id
      }).update({
        emailCode: emailcode,
        timeStamp: Date.now(),
        used: false,
        verifyTimes: 0
      })
      await nodemailer.createTransport(mailerconfig).sendMail({
        from: 'zhangls2512@vip.qq.com',
        to: requestdata.email,
        subject: '轩铭2512统一账号邮箱验证码',
        text: '验证码：' + emailcode + '，有效期5分钟。请勿泄露给他人。'
      })
      return {
        errCode: 0,
        errMsg: '成功'
      }
    }
    const random = customAlphabet('0123456789', 8)
    const emailcode = random()
    await db.collection('emailcode').add({
      email: requestdata.email,
      emailCode: emailcode,
      timeStamp: Date.now(),
      used: false,
      verifyTimes: 0
    })
    await nodemailer.createTransport(mailerconfig).sendMail({
      from: 'zhangls2512@vip.qq.com',
      to: requestdata.email,
      subject: '轩铭2512统一账号邮箱验证码',
      text: '验证码：' + emailcode + '，有效期5分钟。请勿泄露给他人。'
    })
    return {
      errCode: 0,
      errMsg: '成功'
    }
  } catch {
    return {
      errCode: 5000,
      errMsg: '内部错误',
      errFix: '联系客服'
    }
  }
}