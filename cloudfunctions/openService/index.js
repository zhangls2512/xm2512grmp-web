'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const acme = require('nodejs-acmeclient')
  const { nanoid } = await import('nanoid')
  const app = tcb.init()
  const auth = app.auth()
  const issdk = (auth.getUserInfo().isAnonymous || auth.getUserInfo().openId)
  const db = app.database()
  let requestdata = ''
  let requestip = ''
  if (issdk) {
    requestdata = event
    requestip = auth.getClientIP()
  } else {
    requestip = event.headers['x-real-ip']
    if (event.httpMethod != 'POST') {
      return {
        errCode: 1000,
        errMsg: '请求方法错误',
        errFix: '使用POST方法请求'
      }
    }
    try {
      requestdata = JSON.parse(event.body)
    } catch {
      return {
        errCode: 5000,
        errMsg: '内部错误',
        errFix: '联系客服'
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
    const validservices = ['account', 'admin', 'resource', 'resourcecreator', 'ssl', 'password']
    if (!validservices.includes(requestdata.service)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的service参数'
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
        permission: ['account', requestdata.service],
        service: [],
        apiName: 'account_openService'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const uid = res.result.account._id
      const service = res.result.account.service
      if (service.includes(requestdata.service)) {
        return {
          errCode: 8000,
          errMsg: '产品/功能已开通',
          errFix: '无需重复开通'
        }
      }
      service.push(requestdata.service)
      if (requestdata.service == 'account') {
        await db.collection('productuser').add({
          noticeSetting: [],
          product: 'account',
          webhookToken: nanoid(15) + uid + nanoid(15),
          webhookUrl: '',
          uid: uid
        })
        await db.collection('account').where({
          _id: uid
        }).update({
          service: service
        })
        return {
          errCode: 0,
          errMsg: '成功'
        }
      }
      if (requestdata.service == 'admin') {
        await db.collection('productuser').add({
          noticeSetting: [],
          product: 'admin',
          webhookToken: nanoid(15) + uid + nanoid(15),
          webhookUrl: '',
          uid: uid
        })
        await db.collection('account').where({
          _id: uid
        }).update({
          service: service
        })
        return {
          errCode: 0,
          errMsg: '成功'
        }
      }
      if (requestdata.service == 'resource') {
        await db.collection('productuser').add({
          noticeSetting: [],
          product: 'resource',
          setting: {
            tag: []
          },
          webhookToken: nanoid(15) + uid + nanoid(15),
          webhookUrl: '',
          uid: uid
        })
        await db.collection('account').where({
          _id: uid
        }).update({
          service: service
        })
        return {
          errCode: 0,
          errMsg: '成功'
        }
      }
      if (requestdata.service == 'resourcecreator') {
        await db.collection('productuser').add({
          noticeSetting: [],
          product: 'resourcecreator',
          webhookToken: nanoid(15) + uid + nanoid(15),
          webhookUrl: '',
          uid: uid
        })
        await db.collection('account').where({
          _id: uid
        }).update({
          service: service
        })
        return {
          errCode: 0,
          errMsg: '成功'
        }
      }
      if (requestdata.service == 'ssl') {
        const productionprivatekey = acme.crypto.generateECDSAKeyPair('secp384r1').privateKey
        const stagingprivatekey = acme.crypto.generateECDSAKeyPair('secp384r1').privateKey
        try {
          await acme.api.newAccount({
            directoryUrl: 'https://acme-v02.api.letsencrypt.org/directory',
            accountKey: productionprivatekey
          })
          await acme.api.newAccount({
            directoryUrl: 'https://acme-staging-v02.api.letsencrypt.org/directory',
            accountKey: stagingprivatekey
          })
        } catch (err) {
          return {
            errCode: 8001,
            errMsg: 'CA返回错误，错误信息：' + err.detail,
            errFix: '联系客服'
          }
        }
        await db.collection('productuser').add({
          accountKey: {
            production: productionprivatekey,
            staging: stagingprivatekey
          },
          dns: [
            {
              platform: 'aliyun',
              keyId: '',
              keySecret: '',
              domains: []
            },
            {
              platform: 'tencentcloud',
              keyId: '',
              keySecret: '',
              domains: []
            }
          ],
          noticeSetting: [],
          product: 'ssl',
          productionLimit: 8,
          setting: {
            autoSetDns: false,
            autoSubmitChallengeVerify: 'afterverify',
            autoSubmitOrder: false
          },
          stagingLimit: 5,
          webhookToken: nanoid(15) + uid + nanoid(15),
          webhookUrl: '',
          uid: uid
        })
        await db.collection('ssllimitchange').add({
          changeType: 'add',
          date: Date.now(),
          number: 8,
          reason: String(new Date().getFullYear()) + '年免费',
          uid: uid
        })
        await db.collection('account').where({
          _id: uid
        }).update({
          service: service
        })
        return {
          errCode: 0,
          errMsg: '成功'
        }
      }
      if (requestdata.service == 'password') {
        await db.collection('productuser').add({
          invitationCode: nanoid(15) + uid + nanoid(15),
          noticeSetting: [],
          product: 'password',
          vipEndDate: -1,
          webhookToken: nanoid(15) + uid + nanoid(15),
          webhookUrl: '',
          uid: uid
        })
        await db.collection('account').where({
          _id: uid
        }).update({
          service: service
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