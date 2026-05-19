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
  const validproducts = ['ssl', 'password', 'todo', 'todoteam']
  if (!validproducts.includes(requestdata.product)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的product参数'
    }
  }
  const uidlengthmap = {
    ssl: 32,
    password: 32,
    todo: 32,
    todoteam: 36
  }
  if (typeof (requestdata.uid) != 'string' || requestdata.uid.length != uidlengthmap[requestdata.product]) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的uid参数'
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
      permission: ['account', 'admin'],
      service: ['admin'],
      apiName: 'admin_searchProductUser'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    if (requestdata.product == 'todoteam') {
      const userres = await db.collection('todoteamaccount').where({
        teamId: requestdata.uid,
        admin: true
      }).skip(skip).limit(limit).field({
        _id: false,
        teamId: true,
        teamName: true,
        isTeamEnabled: true,
        userMaxCount: true,
        todoMaxCount: true,
        userId: true
      }).get()
      return {
        errCode: 0,
        errMsg: '成功',
        data: userres.data
      }
    } else {
      const userres = await db.collection('productuser').where({
        product: requestdata.product,
        uid: requestdata.uid
      }).field({
        _id: false,
        uid: true,
        productionLimit: true,
        stagingLimit: true,
        vipEndDate: true,
        backupMaxCount: true
      }).get()
      return {
        errCode: 0,
        errMsg: '成功',
        data: userres.data
      }
    }
  }
}