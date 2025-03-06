'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const acme = require('nodejs-acmeclient')
  const app = tcb.init()
  const auth = app.auth()
  const issdk = auth.getUserInfo().isAnonymous
  const db = app.database()
  let requestdata = ''
  let requestip = ''
  if (issdk) {
    requestdata = event
    requestip = auth.getClientIP()
  } else {
    requestdata = JSON.parse(event.body)
    requestip = event.headers['x-real-ip']
    if (event.httpMethod != 'POST') {
      return {
        errCode: 1000,
        errMsg: '请求方法错误',
        errFix: '使用POST方法请求'
      }
    }
  }
  try {
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
          requestIp: requestip
        },
        permission: [],
        service: ['ssl'],
        apiName: 'ssl_refreshOrder'
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
        if (data.status != 'ready') {
          return {
            errCode: 8001,
            errMsg: '订单状态为待提交时才能提交',
            errFix: '无修复建议'
          }
        }
        const userres = await db.collection('productuser').where({
          product: 'ssl',
          uid: res.result.account._id
        })
        const userdata = userres.data[0]
        let directoryurl = ''
        if (data.environmentType == 'production') {
          directoryurl = 'https://acme-v02.api.letsencrypt.org/directory'
        }
        if (data.environmentType == 'staging') {
          directoryurl = 'https://acme-staging-v02.api.letsencrypt.org/directory'
        }
        const accountkey = userdata.accountKey[data.environmentType]
        let csr = ''
        if (data.csr) {
          csr = data.csr
        } else {
          let privatekey = ''
          if (data.keyType == 'rsa') {
            privatekey = acme.crypto.generateRSAKeyPair(data.keySize).privateKey
          }
          if (data.keyType == 'ecdsa') {
            privatekey = acme.crypto.generateECDSAKeyPair(data.keySize).privateKey
          }
          csr = acme.crypto.generateCsr({
            subjectAltName: data.domains,
            privateKey: privatekey
          })
        }
        try {
          await acme.api.finalizeOrder({
            directoryUrl: directoryurl,
            accountKey: accountkey,
            orderUrl: data.orderUrl,
            csr: csr
          })
        } catch (err) {
          return {
            errCode: 8002,
            errMsg: 'CA返回错误，错误信息：' + err.detail,
            errFix: '联系客服'
          }
        }
        const uploadres = await app.uploadFile({
          cloudPath: 'sslorder/' + requestdata.id + '/' + data.domains[0] + '.key',
          fileContent: Buffer.from(privatekey)
        })
        await db.collection('sslorder').where({
          _id: requestdata.id
        }).update({
          privateKey: uploadres.fileID,
          status: 'processing'
        })
        return {
          errCode: 0,
          errMsg: '成功'
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