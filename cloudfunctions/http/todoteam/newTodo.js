'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const app = tcb.init()
  if (event.httpMethod != 'POST') {
    return {
      code: 405,
      msg: '请求方法错误'
    }
  }
  const res = await app.callFunction({
    name: 'authCheck',
    data: {
      type: 'todoteam',
      headers: event.headers
    }
  })
  if (res.result.code != 0) {
    return res.result
  } else {
    return {
      code: 400,
      msg: '开发中'
    }
  }
}