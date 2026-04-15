'use strict'
exports.main = async (event) => {
  const crypto = require('crypto')
  if (event.httpMethod != 'POST') {
    return {
      errCode: 1000,
      errMsg: '请求方法错误',
      errFix: '使用POST方法请求'
    }
  }
  const requestdata = JSON.parse(event.body)
  const validtypes = []
  if (!validtypes.includes(requestdata.type)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的type参数'
    }
  }
  if (typeof (requestdata.hash) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的hash参数'
    }
  }
  const parameter = require(__dirname + '/' + requestdata.type + '.json')
  const hash = crypto.createHash('sha256').update(parameter).digest('hex')
  if (hash != requestdata.hash) {
    return {
      errCode: 0,
      errMsg: '成功',
      hasUpdate: true,
      parameter: parameter
    }
  }
  if (hash == requestdata.hash) {
    return {
      errCode: 0,
      errMsg: '成功',
      hasUpdate: false
    }
  }
}