'use strict'
exports.main = async () => {
  const tcb = require('@cloudbase/node-sdk')
  const acme = require('nodejs-acmeclient')
  const app = tcb.init()
  const db = app.database()
  const arires = await db.collection('sslorder').where({
    ariEndDate: db.command.gte(Date.now()),
    ariStartDate: db.command.lte(Date.now()),
    autoNewOrder: 'ari',
    isAutoNewOrder: false,
    status: 'valid'
  }).orderBy('createDate', 'asc').get()
  arires.data.forEach(async (item) => {
    const authres = await app.callFunction({
      name: 'authCheck',
      data: {
        type: 'cloudfunction',
        data: {
          uid: item.uid
        },
        permission: ['account', 'ssl'],
        service: ['ssl']
      }
    })
    if (authres.result.errCode == 0) {
      const userres = await db.collection('productuser').where({
        product: 'ssl',
        uid: item.uid
      }).get()
      const userdata = userres.data[0]
      if (item.environmentType == 'production' && userdata.productionLimit <= 0) {
        app.callFunction({
          name: 'sendEmail',
          data: {
            uid: item.uid,
            noticeName: 'ssl_email_autoneworderresult',
            subject: 'SSL证书产品自动新增续期订单结果',
            text: '您的账号“SSL证书”产品自动新增续期订单失败，原因：额度耗尽。'
          }
        })
        app.callFunction({
          name: 'sendWebhook',
          data: {
            uid: item.uid,
            data: {
              noticeName: 'ssl_webhook_autoneworderresult',
              status: 'fail',
              reason: 'limitempty'
            }
          }
        })
        return
      }
      if (item.environmentType == 'staging' && userdata.stagingLimit <= 0) {
        app.callFunction({
          name: 'sendEmail',
          data: {
            uid: item.uid,
            noticeName: 'ssl_email_autoneworderresult',
            subject: 'SSL证书产品自动新增续期订单结果',
            text: '您的账号“SSL证书”产品自动新增续期订单失败，原因：额度耗尽。'
          }
        })
        app.callFunction({
          name: 'sendWebhook',
          data: {
            uid: item.uid,
            data: {
              noticeName: 'ssl_webhook_autoneworderresult',
              status: 'fail',
              reason: 'limitempty'
            }
          }
        })
        return
      }
      let directoryurl = ''
      if (item.environmentType == 'production') {
        directoryurl = 'https://acme-v02.api.letsencrypt.org/directory'
      }
      if (item.environmentType == 'staging') {
        directoryurl = 'https://acme-staging-v02.api.letsencrypt.org/directory'
      }
      const accountkey = userdata.accountKey[item.environmentType]
      let acmeorder = {}
      try {
        const acmeorderres = await acme.api.newOrder({
          directoryUrl: directoryurl,
          accountKey: accountkey,
          domains: item.domains,
          profile: item.certificateType
        })
        acmeorder = acmeorderres
      } catch (err) {
        if (err.detail) {
          app.callFunction({
            name: 'sendEmail',
            data: {
              uid: item.uid,
              noticeName: 'ssl_email_autoneworderresult',
              subject: 'SSL证书产品自动新增续期订单结果',
              text: '您的账号“SSL证书”产品自动新增续期订单失败，原因：CA返回错误，错误信息：' + err.detail + '。'
            }
          })
          app.callFunction({
            name: 'sendWebhook',
            data: {
              uid: item.uid,
              data: {
                noticeName: 'ssl_webhook_autoneworderresult',
                status: 'fail',
                reason: 'caerror',
                errmsg: err.detail
              }
            }
          })
        }
        return
      }
      let desc = item.desc
      if (!desc.endsWith('（自动续期）')) {
        desc = desc + '（自动续期）'
      }
      const orderres = await db.collection('sslorder').add({
        ariEndDate: 0,
        ariStartDate: 0,
        autoNewOrder: item.autoNewOrder,
        certificate: [],
        certificateEndDate: 0,
        certificateStartDate: 0,
        certificateType: item.certificateType,
        createDate: Date.now(),
        csr: item.csr,
        desc: desc,
        domains: item.domains,
        environmentType: item.environmentType,
        isAutoNewOrder: false,
        isNoticeCertificateNearexpire: false,
        isNoticeOrderNearexpire: false,
        keySize: item.keySize,
        keyType: item.keyType,
        orderEndDate: new Date(acmeorder.orderInfo.expires).getTime(),
        orderUrl: acmeorder.orderUrl,
        privateKey: '',
        status: 'pending',
        uid: item.uid
      })
      if (item.environmentType == 'production') {
        await db.collection('productuser').where({
          product: 'ssl',
          uid: item.uid
        }).update({
          productionLimit: db.command.inc(-1)
        })
        await db.collection('ssllimitchange').add({
          changeType: 'minus',
          date: Date.now(),
          number: 1,
          reason: '新增订单（ID：' + orderres.id + '）',
          uid: item.uid
        })
        if (userdata.productionLimit == 1) {
          app.callFunction({
            name: 'sendEmail',
            data: {
              uid: item.uid,
              noticeName: 'ssl_email_limitempty',
              subject: 'SSL证书产品额度耗尽通知',
              text: '您的账号“SSL证书”产品额度已耗尽。'
            }
          })
          app.callFunction({
            name: 'sendWebhook',
            data: {
              uid: item.uid,
              data: {
                noticeName: 'ssl_webhook_limitempty'
              }
            }
          })
        }
      }
      if (item.environmentType == 'staging') {
        await db.collection('productuser').where({
          product: 'ssl',
          uid: item.uid
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
                  uid: item.uid,
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
        await db.collection('sslorder').where({
          _id: item._id
        }).update({
          isAutoNewOrder: true
        })
        app.callFunction({
          name: 'sendEmail',
          data: {
            uid: item.uid,
            noticeName: 'ssl_email_autoneworderresult',
            subject: 'SSL证书产品自动新增续期订单结果',
            text: '您的账号“SSL证书”产品自动新增续期订单成功，新订单ID：' + orderres.id + '。'
          }
        })
        app.callFunction({
          name: 'sendWebhook',
          data: {
            uid: item.uid,
            data: {
              noticeName: 'ssl_webhook_autoneworderresult',
              status: 'success',
              newOrderId: orderres.id
            }
          }
        })
      } else {
        await db.collection('sslorder').where({
          _id: item._id
        }).update({
          isAutoNewOrder: true
        })
        app.callFunction({
          name: 'sendEmail',
          data: {
            uid: item.uid,
            noticeName: 'ssl_email_autoneworderresult',
            subject: 'SSL证书产品自动新增续期订单结果',
            text: '您的账号“SSL证书”产品自动新增续期订单成功，新订单ID：' + orderres.id + '。'
          }
        })
        app.callFunction({
          name: 'sendWebhook',
          data: {
            uid: item.uid,
            data: {
              noticeName: 'ssl_webhook_autoneworderresult',
              status: 'success',
              newOrderId: orderres.id
            }
          }
        })
      }
    } else {
      app.callFunction({
        name: 'sendEmail',
        data: {
          uid: item.uid,
          noticeName: 'ssl_email_autoneworderresult',
          subject: 'SSL证书产品自动新增续期订单结果',
          text: '您的账号“SSL证书”产品自动新增续期订单失败，原因：' + authres.result.errMsg + '。'
        }
      })
      app.callFunction({
        name: 'sendWebhook',
        data: {
          uid: item.uid,
          data: {
            noticeName: 'ssl_webhook_autoneworderresult',
            status: 'fail',
            reason: authres.result.errMsg
          }
        }
      })
    }
  })
  const nearexpireres = await db.collection('sslorder').where({
    autoNewOrder: 'nearexpire',
    certificateEndDate: db.command.lte(Date.now() + 86400000),
    isAutoNewOrder: false,
    status: 'valid'
  }).orderBy('createDate', 'asc').get()
  nearexpireres.data.forEach(async (item) => {
    const authres = await app.callFunction({
      name: 'authCheck',
      data: {
        type: 'cloudfunction',
        data: {
          uid: item.uid
        },
        permission: ['account', 'ssl'],
        service: ['ssl']
      }
    })
    if (authres.result.errCode == 0) {
      const userres = await db.collection('productuser').where({
        product: 'ssl',
        uid: item.uid
      }).get()
      const userdata = userres.data[0]
      if (item.environmentType == 'production' && userdata.productionLimit <= 0) {
        app.callFunction({
          name: 'sendEmail',
          data: {
            uid: item.uid,
            noticeName: 'ssl_email_autoneworderresult',
            subject: 'SSL证书产品自动新增续期订单结果',
            text: '您的账号“SSL证书”产品自动新增续期订单失败，原因：额度耗尽。'
          }
        })
        app.callFunction({
          name: 'sendWebhook',
          data: {
            uid: item.uid,
            data: {
              noticeName: 'ssl_webhook_autoneworderresult',
              status: 'fail',
              reason: 'limitempty'
            }
          }
        })
        return
      }
      if (item.environmentType == 'staging' && userdata.stagingLimit <= 0) {
        app.callFunction({
          name: 'sendEmail',
          data: {
            uid: item.uid,
            noticeName: 'ssl_email_autoneworderresult',
            subject: 'SSL证书产品自动新增续期订单结果',
            text: '您的账号“SSL证书”产品自动新增续期订单失败，原因：额度耗尽。'
          }
        })
        app.callFunction({
          name: 'sendWebhook',
          data: {
            uid: item.uid,
            data: {
              noticeName: 'ssl_webhook_autoneworderresult',
              status: 'fail',
              reason: 'limitempty'
            }
          }
        })
        return
      }
      let directoryurl = ''
      if (item.environmentType == 'production') {
        directoryurl = 'https://acme-v02.api.letsencrypt.org/directory'
      }
      if (item.environmentType == 'staging') {
        directoryurl = 'https://acme-staging-v02.api.letsencrypt.org/directory'
      }
      const accountkey = userdata.accountKey[item.environmentType]
      let acmeorder = {}
      try {
        const acmeorderres = await acme.api.newOrder({
          directoryUrl: directoryurl,
          accountKey: accountkey,
          domains: item.domains,
          profile: item.certificateType
        })
        acmeorder = acmeorderres
      } catch (err) {
        if (err.detail) {
          app.callFunction({
            name: 'sendEmail',
            data: {
              uid: item.uid,
              noticeName: 'ssl_email_autoneworderresult',
              subject: 'SSL证书产品自动新增续期订单结果',
              text: '您的账号“SSL证书”产品自动新增续期订单失败，原因：CA返回错误，错误信息：' + err.detail + '。'
            }
          })
          app.callFunction({
            name: 'sendWebhook',
            data: {
              uid: item.uid,
              data: {
                noticeName: 'ssl_webhook_autoneworderresult',
                status: 'fail',
                reason: 'caerror',
                errmsg: err.detail
              }
            }
          })
        }
        return
      }
      let desc = item.desc
      if (!desc.endsWith('（自动续期）')) {
        desc = desc + '（自动续期）'
      }
      const orderres = await db.collection('sslorder').add({
        ariEndDate: 0,
        ariStartDate: 0,
        autoNewOrder: item.autoNewOrder,
        certificate: [],
        certificateEndDate: 0,
        certificateStartDate: 0,
        certificateType: item.certificateType,
        createDate: Date.now(),
        csr: item.csr,
        desc: desc,
        domains: item.domains,
        environmentType: item.environmentType,
        isAutoNewOrder: false,
        isNoticeCertificateNearexpire: false,
        isNoticeOrderNearexpire: false,
        keySize: item.keySize,
        keyType: item.keyType,
        orderEndDate: new Date(acmeorder.orderInfo.expires).getTime(),
        orderUrl: acmeorder.orderUrl,
        privateKey: '',
        status: 'pending',
        uid: item.uid
      })
      if (item.environmentType == 'production') {
        await db.collection('productuser').where({
          product: 'ssl',
          uid: item.uid
        }).update({
          productionLimit: db.command.inc(-1)
        })
        await db.collection('ssllimitchange').add({
          changeType: 'minus',
          date: Date.now(),
          number: 1,
          reason: '新增订单（ID：' + orderres.id + '）',
          uid: item.uid
        })
        if (userdata.productionLimit == 1) {
          app.callFunction({
            name: 'sendEmail',
            data: {
              uid: item.uid,
              noticeName: 'ssl_email_limitempty',
              subject: 'SSL证书产品额度耗尽通知',
              text: '您的账号“SSL证书”产品额度已耗尽。'
            }
          })
          app.callFunction({
            name: 'sendWebhook',
            data: {
              uid: item.uid,
              data: {
                noticeName: 'ssl_webhook_limitempty'
              }
            }
          })
        }
      }
      if (item.environmentType == 'staging') {
        await db.collection('productuser').where({
          product: 'ssl',
          uid: item.uid
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
                  uid: item.uid,
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
        await db.collection('sslorder').where({
          _id: item._id
        }).update({
          isAutoNewOrder: true
        })
        app.callFunction({
          name: 'sendEmail',
          data: {
            uid: item.uid,
            noticeName: 'ssl_email_autoneworderresult',
            subject: 'SSL证书产品自动新增续期订单结果',
            text: '您的账号“SSL证书”产品自动新增续期订单成功，新订单ID：' + orderres.id + '。'
          }
        })
        app.callFunction({
          name: 'sendWebhook',
          data: {
            uid: item.uid,
            data: {
              noticeName: 'ssl_webhook_autoneworderresult',
              status: 'success',
              newOrderId: orderres.id
            }
          }
        })
      } else {
        await db.collection('sslorder').where({
          _id: item._id
        }).update({
          isAutoNewOrder: true
        })
        app.callFunction({
          name: 'sendEmail',
          data: {
            uid: item.uid,
            noticeName: 'ssl_email_autoneworderresult',
            subject: 'SSL证书产品自动新增续期订单结果',
            text: '您的账号“SSL证书”产品自动新增续期订单成功，新订单ID：' + orderres.id + '。'
          }
        })
        app.callFunction({
          name: 'sendWebhook',
          data: {
            uid: item.uid,
            data: {
              noticeName: 'ssl_webhook_autoneworderresult',
              status: 'success',
              newOrderId: orderres.id
            }
          }
        })
      }
    } else {
      app.callFunction({
        name: 'sendEmail',
        data: {
          uid: item.uid,
          noticeName: 'ssl_email_autoneworderresult',
          subject: 'SSL证书产品自动新增续期订单结果',
          text: '您的账号“SSL证书”产品自动新增续期订单失败，原因：' + authres.result.errMsg + '。'
        }
      })
      app.callFunction({
        name: 'sendWebhook',
        data: {
          uid: item.uid,
          data: {
            noticeName: 'ssl_webhook_autoneworderresult',
            status: 'fail',
            reason: authres.result.errMsg
          }
        }
      })
    }
  })
}