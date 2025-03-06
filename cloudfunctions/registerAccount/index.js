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
        permission: false
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const res = await db.collection('account').where({
        email: requestdata.email
      }).get()
      if (res.data.length > 0) {
        return {
          errCode: 8000,
          errMsg: '邮箱已注册',
          errFix: '使用其他邮箱'
        }
      } else {
        const res = await db.collection('account').add({
          accessKey: [],
          accessToken: '',
          duration: 2,
          email: requestdata.email,
          endDate: 0,
          mfa: '',
          password: '',
          passwordVerifyTimes: 0,
          permission: {
            account: true,
            admin: false,
            password: true,
            resource: true,
            resourcecreator: false,
            smdztj: true,
            ssl: true,
            todo: true
          },
          service: []
        })
        const accesstoken = res.id + '\0' + nanoid(30)
        const encryptaccesstoken = sm4.encrypt(accesstoken, process.env.key)
        await db.collection('account').where({
          _id: res.id
        }).update({
          accessToken: encryptaccesstoken,
          endDate: Date.now() + 172800000
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