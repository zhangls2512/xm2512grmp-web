'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const openai = require('openai')
  const app = tcb.init()
  const auth = app.auth()
  const issdk = (auth.getUserInfo().isAnonymous || auth.getUserInfo().openId)
  let requestdata = ''
  let requestip = ''
  if (issdk) {
    requestdata = event
    requestip = auth.getClientIP()
  } else {
    requestip = event.headers['x-real-ip']
    if (event.httpMethod != 'POST') {
      return {
        errCode: 1000,
        errMsg: '请求方法错误',
        errFix: '使用POST方法请求'
      }
    }
    try {
      requestdata = JSON.parse(event.body)
    } catch {
      return {
        errCode: 5000,
        errMsg: '内部错误',
        errFix: '联系客服'
      }
    }
  }
  try {
    if (typeof (requestdata.accessToken) != 'string' && typeof (requestdata.accessKey) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的accessToken或accessKey参数'
      }
    }
    if (typeof (requestdata.name) != 'string' || !requestdata.name) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的name参数'
      }
    }
    const validtypes = ['desc', 'tag']
    if (!validtypes.includes(requestdata.type)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的type参数'
      }
    }
    let typewz = ''
    if (requestdata.type == 'desc') {
      typewz = '简介'
    }
    if (requestdata.type == 'tag') {
      typewz = '标签（输出一维数组）'
    }
    let type = ''
    let code = ''
    if (requestdata.accessToken) {
      type = 'accesstoken'
      code = requestdata.accessToken
    } else {
      type = 'accesskey'
      code = requestdata.accessKey
    }
    const res = await app.callFunction({
      name: 'authCheck',
      data: {
        type: type,
        data: {
          code: code,
          requestIp: requestip
        },
        permission: ['account', 'resourcecreator'],
        service: ['resourcecreator'],
        apiName: 'resourcecreator_aiGenerateResourceInfo'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const ai = new openai({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.key
      })
      try {
        const aires = await ai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: '为名称“' + requestdata.name + '”生成' + typewz
            }
          ],
          model: 'deepseek-chat'
        })
        const content = aires.choices[0].message.content
        if (requestdata.type == 'desc') {
          return {
            errCode: 0,
            errMsg: '成功',
            data: content
          }
        }
        if (requestdata.type == 'tag') {
          return {
            errCode: 0,
            errMsg: '成功',
            data: JSON.parse(content)
          }
        }
      } catch (err) {
        return {
          errCode: 8000,
          errMsg: 'Deepseek返回错误，错误信息：' + err.error.message,
          errFix: '联系客服'
        }
      }
    }
  } catch {
    return {
      errCode: 5000,
      errMsg: '内部错误',
      errFix: '联系客服'
    }
  }
}