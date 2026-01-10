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
        permission: [],
        service: ['ssl'],
        apiName: 'ssl_deactivateAcmeAccount'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const uid = res.result.account._id
      const orderres = await db.collection('sslorder').where({
        environmentType: event.accountType,
        uid: uid
      }).count()
      if (orderres.total > 0) {
        return {
          errCode: 8000,
          errMsg: 'ACME账户存在订单',
          errFix: '无修复建议'
        }
      }
      const userres = await db.collection('productuser').where({
        product: 'ssl',
        uid: uid
      }).get()
      const accountkey = userres.data[0].accountKey
      if (!accountkey[event.accountType]) {
        return {
          errCode: 8001,
          errMsg: 'ACME账户已停用',
          errFix: '无修复建议'
        }
      }
      try {
        await acme.api.deactivateAccount({
          directoryUrl: directoryurl,
          accountKey: accountkey[event.accountType]
        })
      } catch (err) {
        return {
          errCode: 8002,
          errMsg: 'CA返回错误，错误信息：' + err.detail,
          errFix: '联系客服'
        }
      }
      accountkey[event.accountType] = ''
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