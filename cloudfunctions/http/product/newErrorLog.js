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
  const validproducts = ['password', 'synologydsmhelper']
  if (!validproducts.includes(requestdata.product)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的product参数'
    }
  }
  let productwz = ''
  if (requestdata.product == 'password') {
    productwz = '密码智能备忘录'
  }
  if (requestdata.product == 'synologydsmhelper') {
    productwz = 'SynDSM助手'
  }
  if (typeof (requestdata.version) != 'string' || !/^\d+\.\d+\.\d+\.\d+$/.test(requestdata.version)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的version参数'
    }
  }
  if (typeof (requestdata.errorObject) != 'object') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的errorObject参数'
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
  await db.collection('errorlog').add({
    contactType: contacttype,
    contactValue: contactvalue,
    errorObject: requestdata.errorObject,
    product: requestdata.product,
    version: requestdata.version
  })
  await nodemailertransport.sendMail({
    from: 'zhangls2512@vip.qq.com',
    to: '2300990296@qq.com',
    subject: '有新错误日志',
    text: '产品：' + productwz + '\n版本：' + requestdata.version + '\n联系方式：' + contactvalue + '（' + contacttype + '）\n' + JSON.stringify(requestdata.errorObject)
  })
  return {
    errCode: 0,
    errMsg: '成功'
  }
}