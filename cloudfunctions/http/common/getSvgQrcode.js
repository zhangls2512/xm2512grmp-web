'use strict'
exports.main = async (event) => {
  const qrcode = require('qrcode')
  if (event.httpMethod != 'POST') {
    return {
      errCode: 1000,
      errMsg: '请求方法错误',
      errFix: '使用POST方法请求'
    }
  }
  if (!event.body) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的请求体'
    }
  }
  const res = await qrcode.toString(event.body, {
    type: 'svg'
  })
  return {
    errCode: 0,
    errMsg: '成功',
    data: res.slice(0, -1)
  }
}