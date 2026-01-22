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
        requestIp: event.headers['x-real-ip']
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
      environmentType: requestdata.accountType,
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
    if (!accountkey[requestdata.accountType]) {
      return {
        errCode: 8001,
        errMsg: 'ACME账户已停用',
        errFix: '无修复建议'
      }
    }
    try {
      await acme.api.deactivateAccount({
        directoryUrl: directoryurl,
        accountKey: accountkey[requestdata.accountType]
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
    accountkey[requestdata.accountType] = ''
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