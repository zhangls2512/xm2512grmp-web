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
  const requestdata = JSON.parse(event.body)
  const productmap = {
    password: '密码智能备忘录',
    todo: '智能待办',
    synologydsmhelper: 'SynDSM助手',
    homeassistanthelper: 'Home Assistant助手',
    webdavhelper: 'WebDAV助手'
  }
  if (typeof (requestdata.product) != 'string' || !productmap[requestdata.product]) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的product参数'
    }
  }
  if (typeof (requestdata.version) != 'string' || !/^\d+\.\d+\.\d+\.\d+$/.test(requestdata.version)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的version参数'
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
  if (validcontacttypes.includes(requestdata.contactType) && typeof (requestdata.contactValue) == 'string' && requestdata.contactValue) {
    contacttype = requestdata.contactType
    contactvalue = requestdata.contactValue
  }
  if (contacttype == '邮箱' && !validator.isEmail(contactvalue) && contactvalue != '未知') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的contactValue参数'
    }
  }
  if (contacttype == 'QQ' && !/^\d+$/.test(contactvalue) && contactvalue != '未知') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的contactValue参数'
    }
  }
  await nodemailertransport.sendMail({
    from: 'zhangls2512@vip.qq.com',
    to: '2300990296@qq.com',
    subject: '有新反馈',
    text: '产品：' + productmap[requestdata.product] + '\n版本：' + requestdata.version + '\n内容：' + requestdata.content + '\n联系方式：' + contactvalue + '（' + contacttype + '）'
  })
  return {
    errCode: 0,
    errMsg: '成功'
  }
}