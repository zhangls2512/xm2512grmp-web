exports.main = async (event) => {
  const axios = require('axios')
  if (event.httpMethod != 'POST') {
    return {
      errCode: 1000,
      errMsg: '请求方法错误',
      errFix: '使用POST方法请求'
    }
  }
  try {
    const requestdata = JSON.parse(event.body)
    if (typeof (requestdata.path) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的path参数'
      }
    }
    const { data } = await axios.get(requestdata.path + '/webapi/entry.cgi?api=SYNO.Core.Desktop.UIString&version=1&method=getjs&lang=chs')
    return {
      errCode: 0,
      errMsg: '成功',
      data: eval(data)
    }
  } catch {
    return {
      errCode: 5000,
      errMsg: '内部错误',
      errFix: '联系客服'
    }
  }
}