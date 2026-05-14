'use strict'
exports.main = async (event) => {
  const axios = require('axios')
  const nodemailer = require('nodemailer')
  const nodemailertransport = nodemailer.createTransport({
    host: 'smtp.qq.com',
    secure: true,
    auth: {
      user: 'zhangls2512@vip.qq.com',
      pass: process.env.mailtoken
    }
  })
  if (event.httpMethod != 'POST') {
    return {
      errCode: 1000,
      errMsg: '请求方法错误',
      errFix: '使用POST方法请求'
    }
  }
  const requestdata = JSON.parse(event.body)
  if (typeof (requestdata.text) != 'string' || !requestdata.text) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的text参数'
    }
  }
  await nodemailertransport.sendMail({
    from: 'zhangls2512@vip.qq.com',
    to: '2300990296@qq.com',
    subject: '群晖NAS通知',
    text: requestdata.text
  })
  return {
    errCode: 0,
    errMsg: '成功'
  }
}