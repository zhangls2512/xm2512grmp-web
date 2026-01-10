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
  if (typeof (requestdata.id) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的id参数'
    }
  }
  if (typeof (requestdata.pushToken) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的pushToken参数'
    }
  }
  const pushres = await db.collection('push').where({
    _id: requestdata.id
  }).get()
  if (pushres.data.length == 0) {
    return {
      errCode: 8000,
      errMsg: '通知位不存在',
      errFix: '无修复建议'
    }
  }
  let pushToken = pushres.data[0].pushToken
  const index = pushToken.findIndex(item => item == requestdata.pushToken)
  if (index == -1) {
    pushToken.push(requestdata.pushToken)
  }
  if (index != -1) {
    pushToken.splice(index, 1)
  }
  await db.collection('push').where({
    _id: requestdata.id
  }).update({
    pushToken: pushToken
  })
  return {
    errCode: 0,
    errMsg: '成功'
  }
}