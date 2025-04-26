'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const speakeasy = require('speakeasy')
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
    if (typeof (requestdata.email) != 'string' || !validator.isEmail(requestdata.email)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的email参数'
      }
    }
    if (typeof (requestdata.emailCode) != 'string' || requestdata.emailCode.length != 8) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的emailCode参数'
      }
    }
    const res = await app.callFunction({
      name: 'authCheck',
      data: {
        type: 'emailcode',
        data: {
          email: requestdata.email,
          code: requestdata.emailCode
        },
        permission: []
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const account = res.result.account
      if (account.mfa) {
        return {
          errCode: 8000,
          errMsg: '账号已设置MFA',
          errFix: '无修复建议'
        }
      }
      const secret = speakeasy.generateSecret({ length: 32 }).base32
      await db.collection('account').where({
        _id: account._id
      }).update({
        mfa: secret
      })
      return {
        errCode: 0,
        errMsg: '成功',
        secret: secret
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