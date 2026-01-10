'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const acme = require('nodejs-acmeclient')
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
  if (typeof (requestdata.orderId) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的orderId参数'
    }
  }
  const validreasons = [0, 1, 4, 5]
  let reason = 0
  if (validreasons.includes(requestdata.reason)) {
    reason = requestdata.reason
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
      apiName: 'ssl_revokeCertificate'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const orderres = await db.collection('sslorder').where({
      _id: requestdata.orderId,
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
        reason: reason
      })
    } catch (err) {
      return {
        errCode: 8002,
        errMsg: 'CA返回错误，错误信息：' + err.detail,
        errFix: '联系客服'
      }
    }
    const certificates = data.certificate.map(item => item.value)
    await app.deleteFile({
      fileList: certificates
    })
    await db.collection('sslorder').where({
      _id: requestdata.orderId
    }).update({
      certificate: []
    })
    return {
      errCode: 0,
      errMsg: '成功'
    }
  }
}