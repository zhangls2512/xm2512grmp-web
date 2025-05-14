'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const axios = require('axios')
  const crypto = require('crypto')
  const jsonwebtoken = require('jsonwebtoken')
  const moment = require('moment-timezone')
  const nodemailer = require('nodemailer')
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
  try {
    let key = ''
    let keyid = ''
    let issuerid = ''
    let aid = ''
    let product = ''
    let productwz = ''
    if (event.notificationMetaData.packageName == 'com.zhangxm.aipasswordmemo') {
      key = process.env.aipasswordmemokey
      keyid = '131ad2fc-d07d-4a0d-b09d-aa569c0dbe25'
      issuerid = '62471dcb-a075-46e4-95ec-d37e99dc1c8d'
      aid = '6917568345502278703'
      product = 'password'
      productwz = '密码智能备忘录'
    }
    const body = {
      purchaseToken: event.notificationMetaData.purchaseToken,
      purchaseOrderId: event.notificationMetaData.purchaseOrderId
    }
    const jwt = jsonwebtoken.sign({
      iss: issuerid,
      aud: 'iap-v1',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60,
      aid: aid,
      digest: crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex')
    }, key, {
      algorithm: 'ES256',
      header: {
        alg: 'ES256',
        typ: 'JWT',
        kid: keyid
      }
    })
    const authorization = 'Bearer ' + jwt
    let queryurl = ''
    let confirmurl = ''
    if (event.notificationMetaData.type == 2) {
      queryurl = 'https://iap.cloud.huawei.com/subscription/harmony/v1/application/subscription/status/query'
      confirmurl = 'https://iap.cloud.huawei.com/subscription/harmony/v1/application/purchase/shipped/confirm'
    } else {
      queryurl = 'https://iap.cloud.huawei.com/order/harmony/v1/application/order/status/query'
      confirmurl = 'https://iap.cloud.huawei.com/order/harmony/v1/application/purchase/shipped/confirm'
    }
    try {
      const res = await axios.post(queryurl, body, {
        headers: {
          Authorization: authorization
        }
      })
      let jws = ''
      if (event.notificationMetaData.type == 2) {
        jws = res.data.jwsSubGroupStatus
      } else {
        jws = res.data.jwsPurchaseOrder
      }
      const parts = jws.split('.')
      const payloadbase64url = parts[1]
      let base64 = payloadbase64url.replace(/-/g, '+').replace(/_/g, '/')
      const padding = base64.length % 4
      if (padding) {
        base64 += '='.repeat(4 - padding)
      }
      const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'))
      let productid = ''
      let purchaseOrderid = ''
      let uid = ''
      let typewz = ''
      let duration = -1
      if (event.notificationMetaData.type == 2) {
        productid = payload.lastSubscriptionStatus.lastPurchaseOrder.productId
        purchaseOrderid = payload.lastSubscriptionStatus.lastPurchaseOrder.purchaseOrderId
        uid = payload.lastSubscriptionStatus.lastPurchaseOrder.developerPayload
        typewz = '自动续订'
      } else {
        productid = payload.productId
        purchaseOrderid = payload.purchaseOrderId
        uid = payload.developerPayload
        typewz = '开通'
      }
      if (productid == 'DC3GXhbuWbw7tkpC') {
        duration = 0
      }
      if (productid == 'CG3_PfAJZa84niLQ' || productid == 'QIX7fU1KM3.IMVyb') {
        duration = 30
      }
      if (productid == 'eD9OBaei.m7VJUo_' || productid == 'jYXNGP2VEuQOoXPA') {
        duration = 90
      }
      if (productid == 'ZiRMWWgpOAXq3ErF' || productid == 'Y3V08cwoFrvLTPR7') {
        duration = 365
      }
      const userres = await db.collection('productuser').where({
        product: product,
        uid: uid
      }).get()
      let vipenddate = userres.data[0].vipEndDate
      if (vipenddate == 0) {
        return {
          errCode: 8001,
          errMsg: '已是终身会员',
          errFix: '无修复建议'
        }
      }
      try {
        await axios.post(confirmurl, body, {
          headers: {
            Authorization: authorization
          }
        })
        let vipenddatewz = ''
        if (duration == 0) {
          await db.collection('productuser').where({
            product: product,
            uid: uid
          }).update({
            vipEndDate: 0
          })
          vipenddatewz = '终身'
        } else {
          if (vipenddate < Date.now()) {
            vipenddate = Date.now()
          }
          await db.collection('productuser').where({
            product: product,
            uid: uid
          }).update({
            vipEndDate: vipenddate + duration * 86400000
          })
          vipenddatewz = moment(vipenddate + duration * 86400000).tz('Asia/Shanghai').format('YYYY年MM月DD日 HH:mm')
        }
        await db.collection('viplog').add({
          date: Date.now(),
          duration: duration,
          info: purchaseOrderid,
          product: product,
          type: 'pay',
          uid: uid
        })
        const accountres = await db.collection('account').where({
          _id: uid
        }).get()
        await nodemailer.createTransport(mailerconfig).sendMail({
          from: 'zhangls2512@vip.qq.com',
          to: accountres.data[0].email,
          subject: '会员' + typewz + '成功通知',
          text: '您的账号“' + productwz + '”产品会员' + typewz + '成功。\n到期时间：' + vipenddatewz + '\n订单号：' + purchaseOrderid
        })
        return {
          errCode: 0,
          errMsg: '成功'
        }
      } catch {
        return {
          errCode: 8002,
          errMsg: '订单确认发货失败',
          errFix: '联系客服'
        }
      }
    } catch {
      return {
        errCode: 8000,
        errMsg: '查询订单详情失败',
        errFix: '联系客服'
      }
    }
  } catch {
    return {
      errCode: 5000,
      errMsg: '内部错误',
      errFix: '联系客服'
    }
  }
}