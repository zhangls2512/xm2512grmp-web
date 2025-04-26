'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const { sm4 } = require('sm-crypto-v2')
  const validator = require('validator')
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
      const account = res.result.account
      if (requestdata.unfreeze === true && account.accessToken != '已冻结') {
        return {
          errCode: 8000,
          errMsg: '账号未冻结',
          errFix: '无需解冻账号'
        }
      }
      const enddate = Date.now() + account.duration * 86400000
      const outaccesstoken = account._id + '\0' + nanoid(60)
      const accesstoken = sm4.encrypt(outaccesstoken, process.env.key)
      await db.collection('account').where({
        _id: account._id
      }).update({
        accessToken: accesstoken,
        endDate: enddate
      })
      return {
        errCode: 0,
        errMsg: '成功'
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