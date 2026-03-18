'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const openai = require('openai')
  const app = tcb.init()
  const auth = app.auth()
  try {
    if (typeof (event.accessToken) != 'string' && typeof (event.accessKey) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的accessToken或accessKey参数'
      }
    }
    if (typeof (event.name) != 'string' || !event.name) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的name参数'
      }
    }
    const validtypes = ['desc', 'tag']
    if (!validtypes.includes(event.type)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的type参数'
      }
    }
    let typewz = ''
    if (event.type == 'desc') {
      typewz = '简介'
    }
    if (event.type == 'tag') {
      typewz = '标签（输出一维数组）'
    }
    let type = ''
    let code = ''
    if (event.accessToken) {
      type = 'accesstoken'
      code = event.accessToken
    } else {
      if (!event.accessKey) {
        return {
          errCode: 1001,
          errMsg: '请求参数错误',
          errFix: '传递有效的accessKey参数'
        }
      }
      type = 'accesskey'
      code = event.accessKey
    }
    const res = await app.callFunction({
      name: 'authCheck',
      data: {
        type: type,
        data: {
          code: code,
          requestIp: auth.getClientIP()
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
              content: '为名称“' + event.name + '”生成' + typewz
            }
          ],
          model: 'deepseek-chat'
        })
        const content = aires.choices[0].message.content
        if (event.type == 'desc') {
          return {
            errCode: 0,
            errMsg: '成功',
            data: content
          }
        }
        if (event.type == 'tag') {
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