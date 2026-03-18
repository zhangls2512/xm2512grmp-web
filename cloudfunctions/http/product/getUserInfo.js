'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const { nanoid } = await import('nanoid')
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
  const validproducts = ['account', 'admin', 'resource', 'resourcecreator', 'ssl', 'password']
  if (!validproducts.includes(requestdata.product)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的product参数'
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
      permission: [],
      service: [requestdata.product],
      apiName: 'product_getUserInfo'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const uid = res.result.account._id
    const userres = await db.collection('productuser').where({
      product: requestdata.product,
      uid: uid
    }).field({
      _id: false,
      accountKey: false,
      product: false,
      uid: false
    }).get()
    const data = userres.data[0]
    if (requestdata.product == 'password' && !data.invitationCode) {
      const invitationCode = nanoid(15) + uid + nanoid(15)
      data.invitationCode = invitationCode
      await db.collection('productuser').where({
        product: requestdata.product,
        uid: uid
      }).update({
        invitationCode: invitationCode
      })
    }
    return {
      errCode: 0,
      errMsg: '成功',
      data: data
    }
  }
}