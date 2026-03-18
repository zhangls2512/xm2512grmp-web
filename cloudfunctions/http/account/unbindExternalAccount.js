'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
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
  if (typeof (requestdata.email) != 'string' || !validator.isEmail(requestdata.email)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的email参数'
    }
  }
  const validtypes = ['emailcode', 'mfa']
  if (!validtypes.includes(requestdata.verifyType)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的verifyType参数'
    }
  }
  if (typeof (requestdata.verifyCode) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的verifyCode参数'
    }
  }
  if (requestdata.verifyType == 'emailcode' && requestdata.verifyCode.length != 8) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的verifyCode参数'
    }
  }
  if (requestdata.verifyType == 'mfa' && requestdata.verifyCode.length != 6) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的verifyCode参数'
    }
  }
  const validplatforms = ['passkey', 'sslwxxcx', 'huawei']
  if (!validplatforms.includes(requestdata.platform)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的platform参数'
    }
  }
  if (requestdata.platform == 'passkey' && typeof (requestdata.openid) != 'string' || !requestdata.openid) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的openid参数'
    }
  }
  const res = await app.callFunction({
    name: 'authCheck',
    data: {
      type: requestdata.verifyType,
      data: {
        email: requestdata.email,
        code: requestdata.verifyCode
      },
      permission: []
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const uid = res.result.account._id
    const externalaccountres = await db.collection('externalaccount').where({
      platform: requestdata.platform,
      uid: uid
    }).get()
    if (requestdata.platform == 'passkey') {
      if (!externalaccountres.data.some(item => item.openid == requestdata.openid)) {
        return {
          errCode: 8000,
          errMsg: '不存在ID为openid的passkey',
          errFix: '无修复建议'
        }
      }
      await db.collection('externalaccount').where({
        openid: requestdata.openid,
        platform: requestdata.platform,
        uid: uid
      }).remove()
    } else {
      if (externalaccountres.data.length == 0) {
        return {
          errCode: 8000,
          errMsg: '账号未绑定此外部平台',
          errFix: '无修复建议'
        }
      }
      await db.collection('externalaccount').where({
        platform: requestdata.platform,
        uid: uid
      }).remove()
    }
    return {
      errCode: 0,
      errMsg: '成功'
    }
  }
}