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
    if (typeof (requestdata.id) != 'string') {
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
        permission: [],
        service: ['ssl'],
        apiName: 'ssl_deleteOrder'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const orderres = await db.collection('sslorder').where({
        _id: requestdata.id,
        uid: res.result.account._id
      }).get()
      if (orderres.data.length == 0) {
        return {
          errCode: 8000,
          errMsg: '订单不存在',
          errFix: '传递有效的id'
        }
      } else {
        let data = orderres.data[0]
        if (data.status == 'processing') {
          return {
            errCode: 8001,
            errMsg: '订单状态为签发中',
            errFix: '等待其状态变为已签发或已失效'
          }
        }
        if (data.status == 'valid' && data.certificate.length > 0) {
          return {
            errCode: 8002,
            errMsg: '订单下有证书',
            errFix: '吊销证书或等待订单状态变为已过期'
          }
        }
        const dnstaskres = await db.collection('dnstask').where({
          orderId: requestdata.id,
          status: db.command.in(['setpending', 'submitpending'])
        }).count()
        if (dnstaskres.total > 0) {
          return {
            errCode: 8003,
            errMsg: '存在未结束的DNS自动配置任务',
            errFix: '等待DNS自动配置任务全部结束或手动结束全部DNS自动配置任务'
          }
        } else {
          if (data.privateKey) {
            await app.deleteFile({
              fileList: [data.privateKey]
            })
          }
          if (data.certificate.length > 0) {
            const promise = data.certificate.map(async (item) => {
              await app.deleteFile({
                fileList: [item.value]
              })
            })
            await Promise.all(promise)
          }
          await db.collection('sslorder').where({
            _id: requestdata.id
          }).remove()
          return {
            errCode: 0,
            errMsg: '成功'
          }
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