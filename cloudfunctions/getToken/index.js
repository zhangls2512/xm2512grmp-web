'use strict'
exports.main = async () => {
  const tcb = require('@cloudbase/node-sdk')
  const axios = require('axios')
  const app = tcb.init()
  const db = app.database()
  const resssl = await axios.post('https://api.weixin.qq.com/cgi-bin/stable_token', {
    grant_type: 'client_credential',
    appid: 'wxd46f84216a1a856e',
    secret: process.env.sslappsecret
  })
  await db.collection('token').where({
    appid: 'wxd46f84216a1a856e'
  }).update({
    token: resssl.data.access_token
  })
  return 'success'
}