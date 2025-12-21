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
    const validchangetypes = ['add', 'minus']
    if (!validchangetypes.includes(requestdata.changeType)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的changeType参数'
      }
    }
    if (!Number.isInteger(requestdata.number) || requestdata.number <= 0) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的number参数'
      }
    }
    if (typeof (requestdata.reason) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的reason参数'
      }
    }
    let command
    let changetypewz = ''
    if (requestdata.changeType == 'add') {
      command = db.command.inc(requestdata.number)
      changetypewz = '加'
    }
    if (requestdata.changeType == 'minus') {
      command = db.command.inc(-requestdata.number)
      changetypewz = '减'
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
        apiName: 'admin_newSslLimitChange'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const userres = await db.collection('productuser').where({
        product: 'ssl',
        uid: requestdata.uid
      }).get()
      if (userres.data.length == 0) {
        return {
          errCode: 8000,
          errMsg: '用户不存在',
          errFix: '传递有效的uid'
        }
      }
      await db.collection('productuser').where({
        product: 'ssl',
        uid: requestdata.uid
      }).update({
        productionLimit: command
      })
      await db.collection('ssllimitchange').add({
        changeType: requestdata.changeType,
        date: Date.now(),
        number: requestdata.number,
        reason: requestdata.reason,
        uid: requestdata.uid
      })
      app.callFunction({
        name: 'sendEmail',
        data: {
          uid: requestdata.uid,
          noticeName: 'ssl_email_limitchange',
          subject: 'SSL证书产品额度变更通知',
          text: '您的账号“SSL证书”产品额度发生变更，详情如下。\n' + '类型：' + changetypewz + '\n' + '数量：' + requestdata.number + '\n' + '原因：' + requestdata.reason + '\n' + '时间：' + moment().tz('Asia/Shanghai').format('YYYY年MM月DD日 HH:mm')
        }
      })
      app.callFunction({
        name: 'sendWebhook',
        data: {
          uid: requestdata.uid,
          data: {
            noticeName: 'ssl_email_limitchange',
            changeType: requestdata.changeType,
            number: requestdata.number,
            reason: requestdata.reason,
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