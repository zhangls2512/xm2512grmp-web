exports.main = async (event) => {
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
  try {
    const validpaths = []
    fs.readdirSync(__dirname).forEach(itema => {
      if (fs.statSync(__dirname + '/' + itema).isDirectory()) {
        fs.readdirSync(__dirname + '/' + itema).forEach(itemb => {
          if (itemb.endsWith('.js')) {
            if (itema === 'common') {
              validpaths.push('/' + itemb.replace('.js', ''))
            } else {
              validpaths.push('/' + itema + '/' + itemb.replace('.js', ''))
            }
          }
        })
      }
    })
    if (!validpaths.includes(event.path)) {
      return {
        errCode: 1002,
        errMsg: '请求路径错误',
        errFix: '无修复建议'
      }
    }
    try {
      JSON.parse(event.body)
    } catch {
      return {
        errCode: 1003,
        errMsg: '请求体解析失败',
        errFix: '传递合法的JSON请求体'
      }
    }
    let path = ''
    const count = event.path.split('/').length - 1
    if (count == 1) {
      path = __dirname + '/common' + event.path
    }
    if (count == 2) {
      path = __dirname + event.path
    }
    return await require(path).main(event)
  } catch (err) {
    const headers = {}
    Object.keys(event.headers).forEach(item => {
      if (!item.startsWith('x-cloudbase-')) {
        headers[item] = event.headers[item]
      }
    })
    await nodemailertransport.sendMail({
      from: 'zhangls2512@vip.qq.com',
      to: '2300990296@qq.com',
      subject: '接口内部错误通知',
      text: '请求路径：' + event.path + '\n错误堆栈：' + err.stack + '\n请求体：' + event.body + '\n请求头：' + JSON.stringify(headers)
    })
    return {
      errCode: 5000,
      errMsg: '内部错误',
      errFix: '联系客服'
    }
  }
}