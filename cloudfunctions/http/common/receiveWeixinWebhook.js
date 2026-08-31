exports.main = async (event) => {
  const crypto = require('crypto')
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
  await nodemailertransport.sendMail({
    from: 'zhangls2512@vip.qq.com',
    to: '2300990296@qq.com',
    subject: '收到微信推送通知',
    text: JSON.stringify(event.body)
  })
  return {
    errCode: 0,
    errMsg: '成功'
  }
}