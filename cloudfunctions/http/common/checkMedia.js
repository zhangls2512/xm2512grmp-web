'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const axios = require('axios')
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
  const requestdata = JSON.parse(event.body)
  if (typeof (requestdata.content) != 'string' || !requestdata.content) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的content参数'
    }
  }
  if (typeof (requestdata.openid) != 'string' || !requestdata.openid) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的openid参数'
    }
  }
  const path = 'mediacheck/' + crypto.randomUUID()
  const uploadres = await app.uploadFile({
    cloudPath: path,
    fileContent: Buffer.from(requestdata.content, 'base64')
  })
  const urlres = await app.getTempFileURL({
    fileList: [
      {
        fileID: uploadres.fileID,
        maxAge: 300
      }
    ]
  })
  const tokenres = await axios.post('https://api.weixin.qq.com/cgi-bin/stable_token', {
    grant_type: 'client_credential',
    appid: 'wx1146ee46b77583ec',
    secret: process.env.tpclappsecret
  })
  if (tokenres.data.errcode) {
    return {
      errCode: 8000,
      errMsg: 'access_token获取失败，原因：' + tokenres.data.errmsg,
      errFix: '无修复建议'
    }
  }
  const checkres = await axios.post('https://api.weixin.qq.com/wxa/media_check_async?access_token=' + tokenres.data.access_token, {
    media_url: urlres.fileList[0].tempFileURL,
    media_type: 2,
    version: 2,
    scene: 1,
    openid: requestdata.openid
  })
  if (checkres.data.errcode) {
    return {
      errCode: 8001,
      errMsg: '检测任务创建失败，原因：' + tokenres.data.errmsg,
      errFix: '无修复建议'
    }
  }
  await db.collection('mediachecklog').add({
    traceId: checkres.data.trace_id,
    result: {}
  })
  let result = false
  while (!result) {
    const getres = await db.collection('mediachecklog').where({
      traceId: checkres.data.trace_id
    }).get()
    const data = getres.data[0]
    if (data.result.suggest) {
      result = data.result
    }
  }
  await db.collection('mediachecklog').where({
    traceId: checkres.data.trace_id
  }).remove()
  await app.deleteFile({
    fileList: [uploadres.fileID]
  })
  if (result.suggest == 'pass') {
    return {
      errCode: 0,
      errMsg: '检测通过'
    }
  }
  if (result.suggest == 'error') {
    return {
      errCode: 8002,
      errMsg: '检测失败，错误码：' + result.errCode,
      errFix: '无修复建议'
    }
  }
  if (result.suggest == 'risky' || result.suggest == 'review') {
    const labelmap = {
      20001: '时政',
      20002: '色情',
      20006: '违法犯罪',
      21000: '其他'
    }
    return {
      errCode: 8003,
      errMsg: '检测不通过，原因：' + labelmap[result.label],
      errFix: '无修复建议'
    }
  }
}