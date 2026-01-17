'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const crypto = require('crypto')
  const jsonwebtoken = require('jsonwebtoken')
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
  const requestdata = JSON.parse(event.body)
  if (typeof (requestdata.jwsNotification) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的jwsNotification参数'
    }
  }
  function verifyJwtWithX5C(jwt) {
    try {
      const decoded = jsonwebtoken.decode(jwt, {
        complete: true
      })
      const header = decoded.header
      if (header.x5c.length != 3) {
        return false
      }
      if (header.x5c[2] != 'MIICGjCCAaGgAwIBAgIIShhpn519jNAwCgYIKoZIzj0EAwMwUzELMAkGA1UEBhMCQ04xDzANBgNVBAoMBkh1YXdlaTETMBEGA1UECwwKSHVhd2VpIENCRzEeMBwGA1UEAwwVSHVhd2VpIENCRyBSb290IENBIEcyMB4XDTIwMDMxNjAzMDQzOVoXDTQ5MDMxNjAzMDQzOVowUzELMAkGA1UEBhMCQ04xDzANBgNVBAoMBkh1YXdlaTETMBEGA1UECwwKSHVhd2VpIENCRzEeMBwGA1UEAwwVSHVhd2VpIENCRyBSb290IENBIEcyMHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEWidkGnDSOw3/HE2y2GHl+fpWBIa5S+IlnNrsGUvwC1I2QWvtqCHWmwFlFK95zKXiM8s9yV3VVXh7ivN8ZJO3SC5N1TCrvB2lpHMBwcz4DA0kgHCMm/wDec6kOHx1xvCRo0IwQDAOBgNVHQ8BAf8EBAMCAQYwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUo45a9Vq8cYwqaiVyfkiS4pLcIAAwCgYIKoZIzj0EAwMDZwAwZAIwMypeB7P0IbY7c6gpWcClhRznOJFj8uavrNu2PIoz9KIqr3jnBlBHJs0myI7ntYpEAjBbm8eDMZY5zq5iMZUC6H7UzYSix4Uy1YlsLVV738PtKP9hFTjgDHctXJlC5L7+ZDY=') {
        return false
      }
      const certificates = header.x5c.map(item => new crypto.X509Certificate(Buffer.from(item, 'base64')))
      for (let i = 0; i < certificates.length - 1; i++) {
        const subjectcert = certificates[i]
        const issuercert = certificates[i + 1]
        if (!subjectcert.checkIssued(issuercert) || !subjectcert.verify(issuercert.publicKey)) {
          return false
        }
      }
      jsonwebtoken.verify(jwt, certificates[0].publicKey)
      return true
    } catch {
      return false
    }
  }
  if (!verifyJwtWithX5C(requestdata.jwsNotification)) {
    return {
      errCode: 1001,
      errMsg: 'jwsNotification签名校验失败',
      errFix: '无修复建议'
    }
  }
  const payload = jsonwebtoken.decode(requestdata.jwsNotification)
  const validnotificationtypes = ['DID_NEW_TRANSACTION', 'REFUND_REQUEST']
  if (!validnotificationtypes.includes(payload.notificationType)) {
    return {
      errCode: 1001,
      errMsg: '暂不支持处理此notificationType',
      errFix: '无修复建议'
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
}