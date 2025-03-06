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
    const validaccounttypes = ['production', 'staging']
    if (!validaccounttypes.includes(requestdata.accountType)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的accountType参数'
      }
    }
    let directoryurl = ''
    if (requestdata.accountType == 'production') {
      directoryurl = 'https://acme-v02.api.letsencrypt.org/directory'
    }
    if (requestdata.accountType == 'staging') {
      directoryurl = 'https://acme-staging-v02.api.letsencrypt.org/directory'
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
        permission: ['account', 'ssl'],
        service: ['ssl'],
        apiName: 'ssl_newAcmeAccount'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const uid = res.result.account._id
      const userres = await db.collection('productuser').where({
        product: 'ssl',
        uid: uid
      }).get()
      if (userres.data[0].accountKey[requestdata.accountType]) {
        return {
          errCode: 8000,
          errMsg: 'ACME账户处于可用状态',
          errFix: '无需重复创建'
        }
      } else {
        const privatekey = acme.crypto.generateECDSAKeyPair('secp384r1').privateKey
        try {
          await acme.api.newAccount({
            directoryUrl: directoryurl,
            accountKey: privatekey
          })
        } catch (err) {
          return {
            errCode: 8001,
            errMsg: 'CA返回错误，错误信息：' + err.detail,
            errFix: '联系客服'
          }
        }
        let accountkey = userres.data[0].accountKey
        accountkey[requestdata.accountType] = privatekey
        await db.collection('productuser').where({
          product: 'ssl',
          uid: uid
        }).update({
          accountKey: accountkey
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