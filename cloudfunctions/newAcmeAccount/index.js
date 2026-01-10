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
    const validaccounttypes = ['production', 'staging']
    if (!validaccounttypes.includes(event.accountType)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的accountType参数'
      }
    }
    let directoryurl = ''
    if (event.accountType == 'production') {
      directoryurl = 'https://acme-v02.api.letsencrypt.org/directory'
    }
    if (event.accountType == 'staging') {
      directoryurl = 'https://acme-staging-v02.api.letsencrypt.org/directory'
    }
    let type = ''
    let code = ''
    if (event.accessToken) {
      type = 'accesstoken'
      code = event.accessToken
    } else {
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
      if (userres.data[0].accountKey[event.accountType]) {
        return {
          errCode: 8000,
          errMsg: 'ACME账户处于可用状态',
          errFix: '无修复建议'
        }
      }
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
      const accountkey = userres.data[0].accountKey
      accountkey[event.accountType] = privatekey
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
  } catch {
    return {
      errCode: 5000,
      errMsg: '内部错误',
      errFix: '联系客服'
    }
  }
}