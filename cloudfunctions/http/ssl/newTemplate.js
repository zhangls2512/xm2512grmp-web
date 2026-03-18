'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const net = require('net')
  const validator = require('validator')
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
  if (!Array.isArray(requestdata.domains) || requestdata.domains.length == 0 || requestdata.domains.length > 100 || requestdata.domains.some(item => !validator.isFQDN(item, {
    allow_wildcard: true
  }) && !net.isIP(item))) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的domains参数'
    }
  }
  if (typeof (requestdata.desc) != 'string' || requestdata.desc.length > 20) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的desc参数'
    }
  }
  let type = ''
  let code = ''
  if (requestdata.accessToken) {
    type = 'accesstoken'
    code = requestdata.accessToken
  } else {
    if (!requestdata.accessKey) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的accessKey参数'
      }
    }
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
      permission: ['account', 'ssl'],
      service: ['ssl'],
      apiName: 'ssl_newTemplate'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const uid = res.result.account._id
    const templateres = await db.collection('ssltemplate').where({
      uid: uid
    }).count()
    if (templateres.total >= 9) {
      return {
        errCode: 8000,
        errMsg: '暂仅支持最多10个模板',
        errFix: '无修复建议'
      }
    }
    await db.collection('ssltemplate').add({
      desc: requestdata.desc,
      domains: [...new Set(requestdata.domains)],
      uid: uid,
      updateDate: Date.now()
    })
    return {
      errCode: 0,
      errMsg: '成功'
    }
  }
}