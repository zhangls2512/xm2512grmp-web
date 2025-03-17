'use strict'
exports.main = async () => {
  const tcb = require('@cloudbase/node-sdk')
  const crypto = require('crypto')
  const acme = require('nodejs-acmeclient')
  const app = tcb.init()
  const db = app.database()
  const pendingordersres = await db.collection('sslorder').where({
    status: 'pending'
  }).orderBy('createDate', 'asc').get()
  pendingordersres.data.forEach(async (item) => {
    let directoryurl = ''
    if (item.environmentType == 'production') {
      directoryurl = 'https://acme-v02.api.letsencrypt.org/directory'
    }
    if (item.environmentType == 'staging') {
      directoryurl = 'https://acme-staging-v02.api.letsencrypt.org/directory'
    }
    const acmeorderres = await acme.api.getOrderInfo(item.orderUrl)
    await db.collection('sslorder').where({
      _id: item._id
    }).update({
      status: acmeorderres.status
    })
    let statuswz = ''
    if (acmeorderres.status == 'ready') {
      statuswz = '待提交'
    }
    if (acmeorderres.status == 'invalid') {
      statuswz = '已失效'
    }
    if (statuswz) {
      app.callFunction({
        name: 'sendEmail',
        data: {
          uid: item.uid,
          noticeName: 'ssl_email_orderstatuschange',
          subject: 'SSL证书订单状态变更通知',
          text: '您的账号SSL证书产品订单（ID：' + item._id + '）状态已变更为' + statuswz + '。'
        }
      })
      app.callFunction({
        name: 'sendWebhook',
        data: {
          uid: item.uid,
          data: {
            noticeName: 'ssl_webhook_orderstatuschange',
            orderId: item._id,
            status: acmeorderres.status
          }
        }
      })
    }
    if (acmeorderres.status == 'ready') {
      const userres = await db.collection('productuser').where({
        product: 'ssl',
        uid: item.uid
      }).get()
      const userdata = userres.data[0]
      if (userdata.setting.autoSubmitOrder) {
        const accountkey = userdata.accountKey[item.environmentType]
        let csr = ''
        let privatekey = ''
        if (item.csr) {
          csr = item.csr
        } else {
          if (item.keyType == 'rsa') {
            privatekey = acme.crypto.generateRSAKeyPair(item.keySize).privateKey
          }
          if (item.keyType == 'ecdsa') {
            privatekey = acme.crypto.generateECDSAKeyPair(item.keySize).privateKey
          }
          csr = acme.crypto.generateCsr({
            subjectAltName: item.domains,
            privateKey: privatekey
          })
        }
        try {
          await acme.api.finalizeOrder({
            directoryUrl: directoryurl,
            accountKey: accountkey,
            orderUrl: item.orderUrl,
            csr: csr
          })
        } catch (err) {
          app.callFunction({
            name: 'sendEmail',
            data: {
              uid: item.uid,
              noticeName: 'ssl_email_autosubmitorderresult',
              subject: 'SSL证书自动提交订单结果',
              text: '您的账号SSL证书产品订单（ID：' + item._id + '）自动提交订单失败。'
            }
          })
          app.callFunction({
            name: 'sendWebhook',
            data: {
              uid: item.uid,
              data: {
                noticeName: 'ssl_webhook_autosubmitorderresult',
                orderId: item._id,
                status: 'fail'
              }
            }
          })
          return {
            errCode: 8002,
            errMsg: 'CA返回错误，错误信息：' + err.detail,
            errFix: '联系客服'
          }
        }
        const uploadres = await app.uploadFile({
          cloudPath: 'sslorder/' + item._id + '/' + item.domains[0] + '.key',
          fileContent: Buffer.from(privatekey)
        })
        await db.collection('sslorder').where({
          _id: item._id
        }).update({
          privateKey: uploadres.fileID,
          status: 'processing'
        })
        app.callFunction({
          name: 'sendEmail',
          data: {
            uid: item.uid,
            noticeName: 'ssl_email_autosubmitorderresult',
            subject: 'SSL证书自动提交订单结果',
            text: '您的账号SSL证书产品订单（ID：' + item._id + '）自动提交订单成功。'
          }
        })
        app.callFunction({
          name: 'sendWebhook',
          data: {
            uid: item.uid,
            data: {
              noticeName: 'ssl_webhook_autosubmitorderresult',
              orderId: item._id,
              status: 'success'
            }
          }
        })
      }
    }
  })
  const readyordersres = await db.collection('sslorder').where({
    status: 'ready'
  }).orderBy('createDate', 'asc').get()
  readyordersres.data.forEach(async (item) => {
    const acmeorderres = await acme.api.getOrderInfo(item.orderUrl)
    if (acmeorderres.status == 'invalid') {
      await db.collection('sslorder').where({
        _id: item._id
      }).update({
        status: 'invalid'
      })
      app.callFunction({
        name: 'sendEmail',
        data: {
          uid: item.uid,
          noticeName: 'ssl_email_orderstatuschange',
          subject: 'SSL证书订单状态变更通知',
          text: '您的账号SSL证书产品订单（ID：' + item._id + '）状态已变更为已失效。'
        }
      })
      app.callFunction({
        name: 'sendWebhook',
        data: {
          uid: item.uid,
          data: {
            noticeName: 'ssl_webhook_orderstatuschange',
            orderId: item._id,
            status: 'invalid'
          }
        }
      })
    }
  })
  const processingordersres = await db.collection('sslorder').where({
    status: 'processing'
  }).orderBy('createDate', 'asc').get()
  processingordersres.data.forEach(async (item) => {
    const acmeorderres = await acme.api.getOrderInfo(item.orderUrl)
    if (acmeorderres.status == 'invalid') {
      await db.collection('sslorder').where({
        _id: item._id
      }).update({
        status: 'invalid'
      })
      app.callFunction({
        name: 'sendEmail',
        data: {
          uid: item.uid,
          noticeName: 'ssl_email_orderstatuschange',
          subject: 'SSL证书订单状态变更通知',
          text: '您的账号SSL证书产品订单（ID：' + item._id + '）状态已变更为已失效。'
        }
      })
      app.callFunction({
        name: 'sendWebhook',
        data: {
          uid: item.uid,
          data: {
            noticeName: 'ssl_webhook_orderstatuschange',
            orderId: item._id,
            status: 'invalid'
          }
        }
      })
    }
    if (acmeorderres.status == 'valid') {
      const certificatesres = await acme.api.getOrderCertificate(item.orderUrl)
      const promise = certificatesres.map(async (certificateitem, index) => {
        const certificateres = await app.uploadFile({
          cloudPath: 'sslorder/' + item._id + '/' + item.domains[0] + '_' + index + '.crt',
          fileContent: Buffer.from(certificateitem)
        })
        return certificateres.fileID
      })
      const certificatesfileid = await Promise.all(promise)
      function getChain(info) {
        return info[0].commonName + ' <- ' + info.map(item => item.issuerCommonName).join(' <- ')
      }
      const certificate = certificatesfileid.map((item, index) => {
        return {
          chain: getChain(acme.crypto.getCertificateInfo(certificatesres[index])),
          value: item
        }
      })
      const leafcertificate = acme.crypto.extractCertificates(certificatesres[0])[0]
      const leafcertificateinfo = new crypto.X509Certificate(leafcertificate)
      const certificatestartdate = new Date(leafcertificateinfo.validFrom).getTime()
      const certificateenddate = new Date(leafcertificateinfo.validTo).getTime()
      let directoryurl = ''
      if (item.environmentType == 'production') {
        directoryurl = 'https://acme-v02.api.letsencrypt.org/directory'
      }
      if (item.environmentType == 'staging') {
        directoryurl = 'https://acme-staging-v02.api.letsencrypt.org/directory'
      }
      const arires = await acme.api.getCertificateRenewalInfo({
        directoryUrl: directoryurl,
        certificate: leafcertificate
      })
      await db.collection('sslorder').where({
        _id: item._id
      }).update({
        ariStartDate: new Date(arires.suggestedWindow.start).getTime(),
        ariEndDate: new Date(arires.suggestedWindow.end).getTime(),
        certificate: certificate,
        certificateEndDate: certificateenddate,
        certificateStartDate: certificatestartdate,
        status: 'valid'
      })
      app.callFunction({
        name: 'sendEmail',
        data: {
          uid: item.uid,
          noticeName: 'ssl_email_orderstatuschange',
          subject: 'SSL证书订单状态变更通知',
          text: '您的账号SSL证书产品订单（ID：' + item._id + '）状态已变更为已签发。'
        }
      })
      app.callFunction({
        name: 'sendWebhook',
        data: {
          uid: item.uid,
          data: {
            noticeName: 'ssl_webhook_orderstatuschange',
            orderId: item._id,
            status: 'valid'
          }
        }
      })
    }
  })
  const validordersres = await db.collection('sslorder').where({
    certificateEndDate: db.command.lte(Date.now()),
    status: 'valid'
  }).orderBy('createDate', 'asc').get()
  validordersres.data.forEach(async (item) => {
    let deletefiles = []
    if (item.privateKey) {
      deletefiles.push(item.privateKey)
    }
    const certificatefiles = item.certificate.map(item => item.value)
    certificatefiles.forEach(item => {
      deletefiles.push(item)
    })
    if (deletefiles.length != 0) {
      await app.deleteFile({
        fileList: deletefiles
      })
    }
    await db.collection('sslorder').where({
      _id: item._id
    }).update({
      certificate: '',
      privateKey: '',
      status: 'expired'
    })
    app.callFunction({
      name: 'sendEmail',
      data: {
        uid: item.uid,
        noticeName: 'ssl_email_orderstatuschange',
        subject: 'SSL证书订单状态变更通知',
        text: '您的账号SSL证书产品订单（ID：' + item._id + '）状态已变更为已过期。'
      }
    })
    app.callFunction({
      name: 'sendWebhook',
      data: {
        uid: item.uid,
        data: {
          noticeName: 'ssl_webhook_orderstatuschange',
          orderId: item._id,
          status: 'expired'
        }
      }
    })
  })
}