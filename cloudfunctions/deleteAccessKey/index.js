'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
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
    if (typeof (requestdata.accessToken) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的accessToken参数'
      }
    }
    if (!Number.isInteger(requestdata.index) || requestdata.index < 0 || requestdata.index > 9) {
      return {
        errCode: 1002,
        errMsg: '请求参数错误',
        errFix: '传递有效的index参数'
      }
    }
    const res = await app.callFunction({
      name: 'authCheck',
      data: {
        type: 'accesstoken',
        data: {
          code: requestdata.accessToken
        },
        permission: [],
        service: []
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const account = res.result.account
      let accesskeys = account.accessKey
      if (accesskeys.length == 0 || requestdata.index > accesskeys.length) {
        return {
          errCode: 8000,
          errMsg: '不存在索引为index的accessKey',
          errFix: '传递有效的index参数'
        }
      }
      accesskeys.splice(requestdata.index, 1)
      await db.collection('account').where({
        _id: account._id
      }).update({
        accessKey: accesskeys
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