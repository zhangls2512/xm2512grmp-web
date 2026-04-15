'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const app = tcb.init()
  if (event.httpMethod != 'POST') {
    return {
      errCode: 1000,
      errMsg: '请求方法错误',
      errFix: '使用POST方法请求'
    }
  }
  const requestdata = JSON.parse(event.body)
  const validtypes = ['homeassistanthelper']
  if (!validtypes.includes(requestdata.type)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的type参数'
    }
  }
  const res = await app.getTempFileURL({
    fileList: [
      {
        fileID: 'cloud://zhangls2512-5ggbio7hc46f4036.7a68-zhangls2512-5ggbio7hc46f4036-1333179018/' + requestdata.type + '.txt',
        maxAge: 300
      }
    ]
  })
  return {
    errCode: 0,
    errMsg: '成功',
    downloadUrl: res.fileList[0].tempFileURL
  }
}