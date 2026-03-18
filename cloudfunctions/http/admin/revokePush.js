'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const axios = require('axios')
  const jsonwebtoken = require('jsonwebtoken')
  const privatekey = require(__dirname + '/privatekey.json')
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
  if (typeof (requestdata.id) != 'string' || requestdata.id.length != 32) {
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
      permission: ['account', 'admin'],
      service: ['admin'],
      apiName: 'admin_revokePush'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const pushlogres = await db.collection('pushlog').where({
      _id: requestdata.id
    }).get()
    if (pushlogres.data.length == 0) {
      return {
        errCode: 8000,
        errMsg: '日志不存在',
        errFix: '无修复建议'
      }
    }
    if (pushlogres.data[0].status != 'success') {
      return {
        errCode: 8001,
        errMsg: '日志状态不为推送成功',
        errFix: '无修复建议'
      }
    }
    const product = pushlogres.data[0].product
    let iss = ''
    let kid = ''
    let clientid = ''
    if (product == 'password') {
      iss = '114465913'
      kid = 'c877ccb0de5c49118131812b4e3495ef'
      clientid = '6917568345502278703'
    }
    if (product == 'synologydsmhelper') {
      iss = '115494321'
      kid = '3ab377fe42ec40738b03316abdb7aa76'
      clientid = '6917585605507815630'
    }
    if (product == 'webdavhelper') {
      iss = '116869175'
      kid = '1f98fef6f2674625bc61a4355e362ea8'
      clientid = '101653523863482794'
    }
    const jwt = jsonwebtoken.sign({
      iss: iss,
      aud: 'https://oauth-login.cloud.huawei.com/oauth2/v3/token',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60
    }, privatekey[product], {
      algorithm: 'PS256',
      header: {
        kid: kid,
        typ: 'JWT',
        alg: 'PS256'
      }
    })
    const authorization = 'Bearer ' + jwt
    try {
      const res = await axios.post('https://push-api.cloud.huawei.com/v1/' + clientid + '/messages:revoke', {
        notifyId: pushlogres.data[0].notifyId,
        token: pushlogres.data[0].pushToken
      }, {
        headers: {
          Authorization: authorization,
          'push-type': 0
        }
      })
      if (res.data.code == 80000000) {
        await db.collection('pushlog').where({
          _id: requestdata.id
        }).update({
          status: 'revoke'
        })
        return {
          errCode: 0,
          errMsg: '成功'
        }
      } else {
        return {
          errCode: 8002,
          errMsg: '撤回失败，原因：' + res.data.msg,
          errFix: '无修复建议'
        }
      }
    } catch (err) {
      return {
        errCode: 8002,
        errMsg: '撤回失败，原因：' + err.response.data.msg,
        errFix: '无修复建议'
      }
    }
  }
}