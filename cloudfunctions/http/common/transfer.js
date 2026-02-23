'use strict'
exports.main = async (event) => {
  const axios = require('axios')
  if (event.httpMethod != 'POST') {
    return {
      errCode: 1000,
      errMsg: '请求方法错误',
      errFix: '使用POST方法请求'
    }
  }
  const requestdata = JSON.parse(event.body)
  if (typeof (requestdata.url) != 'string' || !requestdata.url) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的url参数'
    }
  }
  if (typeof (requestdata.method) != 'string' || !requestdata.method) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的method参数'
    }
  }
  if (!requestdata.body) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递body参数'
    }
  }
  try {
    const res = await axios.request({
      url: requestdata.url,
      method: requestdata.method,
      data: requestdata.body
    })
    return {
      errCode: 0,
      errMsg: '成功',
      data: res.data
    }
  } catch (err) {
    if (err.response) {
      return {
        errCode: err.response.status,
        errMsg: err.response.data,
        errFix: '无修复建议'
      }
    } else {
      return {
        errCode: 8000,
        errMsg: err.code,
        errFix: '联系客服'
      }
    }
  }
}