'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const nodemailer = require('nodemailer')
  const validator = require('validator')
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
  if (typeof (requestdata.errorDesc) != 'string' || !requestdata.errorDesc) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的errorDesc参数'
    }
  }
  if (requestdata.errorObject && typeof (requestdata.errorObject) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的errorObject参数'
    }
  }
  const validcontacttypes = ['邮箱', '微信', 'QQ']
  if (!validcontacttypes.includes(requestdata.contactType)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的contactType参数'
    }
  }
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
  if (requestdata.contactType == 'QQ' && !/^\d+$/.test(requestdata.contactValue)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的contactValue参数'
    }
  }
  await db.collection('errorlog').add({
    contactType: requestdata.contactType,
    contactValue: requestdata.contactValue,
    errorDesc: requestdata.errorDesc,
    errorObject: requestdata.errorObject ?? '',
    product: requestdata.product,
    version: requestdata.version
  })
  let text = '产品：' + productmap[requestdata.product] + '\n版本：' + requestdata.version + '\n描述：' + requestdata.errorDesc + '\n联系方式：' + requestdata.contactValue + '（' + requestdata.contactType + '）'
  if (requestdata.errorObject) {
    text += '\n' + requestdata.errorObject
  }
  await nodemailertransport.sendMail({
    from: 'zhangls2512@vip.qq.com',
    to: '2300990296@qq.com',
    subject: '有新错误日志',
    text: text
  })
  return {
    errCode: 0,
    errMsg: '成功'
  }
}