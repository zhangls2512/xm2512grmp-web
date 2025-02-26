'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const { nanoid } = await import('nanoid')
  const app = tcb.init()
  const db = app.database()
  if (event.httpMethod != 'POST') {
    return {
      errCode: 1000,
      errMsg: '请求方法错误',
      errFix: '使用POST方法请求'
    }
  }
  try {
    const requestdata = JSON.parse(event.body)
    if (typeof (requestdata.accessToken) != 'string' && typeof (requestdata.accessKey) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的accessToken或accessKey参数'
      }
    }
    const validservices = ['account', 'admin']
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
          requestIp: event.headers['x-real-ip']
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
      let service = res.result.account.service
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
    }
  } catch {
    return {
      errCode: 5000,
      errMsg: '内部错误',
      errFix: '联系客服'
    }
  }
}