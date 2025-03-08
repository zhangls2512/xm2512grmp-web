'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const crypto = require('crypto')
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
        const validstatus = ['pending', 'ready', 'processing', 'valid']
        if (!validstatus.includes(data.status)) {
          return {
            errCode: 8001,
            errMsg: '订单状态为待授权、待提交、签发中、已签发时才可刷新',
            errFix: '无修复建议'
          }
        }
        let directoryurl = ''
        if (data.environmentType == 'production') {
          directoryurl = 'https://acme-v02.api.letsencrypt.org/directory'
        }
        if (data.environmentType == 'staging') {
          directoryurl = 'https://acme-staging-v02.api.letsencrypt.org/directory'
        }
        if (data.status == 'pending') {
          const acmeorderres = await acme.api.getOrderInfo(data.orderUrl)
          await db.collection('sslorder').where({
            _id: requestdata.id
          }).update({
            status: acmeorderres.status
          })
          if (acmeorderres.status == 'ready') {
            const userres = await db.collection('productuser').where({
              product: 'ssl',
              uid: res.result.account._id
            }).get()
            const userdata = userres.data[0]
            if (userdata.setting.autoSubmitOrder) {
              const accountkey = userdata.accountKey[data.environmentType]
              let csr = ''
              let privatekey = ''
              if (data.csr) {
                csr = data.csr
              } else {
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
                app.callFunction({
                  name: 'sendEmail',
                  data: {
                    uid: res.result.account._id,
                    noticeName: 'ssl_email_autosubmitorderresult',
                    subject: 'SSL证书自动提交订单结果',
                    text: '您的账号SSL证书产品订单（ID：' + requestdata.id + '）自动提交订单失败。'
                  }
                })
                app.callFunction({
                  name: 'sendWebhook',
                  data: {
                    uid: res.result.account._id,
                    data: {
                      noticeName: 'ssl_webhook_autosubmitorderresult',
                      orderId: requestdata.id,
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
                cloudPath: 'sslorder/' + requestdata.id + '/' + data.domains[0] + '.key',
                fileContent: Buffer.from(privatekey)
              })
              await db.collection('sslorder').where({
                _id: requestdata.id
              }).update({
                privateKey: uploadres.fileID,
                status: 'processing'
              })
              app.callFunction({
                name: 'sendEmail',
                data: {
                  uid: res.result.account._id,
                  noticeName: 'ssl_email_autosubmitorderresult',
                  subject: 'SSL证书自动提交订单结果',
                  text: '您的账号SSL证书产品订单（ID：' + requestdata.id + '）自动提交订单成功。'
                }
              })
              app.callFunction({
                name: 'sendWebhook',
                data: {
                  uid: res.result.account._id,
                  data: {
                    noticeName: 'ssl_webhook_autosubmitorderresult',
                    orderId: requestdata.id,
                    status: 'success'
                  }
                }
              })
            }
            return {
              errCode: 0,
              errMsg: '成功'
            }
          } else {
            return {
              errCode: 0,
              errMsg: '成功'
            }
          }
        }
        if (data.status == 'ready') {
          const acmeorderres = await acme.api.getOrderInfo(data.orderUrl)
          await db.collection('sslorder').where({
            _id: requestdata.id
          }).update({
            status: acmeorderres.status
          })
          return {
            errCode: 0,
            errMsg: '成功'
          }
        }
        if (data.status == 'processing') {
          const acmeorderres = await acme.api.getOrderInfo(data.orderUrl)
          if (acmeorderres.status == 'invalid') {
            await db.collection('sslorder').where({
              _id: requestdata.id
            }).update({
              status: 'invalid'
            })
          }
          if (acmeorderres.status == 'valid') {
            const certificatesres = await acme.api.getOrderCertificate(data.orderUrl)
            const promise = certificatesres.map(async (item, index) => {
              const certificateres = await app.uploadFile({
                cloudPath: 'sslorder/' + requestdata.id + '/' + data.domains[0] + '_' + index + '.crt',
                fileContent: Buffer.from(item)
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
            const arires = await acme.api.getCertificateRenewalInfo({
              directoryUrl: directoryurl,
              certificate: leafcertificate
            })
            await db.collection('sslorder').where({
              _id: requestdata.id
            }).update({
              ariEndDate: new Date(arires.suggestedWindow.end).getTime(),
              ariStartDate: new Date(arires.suggestedWindow.start).getTime(),
              certificate: certificate,
              certificateEndDate: certificateenddate,
              certificateStartDate: certificatestartdate,
              status: 'valid'
            })
            return {
              errCode: 0,
              errMsg: '成功'
            }
          }
        }
        if (data.status == 'valid') {
          if (data.certificateEndDate < Date.now()) {
            let deletefiles = []
            if (data.privateKey) {
              deletefiles.push(data.privateKey)
            }
            const certificatefiles = data.certificate.map(item => item.value)
            certificatefiles.forEach(item => {
              deletefiles.push(item)
            })
            if (deletefiles.length != 0) {
              await app.deleteFile({
                fileList: deletefiles
              })
            }
            await db.collection('sslorder').where({
              _id: requestdata.id
            }).update({
              certificate: '',
              privateKey: '',
              status: 'expired'
            })
            return {
              errCode: 0,
              errMsg: '成功'
            }
          } else {
            return {
              errCode: 8003,
              errMsg: '订单状态无变更',
              errFix: '无修复建议'
            }
          }
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