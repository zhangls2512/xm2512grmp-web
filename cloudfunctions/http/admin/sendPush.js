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
  if (typeof (requestdata.title) != 'string' || !requestdata.title) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的title参数'
    }
  }
  if (typeof (requestdata.body) != 'string' || !requestdata.body) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的body参数'
    }
  }
  if (typeof (requestdata.url) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的url参数'
    }
  }
  if (typeof (requestdata.badge) != 'boolean') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的badge参数'
    }
  }
  if (typeof (requestdata.foregroundshow) != 'boolean') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的foregroundshow参数'
    }
  }
  if (typeof (requestdata.test) != 'boolean') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的test参数'
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
      apiName: 'admin_sendPush'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const pushres = await db.collection('push').where({
      _id: requestdata.id
    }).get()
    if (pushres.data.length == 0) {
      return {
        errCode: 8000,
        errMsg: '推送位不存在',
        errFix: '无修复建议'
      }
    }
    const product = pushres.data[0].product
    const pushlogres = await db.collection('pushlog').add({
      badge: requestdata.badge,
      body: requestdata.body,
      createDate: Date.now(),
      error: '',
      foregroundshow: requestdata.foregroundshow,
      notifyId: -1,
      product: product,
      pushDate: 0,
      pushId: requestdata.id,
      pushToken: [],
      status: 'pending',
      test: requestdata.test,
      title: requestdata.title,
      url: requestdata.url
    })
    let iss = ''
    let kid = ''
    let projectid = ''
    if (product == 'password') {
      iss = '114465913'
      kid = 'c877ccb0de5c49118131812b4e3495ef'
      projectid = '461323198429770355'
    }
    if (product == 'synologydsmhelper') {
      iss = '115494321'
      kid = '3ab377fe42ec40738b03316abdb7aa76'
      projectid = '461323198430545654'
    }
    if (product == 'homeassistanthelper') {
      iss = '117424491'
      kid = '3030d7ebbbe141e2ad569335c51e1b75'
      clientid = '101653523863876502'
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
    const pushlogcountres = await db.collection('pushlog').where({
      product: product,
      status: 'success'
    }).count()
    const payload = {
      notification: {
        category: 'MARKETING',
        title: requestdata.title,
        body: requestdata.body,
        notifyId: pushlogcountres.total,
        clickAction: {
          actionType: 0,
          data: {
            noticeUrl: requestdata.url
          }
        },
        foregroundShow: requestdata.foregroundshow
      }
    }
    if (requestdata.badge) {
      payload.notification.badge = {
        addNum: 1
      }
    }
    try {
      const res = await axios.post('https://push-api.cloud.huawei.com/v3/' + projectid + '/messages:send', {
        payload,
        pushOptions: {
          testMessage: requestdata.test
        },
        target: {
          token: pushres.data[0].pushToken
        }
      }, {
        headers: {
          Authorization: authorization,
          'push-type': 0
        }
      })
      if (res.data.code == 80000000) {
        await db.collection('pushlog').where({
          _id: pushlogres.id
        }).update({
          notifyId: pushlogcountres.total,
          pushDate: Date.now(),
          pushToken: pushres.data[0].pushToken,
          status: 'success'
        })
        return {
          errCode: 0,
          errMsg: '成功'
        }
      } else {
        await db.collection('pushlog').where({
          _id: pushlogres.id
        }).update({
          error: res.data.msg,
          status: 'fail'
        })
        return {
          errCode: 8001,
          errMsg: '推送失败，原因：' + res.data.msg,
          errFix: '无修复建议'
        }
      }
    } catch (err) {
      await db.collection('pushlog').where({
        _id: pushlogres.id
      }).update({
        status: 'fail'
      })
      return {
        errCode: 8001,
        errMsg: '推送失败，原因：' + err.response.data.msg,
        errFix: '无修复建议'
      }
    }
  }
}