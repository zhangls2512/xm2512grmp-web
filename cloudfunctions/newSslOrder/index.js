'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const net = require('net')
  const acme = require('nodejs-acmeclient')
  const validator = require('validator')
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
    let csr = ''
    let domains = []
    let desc = ''
    let keytype = ''
    let keysize = ''
    if (typeof (event.desc) == 'string' && event.desc.length <= 20) {
      desc = event.desc
    }
    if (typeof (event.csr) != 'string' || event.csr === '') {
      if (!Array.isArray(event.domains) || event.domains.length == 0 || event.domains.length > 100) {
        return {
          errCode: 1001,
          errMsg: '请求参数错误',
          errFix: '传递有效的domains参数'
        }
      }
      domains = [...new Set(event.domains)]
      if (domains.some(item => !validator.isFQDN(item, {
        allow_wildcard: true
      }) && !net.isIP(item))) {
        return {
          errCode: 1001,
          errMsg: '请求参数错误',
          errFix: '传递有效的domains参数'
        }
      }
      const validkeytypes = ['rsa', 'ecdsa']
      if (!validkeytypes.includes(event.keyType)) {
        return {
          errCode: 1001,
          errMsg: '请求参数错误',
          errFix: '传递有效的keyType参数'
        }
      }
      keytype = event.keyType
      const validrsakeysizes = [2048, 3072, 4096]
      const validecdsakeysizes = ['prime256v1', 'secp384r1']
      if (event.keyType == 'rsa' && !validrsakeysizes.includes(event.keySize)) {
        return {
          errCode: 1001,
          errMsg: '请求参数错误',
          errFix: '传递有效的keySize参数'
        }
      }
      if (event.keyType == 'ecdsa' && !validecdsakeysizes.includes(event.keySize)) {
        return {
          errCode: 1001,
          errMsg: '请求参数错误',
          errFix: '传递有效的keySize参数'
        }
      }
      keysize = event.keySize
    } else {
      const csrres = acme.crypto.getCsrInfo(event.csr)
      domains = [...new Set([...csrres.subjectAltName, csrres.commonName])]
      if (domains.length == 0 || domains.length > 100) {
        return {
          errCode: 1001,
          errMsg: '请求参数错误',
          errFix: '传递有效的csr参数'
        }
      }
      csr = event.csr
      const keyres = acme.crypto.getKeyInfo(csrres.publicKey)
      keytype = keyres.keyType.toLowerCase()
      if (keyres.keyType == 'RSA') {
        keysize = keyres.keyBits
      }
      if (keyres.keyType == 'ECDSA') {
        keysize = keyres.curveName
      }
    }
    const validenvironmenttypes = ['production', 'staging']
    if (!validenvironmenttypes.includes(event.environmentType)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的environmentType参数'
      }
    }
    const validcertificatetypes = ['classic', 'shortlived', 'tlsserver', 'tlsclient']
    if (!validcertificatetypes.includes(event.certificateType)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的certificateType参数'
      }
    }
    if (event.certificateType != 'shortlived' && domains.some(item => net.isIP(item))) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的certificateType参数'
      }
    }
    if (event.certificateType != 'classic' && event.certificateType != 'tlsclient' && domains.length > 25) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的certificateType参数'
      }
    }
    const validautoneworder = ['ari', 'nearexpire', 'close']
    if (!validautoneworder.includes(event.autoNewOrder)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的autoNewOrder参数'
      }
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
        apiName: 'ssl_newOrder'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const userres = await db.collection('productuser').where({
        product: 'ssl',
        uid: res.result.account._id
      }).get()
      const userdata = userres.data[0]
      if (event.environmentType == 'production' && userdata.productionLimit <= 0) {
        return {
          errCode: 8000,
          errMsg: '额度耗尽',
          errFix: '无修复建议'
        }
      }
      if (event.environmentType == 'staging' && userdata.stagingLimit <= 0) {
        return {
          errCode: 8000,
          errMsg: '额度耗尽',
          errFix: '无修复建议'
        }
      }
      let directoryurl = ''
      if (event.environmentType == 'production') {
        directoryurl = 'https://acme-v02.api.letsencrypt.org/directory'
      }
      if (event.environmentType == 'staging') {
        directoryurl = 'https://acme-staging-v02.api.letsencrypt.org/directory'
      }
      const accountkey = userdata.accountKey[event.environmentType]
      let acmeorder = {}
      try {
        const acmeorderres = await acme.api.newOrder({
          directoryUrl: directoryurl,
          accountKey: accountkey,
          domains: domains,
          profile: event.certificateType
        })
        acmeorder = acmeorderres
      } catch (err) {
        return {
          errCode: 8001,
          errMsg: 'CA返回错误，错误信息：' + err.detail,
          errFix: '联系客服'
        }
      }
      const orderres = await db.collection('sslorder').add({
        ariEndDate: 0,
        ariStartDate: 0,
        autoNewOrder: event.autoNewOrder,
        certificate: [],
        certificateEndDate: 0,
        certificateStartDate: 0,
        certificateType: event.certificateType,
        createDate: Date.now(),
        csr: csr,
        desc: desc,
        domains: domains,
        environmentType: event.environmentType,
        isAutoNewOrder: false,
        isNoticeCertificateNearexpire: false,
        isNoticeOrderNearexpire: false,
        keySize: keysize,
        keyType: keytype,
        orderEndDate: new Date(acmeorder.orderInfo.expires).getTime(),
        orderUrl: acmeorder.orderUrl,
        privateKey: '',
        status: 'pending',
        uid: res.result.account._id
      })
      if (event.environmentType == 'production') {
        await db.collection('productuser').where({
          product: 'ssl',
          uid: res.result.account._id
        }).update({
          productionLimit: db.command.inc(-1)
        })
        await db.collection('ssllimitchange').add({
          changeType: 'minus',
          date: Date.now(),
          number: 1,
          reason: '新增订单（ID：' + orderres.id + '）',
          uid: res.result.account._id
        })
        if (userdata.productionLimit == 1) {
          app.callFunction({
            name: 'sendEmail',
            data: {
              uid: res.result.account._id,
              noticeName: 'ssl_email_limitempty',
              subject: 'SSL证书产品额度耗尽通知',
              text: '您的账号“SSL证书”产品额度已耗尽。'
            }
          })
          app.callFunction({
            name: 'sendWebhook',
            data: {
              uid: res.result.account._id,
              data: {
                noticeName: 'ssl_webhook_limitempty'
              }
            }
          })
        }
      }
      if (event.environmentType == 'staging') {
        await db.collection('productuser').where({
          product: 'ssl',
          uid: res.result.account._id
        }).update({
          stagingLimit: db.command.inc(-1)
        })
      }
      if (userdata.setting.autoSetDns) {
        const authorizations = await acme.api.getOrderAuthorization(acmeorder.orderUrl)
        const authorizationdomains = authorizations.filter(item => item.status == 'pending').map(item => item.identifier.value)
        const dnstasks = []
        authorizationdomains.forEach((authorizationdomain, index) => {
          userdata.dns.forEach(dnsitem => {
            dnsitem.domains.forEach(dnsdomain => {
              if (dnsdomain && authorizationdomain.endsWith(dnsdomain) && dnsitem.keyId && dnsitem.keySecret) {
                dnstasks.push({
                  accountKey: accountkey,
                  authorization: authorizations[index],
                  directoryUrl: directoryurl,
                  dnsConfig: dnsitem,
                  domain: authorizationdomain,
                  error: '',
                  orderId: orderres.id,
                  status: 'setpending',
                  uid: res.result.account._id,
                  updateDate: Date.now()
                })
              }
            })
          })
        })
        const promise = dnstasks.map(async (item) => {
          await db.collection('dnstask').add(item)
        })
        await Promise.all(promise)
      }
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