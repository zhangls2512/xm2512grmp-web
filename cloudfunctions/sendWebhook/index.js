'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const axios = require('axios')
  const app = tcb.init()
  const db = app.database()
  try {
    const product = event.noticeName.split('_')[0]
    const res = await db.collection('productuser').where({
      product: product,
      uid: event.uid
    }).get()
    if (res.data.length > 0) {
      const noticesetting = res.data[0].noticeSetting
      if (!noticesetting.includes(event.data.noticeName)) {
        return {
          errCode: 8000,
          errMsg: '通知未开启',
          errFix: '开启通知'
        }
      }
      const webhookurl = res.data[0].webhookUrl
      if (webhookurl) {
        try {
          await axios.post(webhookurl, event.data, {
            timeout: 20000
          })
          return {
            errCode: 0,
            errMsg: '成功'
          }
        } catch {
          return {
            errCode: 8001,
            errMsg: '请求webhookurl失败',
            errFix: '无修复建议'
          }
        }
      }
    } else {
      return {
        errCode: 3002,
        errMsg: '产品/功能未开通',
        errFix: '开通产品/功能'
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