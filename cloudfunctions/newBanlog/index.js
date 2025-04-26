'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const moment = require('moment-timezone')
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
    if (typeof (requestdata.uid) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的uid参数'
      }
    }
    if (typeof (requestdata.content) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的content参数'
      }
    }
    if (typeof (requestdata.method) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的method参数'
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
        permission: ['account', 'admin'],
        service: ['admin'],
        apiName: 'admin_newBanlog'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const accountres = await db.collection('account').where({
        _id: requestdata.uid
      }).get()
      if (accountres.data.length == 0) {
        return {
          errCode: 8000,
          errMsg: '用户不存在',
          errFix: '传递有效的uid参数'
        }
      }
      await db.collection('banlog').add({
        content: requestdata.content,
        date: Date.now(),
        method: requestdata.method,
        uid: requestdata.uid
      })
      app.callFunction({
        name: 'sendEmail',
        data: {
          uid: requestdata.uid,
          noticeName: 'account_email_newbanlog',
          subject: '违规记录新增通知',
          text: '您的账号有新的违规记录，详情如下。\n' + '违规内容：' + requestdata.content + '\n' + '处罚方式：' + requestdata.method + '\n' + '时间：' + moment().tz('Asia/Shanghai').format('YYYY年MM月DD日 HH:mm')
        }
      })
      app.callFunction({
        name: 'sendWebhook',
        data: {
          uid: requestdata.uid,
          data: {
            noticeName: 'account_webhook_newbanlog',
            content: requestdata.content,
            method: requestdata.method,
            date: Date.now()
          }
        }
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