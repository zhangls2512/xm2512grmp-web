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
  const requestdata = JSON.parse(event.body)
  if (typeof (requestdata.accessToken) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的accessToken参数'
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
    const uid = res.result.account._id
    const externalaccountres = await db.collection('externalaccount').where({
      uid: uid
    }).field({
      _id: false,
      uid: false
    }).get()
    return {
      errCode: 0,
      errMsg: '成功',
      data: externalaccountres.data
    }
  }
}