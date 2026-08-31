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
  if (typeof (requestdata.code) != 'string' || !requestdata.code) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的code参数'
    }
  }
  const res = await axios.get('https://api.weixin.qq.com/sns/jscode2session?appid=wx1146ee46b77583ec&secret=' + process.env.tpclappsecret + '&js_code=' + requestdata.code + '&grant_type=authorization_code')
  if (res.data.errcode) {
    return {
      errCode: 8000,
      errMsg: 'code校验失败，原因：' + res.data.errmsg,
      errFix: '无修复建议'
    }
  }
  return {
    errCode: 0,
    errMsg: '成功',
    openid: res.data.openid
  }
}