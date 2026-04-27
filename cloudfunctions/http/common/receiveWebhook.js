'use strict'
exports.main = async (event) => {
  const axios = require('axios')
  const crypto = require('crypto')
  const fs = require('fs')
  const nodemailer = require('nodemailer')
  const nodemailertransport = nodemailer.createTransport({
    host: 'smtp.qq.com',
    secure: true,
    auth: {
      user: 'zhangls2512@vip.qq.com',
      pass: process.env.mailtoken
    }
  })
  if (event.httpMethod != 'POST') {
    return {
      errCode: 1000,
      errMsg: '请求方法错误',
      errFix: '使用POST方法请求'
    }
  }
  const requestdata = JSON.parse(event.body)
  if (!Number.isInteger(requestdata.timeStamp) || Date.now() - requestdata.timeStamp > 5000 || requestdata.timeStamp > Date.now()) {
    return {
      errCode: 1001,
      errMsg: 'timeStamp校验失败',
      errFix: '无修复建议'
    }
  }
  const hash = crypto.createHash('sha512').update(requestdata.data + '\0' + requestdata.timeStamp).digest()
  const publickey = fs.readFileSync(__dirname + '/publickey.txt')
  if (!crypto.createVerify('sha512').update(hash).verify(publickey, Buffer.from(requestdata.signature, 'base64'))) {
    return {
      errCode: 1001,
      errMsg: 'signature校验失败',
      errFix: '无修复建议'
    }
  }
  const receivedata = JSON.parse(requestdata.data)
  if (receivedata.noticeName != 'resource_webhook_versionupdate') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的noticeName参数'
    }
  }
  let channelname = ''
  const resourceid = receivedata.resourceId
  const validresourceids = ['0e7893fb67e67aec0012ffd02eae679a', 'b013194767e67b6600146b805c3a6ba5', '80a8bd4f67e67bb6001344e3625c0400', '9f86c65667e67c2f00130c9f5b343245']
  if (!validresourceids.includes(resourceid)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的resourceId参数'
    }
  }
  if (resourceid == '0e7893fb67e67aec0012ffd02eae679a') {
    channelname = 'Canary'
  }
  if (resourceid == 'b013194767e67b6600146b805c3a6ba5') {
    channelname = 'Dev'
  }
  if (resourceid == '80a8bd4f67e67bb6001344e3625c0400') {
    channelname = 'Beta'
  }
  if (resourceid == '9f86c65667e67c2f00130c9f5b343245') {
    channelname = 'Releasepreview'
  }
  try {
    const { data } = await axios.post('http://api.chuckfang.com:12580/subscribe/openBroadcast', channelname + '频道有新版本：' + receivedata.newVersion + '。', {
      params: {
        channelId: 'dfe6398536a54e1dad34928d6b812944',
        unionId: process.env.unionid,
        url: 'https://learn.microsoft.com/en-us/windows-insider/about'
      },
      headers: {
        'Content-Type': 'text/plain'
      }
    })
    if (data.status == 200) {
      return {
        errCode: 0,
        errMsg: '成功'
      }
    } else {
      await nodemailertransport.sendMail({
        from: 'zhangls2512@vip.qq.com',
        to: '2300990296@qq.com',
        subject: '推送通知失败通知',
        text: '推送通知失败，原因：' + data.msg
      })
    }
  } catch (err) {
    await nodemailertransport.sendMail({
      from: 'zhangls2512@vip.qq.com',
      to: '2300990296@qq.com',
      subject: '请求推送通知接口失败通知',
      text: '请求推送通知接口失败，原因：' + err.response.data.error
    })
  }
  return {
    errCode: 0,
    errMsg: '成功'
  }
}