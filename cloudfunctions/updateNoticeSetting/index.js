'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
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
    const validnoticenames = ['account_email_newbanlog', 'account_webhook_newbanlog']
    if (!validnoticenames.includes(requestdata.noticeName)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的noticeName参数'
      }
    }
    let product = requestdata.noticeName.split('_')[0]
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
        permission: ['account', product],
        service: [product],
        apiName: 'product_updateNoticeSetting'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const uid = res.result.account._id
      const userres = await db.collection('productuser').where({
        product: product,
        uid: uid
      }).get()
      if (userres.data.length > 0) {
        let noticesetting = userres.data[0].noticeSetting
        if (noticesetting.includes(requestdata.noticeName)) {
          noticesetting.splice(noticesetting.indexOf(requestdata.noticeName), 1)
        } else {
          noticesetting.push(requestdata.noticeName)
        }
        await db.collection('productuser').where({
          product: product,
          uid: uid
        }).update({
          noticeSetting: noticesetting
        })
        return {
          errCode: 0,
          errMsg: '成功'
        }
      } else {
        return {
          errCode: 8000,
          errMsg: '无数据',
          errFix: '联系客服'
        }
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