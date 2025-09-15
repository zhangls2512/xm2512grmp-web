'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const nodemailer = require('nodemailer')
  const mailerconfig = {
    host: 'smtp.qq.com',
    secure: true,
    auth: {
      user: 'zhangls2512@vip.qq.com',
      pass: process.env.mailtoken
    }
  }
  const app = tcb.init()
  const db = app.database()
  if (event.httpMethod != 'POST') {
    return {
      errCode: 1000,
      errMsg: '请求方法错误',
      errFix: '使用POST方法请求'
    }
  }
  try {
    const requestdata = JSON.parse(event.body)
    if (requestdata.key !== process.env.key) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递正确的key'
      }
    }
    if (typeof (requestdata.object) != 'object') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的object参数'
      }
    }
    await db.collection('errorlog').add({
      object: requestdata.object
    })
    await nodemailer.createTransport(mailerconfig).sendMail({
      from: 'zhangls2512@vip.qq.com',
      to: '2300990296@qq.com',
      subject: '有新错误日志',
      text: JSON.stringify(requestdata.object)
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