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
    if (typeof (requestdata.newEmail) != 'string' || !validator.isEmail(requestdata.newEmail)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的newEmail参数'
      }
    }
    if (typeof (requestdata.newEmailCode) != 'string' || requestdata.newEmailCode.length != 8) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的newEmailCode参数'
      }
    }
    if (requestdata.email == requestdata.newEmail) {
      return {
        errCode: 8000,
        errMsg: '新邮箱与原邮箱相同',
        errFix: '使用其他邮箱'
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
      const newres = await app.callFunction({
        name: 'authCheck',
        data: {
          type: 'emailcode',
          data: {
            email: requestdata.newEmail,
            code: requestdata.newEmailCode
          },
          permission: false
        }
      })
      if (newres.result.errCode != 0) {
        return newres.result
      } else {
        const accountres = await db.collection('account').where({
          email: requestdata.newEmail
        }).get()
        if (accountres.data.length > 0) {
          return {
            errCode: 8001,
            errMsg: '新邮箱已注册',
            errFix: '使用其他邮箱'
          }
        }
        await db.collection('account').where({
          email: requestdata.email
        }).update({
          email: requestdata.newEmail
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