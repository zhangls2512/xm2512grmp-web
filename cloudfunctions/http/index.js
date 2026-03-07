exports.main = async (event) => {
  const nodemailer = require('nodemailer')
  const nodemailertransport = nodemailer.createTransport({
    host: 'smtp.qq.com',
    secure: true,
    auth: {
      user: 'zhangls2512@vip.qq.com',
      pass: process.env.mailtoken
    }
  })
  console.log('请求路径：' + event.path)
  console.log('请求入参：' + event.body)
  console.log('请求头：' + JSON.stringify(event.headers))
  let path = ''
  try {
    const count = event.path.split('/').length - 1
    if (count == 1) {
      path = __dirname + '/common' + event.path
    }
    if (count == 2) {
      path = __dirname + event.path
    }
    const res = await require(path).main(event)
    console.log('响应：' + JSON.stringify(res))
    if (res.errCode && event.httpMethod == 'POST' && event.body) {
      await nodemailertransport.sendMail({
        from: 'zhangls2512@vip.qq.com',
        to: '2300990296@qq.com',
        subject: '接口调用失败通知',
        text: '请求路径：' + event.path + '\n请求入参：' + event.body + '\n失败响应：' + JSON.stringify(res) + '\n请求头：' + JSON.stringify(event.headers)
      })
    }
    return res
  } catch (err) {
    await nodemailertransport.sendMail({
      from: 'zhangls2512@vip.qq.com',
      to: '2300990296@qq.com',
      subject: '接口内部错误通知',
      text: '请求路径：' + event.path + '\n错误堆栈：' + err.stack + '\n请求体：' + event.body + '\n请求头：' + JSON.stringify(event.headers)
    })
    return {
      errCode: 5000,
      errMsg: '内部错误',
      errFix: '联系客服'
    }
  }
}