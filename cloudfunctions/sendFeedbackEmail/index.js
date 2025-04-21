'use strict'
exports.main = async (event) => {
  const nodemailer = require('nodemailer')
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
    if (requestdata.key !== process.env.key) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递正确的key'
      }
    }
    const validproducts = ['密码智能备忘录']
    if (!validproducts.includes(requestdata.product)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的product参数'
      }
    }
    if (typeof (requestdata.content) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的content参数'
      }
    }
    await nodemailer.createTransport(mailerconfig).sendMail({
      from: 'zhangls2512@vip.qq.com',
      to: '2300990296@qq.com',
      subject: '有新反馈',
      text: '产品：' + requestdata.product + '\n内容：' + requestdata.content
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