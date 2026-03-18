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
  const validproducts = ['password']
  if (!validproducts.includes(requestdata.product)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的product参数'
    }
  }
  if ((!Number.isInteger(requestdata.permission) || requestdata.permission <= 0) && typeof (requestdata.permission) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的permission参数'
    }
  }
  if (!Number.isInteger(requestdata.duration) || requestdata.duration < 0) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的duration参数'
    }
  }
  if (!Number.isInteger(requestdata.endDate) || (requestdata.endDate != 0 && requestdata.endDate <= Date.now())) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的endDate参数'
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
      apiName: 'admin_newVipcode'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    if (typeof (requestdata.permission) == 'string') {
      const userres = await db.collection('productuser').where({
        product: requestdata.product,
        uid: requestdata.permission
      }).get()
      if (userres.data.length == 0) {
        return {
          errCode: 8000,
          errMsg: '用户不存在',
          errFix: '传递有效的uid参数'
        }
      }
      await db.collection('vipcode').add({
        date: Date.now(),
        duration: requestdata.duration,
        endDate: requestdata.endDate,
        permission: requestdata.permission,
        product: requestdata.product
      })
      return {
        errCode: 0,
        errMsg: '成功'
      }
    }
    const addres = await db.collection('vipcode').add({
      date: Date.now(),
      duration: requestdata.duration,
      endDate: requestdata.endDate,
      permission: requestdata.permission,
      product: requestdata.product
    })
    return {
      errCode: 0,
      errMsg: '成功',
      vipcode: addres.id
    }
  }
}