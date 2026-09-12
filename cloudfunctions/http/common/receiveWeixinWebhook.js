exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const crypto = require('crypto')
  const moment = require('moment-timezone')
  const nodemailer = require('nodemailer')
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
  const query = event.queryStringParameters
  if (typeof (query.timestamp) != 'string' || !query.timestamp) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的timestamp参数'
    }
  }
  if (typeof (query.nonce) != 'string' || !query.nonce) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的nonce参数'
    }
  }
  const str = [process.env.wxxcxtoken, query.timestamp, query.nonce].sort().join('')
  const sigature = crypto.createHash('sha1').update(str).digest('hex')
  if (query.signature != sigature) {
    return {
      errCode: 1001,
      errMsg: '签名校验失败',
      errFix: '无修复建议'
    }
  }
  const body = JSON.parse(event.body)
  let deal = false
  if (body.appid == 'wx1146ee46b77583ec' && body.Event == 'wxa_media_check') {
    deal = true
    await db.collection('mediachecklog').where({
      traceId: body.trace_id
    }).update({
      result: body.errcode == 0 ? body.result : {
        suggest: 'error',
        errCode: body.errcode
      }
    })
  }
  if (body.Event == 'xpay_complaint_notify') {
    deal = true
    await nodemailertransport.sendMail({
      from: 'zhangls2512@vip.qq.com',
      to: '2300990296@qq.com',
      subject: 'SSL证书微信小程序虚拟支付订单收到用户投诉',
      text: '用户openid：' + body.OpenId + '\n订单ID：' + body.MchOrderId + '\n微信订单ID：' + body.WxOrderId + '\n投诉描述：' + body.ComplaintDetail
    })
  }
  if (body.Event == 'xpay_goods_deliver_notify') {
    deal = true
    const ordergetres = await db.collection('sslpayorder').where({
      orderId: body.OutTradeNo
    }).get()
    const data = ordergetres.data
    if (data.length == 0) {
      await nodemailertransport.sendMail({
        from: 'zhangls2512@vip.qq.com',
        to: '2300990296@qq.com',
        subject: 'SSL证书微信小程序虚拟支付订单不存在',
        text: '用户openid：' + body.OpenId + '\n订单ID：' + body.OutTradeNo + '\n微信订单ID：' + body.WeChatPayInfo.MchOrderNo
      })
    } else {
      const info = ordergetres.data[0]
      if (!info.finished) {
        await db.collection('sslpayorder').where({
          orderId: body.OutTradeNo
        }).update({
          finished: true,
          wxOrderId: body.WeChatPayInfo.MchOrderNo,
          finishTime: Date.now()
        })
        const userres = await db.collection('productuser').where({
          product: 'ssl',
          uid: info.uid
        }).get()
        if (userres.data.length > 0) {
          await db.collection('productuser').where({
            product: 'ssl',
            uid: info.uid
          }).update({
            productionLimit: db.command.inc(4 * info.count)
          })
          await db.collection('ssllimitchange').add({
            changeType: 'add',
            date: Date.now(),
            number: 4 * info.count,
            reason: '微信小程序虚拟支付（订单ID：' + body.OutTradeNo + '）',
            uid: info.uid
          })
          app.callFunction({
            name: 'sendEmail',
            data: {
              uid: info.uid,
              noticeName: 'ssl_email_limitchange',
              subject: 'SSL证书产品额度变更通知',
              text: '您的账号“SSL证书”产品额度发生变更，详情如下。\n类型：加\n数量：' + 4 * info.count + '\n原因：微信小程序虚拟支付（订单ID：' + body.OutTradeNo + '）\n时间：' + moment().tz('Asia/Shanghai').format('YYYY年MM月DD日 HH:mm')
            }
          })
          app.callFunction({
            name: 'sendWebhook',
            data: {
              uid: info.uid,
              data: {
                noticeName: 'ssl_email_limitchange',
                changeType: 'add',
                number: 4 * info.count,
                reason: '微信小程序虚拟支付（订单ID：' + body.OutTradeNo + '）',
                date: Date.now()
              }
            }
          })
        }
      }
    }
  }
  if (!deal) {
    await nodemailertransport.sendMail({
      from: 'zhangls2512@vip.qq.com',
      to: '2300990296@qq.com',
      subject: '收到微信推送',
      text: event.body
    })
  }
  return {
    ErrCode: 0
  }
}