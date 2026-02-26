'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const axios = require('axios')
  const crypto = require('crypto')
  const fs = require('fs')
  const app = tcb.init()
  const db = app.database()
  try {
    const product = event.data.noticeName.split('_')[0]
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
          const data = JSON.stringify(event.data)
          const timestamp = Date.now()
          const privatekey = fs.readFileSync('./privatekey.txt')
          const hash = crypto.createHash('sha512').update(data + '\0' + timestamp).digest()
          const signature = crypto.createSign('sha512').update(hash).sign(privatekey).toString('base64')
          await axios.post(webhookurl, {
            data: data,
            timeStamp: timestamp,
            signature: signature
          }, {
            timeout: 20000
          })
          return {
            errCode: 0,
            errMsg: '成功'
          }
        } catch (err) {
          return {
            errCode: 8001,
            errMsg: '请求webhookUrl失败，原因：' + err.message,
            errFix: '参考原因发起测试请求排查问题或联系客服'
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