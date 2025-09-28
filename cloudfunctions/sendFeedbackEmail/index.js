'use strict'
exports.main = async (event) => {
  const nodemailer = require('nodemailer')
  const validator = require('validator')
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
    if (typeof (requestdata.content) != 'string' || !requestdata.content) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的content参数'
      }
    }
    let contacttype = '未知'
    let contactvalue = '未知'
    const validcontacttypes = ['邮箱', '微信', 'QQ']
    if (validcontacttypes.includes(requestdata.contactType)) {
      if (typeof (requestdata.contactValue) != 'string' || !requestdata.contactValue) {
        return {
          errCode: 1001,
          errMsg: '请求参数错误',
          errFix: '传递有效的contactValue参数'
        }
      }
      if (requestdata.contactType == '邮箱' && !validator.isEmail(requestdata.contactValue)) {
        return {
          errCode: 1001,
          errMsg: '请求参数错误',
          errFix: '传递有效的contactValue参数'
        }
      }
      contacttype = requestdata.contactType
      contactvalue = requestdata.contactValue
    }
    await nodemailertransport.sendMail({
      from: 'zhangls2512@vip.qq.com',
      to: '2300990296@qq.com',
      subject: '有新反馈',
      text: '产品：' + requestdata.product + '\n内容：' + requestdata.content + '\n联系方式：' + contactvalue + '（' + contacttype + '）'
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