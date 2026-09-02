exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const crypto = require('crypto')
  const app = tcb.init()
  const db = app.database()
  if (event.httpMethod != 'POST') {
    return {
      errCode: 1000,
      errMsg: '请求方法错误',
      errFix: '使用POST方法请求'
    }
  }
  const query = event.queryStringParameters
  if (typeof (query.timestamp) != 'string' || !query.timestamp) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的timestamp参数'
    }
  }
  if (typeof (query.nonce) != 'string' || !query.nonce) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的nonce参数'
    }
  }
  const str = [process.env.tpcltoken, query.timestamp, query.nonce].sort().join('')
  const sigature = crypto.createHash('sha1').update(str).digest('hex')
  if (query.signature != sigature) {
    return {
      errCode: 1001,
      errMsg: '签名校验失败',
      errFix: '无修复建议'
    }
  }
  const body = JSON.parse(event.body)
  if (body.Event == 'wxa_media_check') {
    await db.collection('mediachecklog').where({
      traceId: body.trace_id
    }).update({
      result: body.errcode == 0 ? body.result : {
        suggest: 'error',
        errCode: body.errcode
      }
    })
  }
  return {
    errCode: 0,
    errMsg: '成功'
  }
}