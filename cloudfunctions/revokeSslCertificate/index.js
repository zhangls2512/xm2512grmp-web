'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const acme = require('nodejs-acmeclient')
  const app = tcb.init()
  const auth = app.auth()
  const db = app.database()
  try {
    if (typeof (event.accessToken) != 'string' && typeof (event.accessKey) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的accessToken或accessKey参数'
      }
    }
    if (typeof (event.orderId) != 'string' || event.orderId.length != 32) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的orderId参数'
      }
    }
    const validreasons = [0, 1, 4, 5]
    if (!validreasons.includes(event.reason)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的reason参数'
      }
    }
    let type = ''
    let code = ''
    if (event.accessToken) {
      type = 'accesstoken'
      code = event.accessToken
    } else {
      if (!event.accessKey) {
        return {
          errCode: 1001,
          errMsg: '请求参数错误',
          errFix: '传递有效的accessKey参数'
        }
      }
      type = 'accesskey'
      code = event.accessKey
    }
    const res = await app.callFunction({
      name: 'authCheck',
      data: {
        type: type,
        data: {
          code: code,
          requestIp: auth.getClientIP()
        },
        permission: [],
        service: ['ssl'],
        apiName: 'ssl_revokeCertificate'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const orderres = await db.collection('sslorder').where({
        _id: event.orderId,
        uid: res.result.account._id
      }).get()
      if (orderres.data.length == 0) {
        return {
          errCode: 8000,
          errMsg: '订单不存在',
          errFix: '无修复建议'
        }
      }
      const data = orderres.data[0]
      const userres = await db.collection('productuser').where({
        product: 'ssl',
        uid: res.result.account._id
      }).get()
      let directoryurl = ''
      let accountkey = ''
      if (data.environmentType == 'production') {
        directoryurl = 'https://acme-v02.api.letsencrypt.org/directory'
        accountkey = userres.data[0].accountKey.production
      }
      if (data.environmentType == 'staging') {
        directoryurl = 'https://acme-staging-v02.api.letsencrypt.org/directory'
        accountkey = userres.data[0].accountKey.staging
      }
      const certificateres = await app.downloadFile({
        fileID: data.certificate[0].value
      })
      try {
        await acme.api.revokeCertificate({
          directoryUrl: directoryurl,
          accountKey: accountkey,
          certificate: certificateres.fileContent.toString(),
          reason: event.reason
        })
      } catch (err) {
        if (err.detail) {
          return {
            errCode: 8002,
            errMsg: 'CA返回错误，错误信息：' + err.detail,
            errFix: '联系客服'
          }
        } else {
          return {
            errCode: 8003,
            errMsg: '请求CA服务器失败，错误信息：' + err.code,
            errFix: '联系客服'
          }
        }
      }
      const certificates = data.certificate.map(item => item.value)
      await app.deleteFile({
        fileList: certificates
      })
      await db.collection('sslorder').where({
        _id: event.orderId
      }).update({
        certificate: []
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