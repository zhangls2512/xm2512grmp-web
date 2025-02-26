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
    if (typeof (requestdata.baxkNumber) != 'string' || !requestdata.baxkNumber) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的baxkNumber参数'
      }
    }
    const res = await db.collection('baxk').where({
      baxkNumber: requestdata.baxkNumber
    }).field({
      _id: false
    }).get()
    if (res.data.length == 0) {
      return {
        errCode: 8000,
        errMsg: '备案/许可不存在',
        errFix: '传递有效的baxkNumber参数'
      }
    } else {
      return {
        errCode: 0,
        errMsg: '成功',
        data: res.data[0]
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