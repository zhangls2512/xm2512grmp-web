'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
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
  if (typeof (requestdata.accessToken) != 'string' && typeof (requestdata.accessKey) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的accessToken或accessKey参数'
    }
  }
  if (!Array.isArray(requestdata.id) || requestdata.id.length == 0 || requestdata.id.length > 20 || !requestdata.id.every(item => {
    if (typeof (item) == 'string' && item.length == 32) {
      return true
    } else {
      return false
    }
  })) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的id参数'
    }
  }
  let type = ''
  let code = ''
  if (requestdata.accessToken) {
    type = 'accesstoken'
    code = requestdata.accessToken
  } else {
    if (!requestdata.accessKey) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的accessKey参数'
      }
    }
    type = 'accesskey'
    code = requestdata.accessKey
  }
  const res = await app.callFunction({
    name: 'authCheck',
    data: {
      type: type,
      data: {
        code: code,
        requestIp: event.headers['x-real-ip']
      },
      permission: ['account', 'resource'],
      service: ['resource'],
      apiName: 'resource_syncAddResourceInfo'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const promisesa = [...new Set(requestdata.id)].map(async (resourceaddid) => {
      const resourceaddres = await db.collection('resourceadd').where({
        _id: resourceaddid,
        uid: res.result.account._id
      }).get()
      const promisesb = resourceaddres.data.map(async (resourceadditem) => {
        const resourceres = await db.collection('resource').where({
          _id: resourceadditem.resourceId,
          releaseStatus: 'release'
        }).get()
        if (resourceres.data.length > 0) {
          await db.collection('resourceadd').where({
            _id: resourceaddid
          }).update({
            name: resourceres.data[0].name,
            version: resourceres.data[0].version
          })
        } else {
          await db.collection('resourceadd').where({
            _id: resourceaddid
          }).update({
            name: null,
            version: null
          })
        }
      })
      await Promise.all(promisesb)
    })
    await Promise.all(promisesa)
    return {
      errCode: 0,
      errMsg: '成功'
    }
  }
}