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
  try {
    const requestdata = JSON.parse(event.body)
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
        apiName: 'ssl_updateTemplate'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const uid = res.result.account._id
      const templateres = await db.collection('ssltemplate').where({
        _id: requestdata.id,
        uid: uid
      }).update({
        desc: requestdata.desc,
        domains: requestdata.domains,
        updateDate: Date.now()
      })
      if (templateres.updated == 0) {
        return {
          errCode: 8000,
          errMsg: '模板不存在或数据无修改',
          errFix: '传递有效的id或修改数据'
        }
      } else {
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