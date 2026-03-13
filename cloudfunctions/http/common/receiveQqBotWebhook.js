'use strict'
exports.main = async (event) => {
  const axios = require('axios')
  const tweetnacl = require('tweetnacl')
  /*const requestdata = JSON.parse(event.body)
  return {
    plain_token: requestdata.d.plain_token,
    signature: Buffer.from(tweetnacl.sign.detached(Buffer.from(requestdata.d.event_ts + requestdata.d.plain_token), tweetnacl.sign.keyPair.fromSeed(Buffer.from(process.env.qqbotsecret)).secretKey), 'hex').toString('hex')
  }*/
  if (event.httpMethod != 'POST') {
    return {
      errCode: 1000,
      errMsg: '请求方法错误',
      errFix: '使用POST方法请求'
    }
  }
  if (!event.headers['x-signature-ed25519'] || event.headers['x-signature-ed25519'].length != 128) {
    return {
      errCode: 1001,
      errMsg: '请求头错误',
      errFix: '传递有效的x-signature-ed25519请求头'
    }
  }
  if (!event.headers['x-signature-timestamp'] || !Number.isInteger(Number(event.headers['x-signature-timestamp'])) || Number(event.headers['x-signature-timestamp']) * 1000 > Date.now() || Number(event.headers['x-signature-timestamp']) * 1000 < Date.now() - 5000) {
    return {
      errCode: 1001,
      errMsg: '请求头错误',
      errFix: '传递x-signature-timestamp请求头'
    }
  }
  if (!tweetnacl.sign.detached.verify(Buffer.from(event.headers['x-signature-timestamp'] + event.body), Buffer.from(event.headers['x-signature-ed25519'], 'hex'), tweetnacl.sign.keyPair.fromSeed(Buffer.from(process.env.qqbotsecret)).publicKey)) {
    return {
      errCode: 1001,
      errMsg: 'x-signature-ed25519请求头签名校验失败',
      errFix: '无修复建议'
    }
  }
  const requestdata = JSON.parse(event.body)
  const res = await axios.post('https://bots.qq.com/app/getAppAccessToken', {
    appId: '102915407',
    clientSecret: process.env.qqbotsecret
  })
  try {
    await axios.post('https://api.sgroup.qq.com/v2/users/' + requestdata.d.author['user_openid'] + '/messages', {
      msg_type: 0,
      event_id: requestdata.id,
      msg_id: requestdata.d.id,
      content: '【事件opcode】' + requestdata.op + '\n【事件id】' + requestdata.id + '\n【事件类型】' + requestdata.t + '\n【消息id】+' + requestdata.d.id + '\n【消息内容】' + requestdata.d.content + '\n【消息生产时间】' + requestdata.d.timestamp + '\n【用户id】' + requestdata.d.author.id + '\n【用户openid】' + requestdata.d.author['user_openid'] + '\n【消息类型】' + requestdata.d.message_type
    }, {
      headers: {
        Authorization: 'QQBot ' + res.data['access_token']
      }
    })
    return {
      errCode: 0,
      errMsg: '成功'
    }
  } catch (err) {
    if (err.response.data.code != 40054005) {
      return {
        errCode: 8000,
        errMsg: '发送消息失败，原因：' + err.response.data.message,
        errFix: '无修复建议'
      }
    }
    return {
      errCode: 0,
      errMsg: '成功'
    }
  }
}