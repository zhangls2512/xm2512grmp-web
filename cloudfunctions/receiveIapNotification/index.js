'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const nodemailer = require('nodemailer')
  const app = tcb.init()
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
    if (typeof (requestdata.jwsNotification) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的jwsNotification参数'
      }
    }
    const parts = requestdata.jwsNotification.split('.')
    if (parts.length != 3) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的jwsNotification参数'
      }
    }
    const payloadbase64url = parts[1]
    let base64 = payloadbase64url.replace(/-/g, '+').replace(/_/g, '/')
    const padding = base64.length % 4
    if (padding) {
      base64 += '='.repeat(4 - padding)
    }
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'))
    const validnotificationtypes = ['DID_NEW_TRANSACTION', 'REFUND_REQUEST']
    if (!validnotificationtypes.includes(payload.notificationType)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的jwsNotification参数'
      }
    }
    if (payload.notificationType == 'DID_NEW_TRANSACTION') {
      app.callFunction({
        name: 'openVip',
        data: payload
      })
    }
    if (payload.notificationType == 'REFUND_REQUEST') {
      let product = ''
      let reason = ''
      if (payload.notificationMetaData.packageName == 'com.zhangxm.aipasswordmemo') {
        product = '密码智能备忘录'
      }
      if (payload.notificationMetaData.refundRequestData.refundReason == 'LEGAL') {
        reason = '未成年人未经允许购买'
      }
      if (payload.notificationMetaData.refundRequestData.refundReason == 'UNINTENDED_PURCHASE') {
        reason = '无意购买或订阅'
      }
      if (payload.notificationMetaData.refundRequestData.refundReason == 'UNSATISFIED_WITH_PURCHASE') {
        reason = '购买的商品无法正常使用'
      }
      if (payload.notificationMetaData.refundRequestData.refundReason == 'FULFILLMENT_ISSUE') {
        reason = '未收到商品'
      }
      if (payload.notificationMetaData.refundRequestData.refundReason == 'OTHER') {
        reason = '其他原因'
      }
      await nodemailertransport.sendMail({
        from: 'zhangls2512@vip.qq.com',
        to: '2300990296@qq.com',
        subject: '有新退款申请',
        text: '产品：' + product + '\n理由：' + reason + '\n金额：' + payload.notificationMetaData.refundRequestData.applyAmount / 100 + '元\n批次号：' + payload.notificationMetaData.refundRequestData.refundBatchNo + '\n订单号：' + payload.notificationMetaData.refundRequestData.refundOrders[0].purchaseOrderId
      })
    }
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