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
  if (typeof (requestdata.accessToken) != 'string' && typeof (requestdata.accessKey) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的accessToken或accessKey参数'
    }
  }
  if (typeof (requestdata.id) != 'string' || requestdata.id) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的id参数'
    }
  }
  if (typeof (requestdata.content) != 'string' || !requestdata.content) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的content参数'
    }
  }
  if (typeof (requestdata.iv) != 'string' || !requestdata.iv) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的iv参数'
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
      permission: ['account', 'todo'],
      service: ['todo'],
      apiName: 'todo_setBackup'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const uid = res.result.account._id
    const userres = await db.collection('productuser').where({
      product: 'todo',
      uid: uid
    }).get()
    const backupMaxCount = userres.data[0].backupMaxCount
    const countres = await db.collection('todo').where({
      uid: uid
    }).count()
    if (countres.total >= backupMaxCount) {
      return {
        errCode: 8000,
        errMsg: '数量达到上限',
        errFix: '开通会员'
      }
    }
    const todores = await db.collection('todo').where({
      id: requestdata.id,
      uid: uid
    }).get()
    if (todores.data.length == 0) {
      await db.collection('todo').add({
        content: requestdata.content,
        id: requestdata.id,
        iv: requestdata.iv,
        uid: uid
      })
      return {
        errCode: 0,
        errMsg: '成功'
      }
    }
    await db.collection('todo').where({
      _id: todores.data[0]._id
    }).update({
      content: requestdata.content,
      iv: requestdata.iv
    })
    return {
      errCode: 0,
      errMsg: '成功'
    }
  }
}