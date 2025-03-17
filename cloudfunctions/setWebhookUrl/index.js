'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const axios = require('axios')
  const validator = require('validator')
  const app = tcb.init()
  const db = app.database()
  if (event.httpMethod != 'POST') {
    return {
      errCode: 1000,
      errMsg: '请求方法错误',
      errFix: '使用POST方法请求'
    }
  }
  try {
    const requestdata = JSON.parse(event.body)
    if (typeof (requestdata.accessToken) != 'string' && typeof (requestdata.accessKey) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的accessToken或accessKey参数'
      }
    }
    const validproducts = ['account', 'admin', 'resource', 'resourcecreator', 'ssl']
    if (!validproducts.includes(requestdata.product)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的product参数'
      }
    }
    if (typeof (requestdata.webhookUrl) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的webhookUrl参数'
      }
    }
    if (requestdata.webhookUrl && !validator.isURL(requestdata.webhookUrl, {
      protocols: ['https'],
      require_protocol: true
    })) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的webhookUrl参数'
      }
    }
    let type = ''
    let code = ''
    if (requestdata.accessToken) {
      type = 'accesstoken'
      code = requestdata.accessToken
    } else {
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
        permission: ['account', requestdata.product],
        service: [requestdata.product],
        apiName: 'product_setWebhookUrl'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const uid = res.result.account._id
      const userres = await db.collection('productuser').where({
        product: requestdata.product,
        uid: uid
      }).get()
      const webhooktoken = userres.data[0].webhookToken
      if (requestdata.webhookUrl) {
        try {
          const { data } = await axios.get(requestdata.webhookUrl + '/' + requestdata.product + '/xm2512webhooktoken.txt', {
            timeout: 5000
          })
          if (data != webhooktoken) {
            return {
              errCode: 8000,
              errMsg: 'webhookToken错误',
              errFix: '放置正确的webhhookToken'
            }
          }
        } catch {
          return {
            errCode: 8001,
            errMsg: '请求webhookUrl失败',
            errFix: '发起测试请求排查问题'
          }
        }
      }
      await db.collection('productuser').where({
        product: requestdata.product,
        uid: uid
      }).update({
        webhookUrl: requestdata.webhookUrl
      })
      return {
        errCode: 0,
        errMsg: '成功'
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