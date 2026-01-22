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
    if (typeof (event.id) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的id参数'
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
        permission: [],
        service: ['ssl'],
        apiName: 'ssl_refreshOrder'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const orderres = await db.collection('sslorder').where({
        _id: event.id,
        uid: res.result.account._id
      }).get()
      if (orderres.data.length == 0) {
        return {
          errCode: 8000,
          errMsg: '订单不存在',
          errFix: '无修复建议'
        }
      }
      const data = orderres.data[0]
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
        let status = ''
        try {
          const acmeorderres = await acme.api.getOrderInfo(data.orderUrl)
          status = acmeorderres.status
        } catch (err) {
          if (err.status == 404) {
            status = 'invalid'
          }
        }
        await db.collection('sslorder').where({
          _id: event.id
        }).update({
          status: status
        })
        return {
          errCode: 0,
          errMsg: '成功'
        }
      }
      if (data.status == 'ready') {
        let status = ''
        try {
          const acmeorderres = await acme.api.getOrderInfo(data.orderUrl)
          status = acmeorderres.status
        } catch (err) {
          if (err.status == 404) {
            status = 'invalid'
          }
        }
        await db.collection('sslorder').where({
          _id: event.id
        }).update({
          status: status
        })
        return {
          errCode: 0,
          errMsg: '成功'
        }
      }
      if (data.status == 'processing') {
        let status = ''
        try {
          const acmeorderres = await acme.api.getOrderInfo(data.orderUrl)
          status = acmeorderres.status
        } catch (err) {
          if (err.status == 404) {
            status = 'invalid'
          }
        }
        await db.collection('sslorder').where({
          _id: event.id
        }).update({
          status: status
        })
        if (status == 'valid') {
          const certificatesres = await acme.api.getOrderCertificate(data.orderUrl)
          const promise = certificatesres.map(async (item, index) => {
            const certificateres = await app.uploadFile({
              cloudPath: 'sslorder/' + event.id + '/' + data.domains[0] + '_' + index + '.crt',
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
          const leafcertificateinfo = acme.crypto.getCertificateInfo(certificatesres[0])[0]
          const certificatestartdate = (leafcertificateinfo.startDate).getTime()
          const certificateenddate = (leafcertificateinfo.endDate).getTime()
          const arires = await acme.api.getCertificateRenewalInfo({
            directoryUrl: directoryurl,
            certificate: certificatesres[0]
          })
          await db.collection('sslorder').where({
            _id: event.id
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
          const deletefiles = []
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
            _id: event.id
          }).update({
            certificate: '',
            privateKey: '',
            status: 'expired'
          })
          return {
            errCode: 0,
            errMsg: '成功'
          }
        }
        return {
          errCode: 8003,
          errMsg: '订单状态无变更',
          errFix: '无修复建议'
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