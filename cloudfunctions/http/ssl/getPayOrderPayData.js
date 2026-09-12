'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const axios = require('axios')
  const crypto = require('crypto')
  const app = tcb.init()
  const db = app.database()
  if (event.httpMethod != 'POST') {
    return {
      errCode: 1000,
      errMsg: '请求方法错误',
      errFix: '使用POST方法请求'
    }
  }
  const requestdata = JSON.parse(event.body)
  if (typeof (requestdata.accessToken) != 'string' && typeof (requestdata.accessKey) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的accessToken或accessKey参数'
    }
  }
  if (typeof (requestdata.id) != 'string' || requestdata.id.length != 36) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的id参数'
    }
  }
  let type = ''
  let code = ''
  if (requestdata.accessToken) {
    type = 'accesstoken'
    code = requestdata.accessToken
  } else {
    if (!requestdata.accessKey) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的accessKey参数'
      }
    }
    type = 'accesskey'
    code = requestdata.accessKey
  }
  const res = await app.callFunction({
    name: 'authCheck',
    data: {
      type: type,
      data: {
        code: code,
        requestIp: event.headers['x-real-ip']
      },
      permission: ['account', 'ssl'],
      service: ['ssl'],
      apiName: 'ssl_getPayOrderPayData'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const uid = res.result.account._id
    const ordergetres = await db.collection('sslpayorder').where({
      orderId: requestdata.id,
      uid: uid,
      finished: false
    }).get()
    if (ordergetres.data.length == 0) {
      return {
        errCode: 8000,
        errMsg: '订单不存在',
        errFix: '无修复建议'
      }
    }
    const externalaccountres = await db.collection('externalaccount').where({
      platform: 'sslwxxcx',
      uid: uid
    }).get()
    if (externalaccountres.data.length == 0) {
      return {
        errCode: 8001,
        errMsg: '未绑定微信',
        errFix: '无修复建议'
      }
    }
    const info = externalaccountres.data[0]
    if (!info.sessionKey) {
      return {
        errCode: 8002,
        errMsg: '无微信登录态',
        errFix: '重新微信登录或绑定微信'
      }
    }
    const tokenres = await axios.post('https://api.weixin.qq.com/cgi-bin/stable_token', {
      grant_type: 'client_credential',
      appid: 'wxd46f84216a1a856e',
      secret: process.env.sslappsecret
    })
    if (tokenres.data.errcode) {
      return {
        errCode: 8003,
        errMsg: 'access_token获取失败，原因：' + tokenres.data.errmsg,
        errFix: '无修复建议'
      }
    }
    const checkres = await axios.get('https://api.weixin.qq.com/wxa/checksession?access_token=' + tokenres.data.access_token + '&openid=' + info.openid + '&signature=' + crypto.createHmac('sha256', info.sessionKey).update('').digest('hex') + '&sig_method=hmac_sha256')
    if (checkres.data.errcode) {
      return {
        errCode: 8004,
        errMsg: '微信登录态无效，原因：' + checkres.data.errmsg,
        errFix: '重新微信登录或绑定微信'
      }
    }
    const data = ordergetres.data[0]
    const signdata = {
      offerId: '1450647015',
      buyQuantity: data.count,
      env: 0,
      currencyType: 'CNY',
      productId: data.productId,
      goodsPrice: 100,
      outTradeNo: data.orderId,
      attach: ''
    }
    const signdatastr = JSON.stringify(signdata)
    return {
      errCode: 0,
      errMsg: '成功',
      signData: signdatastr,
      paySignature: crypto.createHmac('sha256', process.env.sslappkey).update('requestVirtualPayment&' + signdatastr).digest('hex'),
      sessionSignature: crypto.createHmac('sha256', info.sessionKey).update(signdatastr).digest('hex')
    }
  }
}