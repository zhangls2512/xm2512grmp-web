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
        apiName: 'ssl_getAcmeAccountInfo'
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
      let productionaccountid = ''
      let stagingaccountid = ''
      let productionaccountstatus = ''
      let stagingaccountstatus = ''
      if (userres.data[0].accountKey.production) {
        productionaccountstatus = 'valid'
        const productionaccounturl = await acme.api.getAccountUrl({
          directoryUrl: 'https://acme-v02.api.letsencrypt.org/directory',
          accountKey: userres.data[0].accountKey.production
        })
        productionaccountid = productionaccounturl.split('/').pop()
      } else {
        productionaccountstatus = 'invalid'
      }
      if (userres.data[0].accountKey.staging) {
        stagingaccountstatus = 'valid'
        const stagingaccounturl = await acme.api.getAccountUrl({
          directoryUrl: 'https://acme-staging-v02.api.letsencrypt.org/directory',
          accountKey: userres.data[0].accountKey.staging
        })
        stagingaccountid = stagingaccounturl.split('/').pop()
      } else {
        stagingaccountstatus = 'invalid'
      }
      return {
        errCode: 0,
        errMsg: '成功',
        production: {
          id: productionaccountid,
          status: productionaccountstatus
        },
        staging: {
          id: stagingaccountid,
          status: stagingaccountstatus
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