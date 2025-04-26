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
  try {
    const requestdata = JSON.parse(event.body)
    if (typeof (requestdata.accessToken) != 'string' && typeof (requestdata.accessKey) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的accessToken或accessKey参数'
      }
    }
    const validtypes = ['password', 'info', 'tag']
    if (!validtypes.includes(requestdata.type)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的type参数'
      }
    }
    if (typeof (requestdata.id) != 'number') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的id参数'
      }
    }
    if (typeof (requestdata.content) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的content参数'
      }
    }
    if (typeof (requestdata.iv) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的iv参数'
      }
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
          requestIp: event.headers['x-real-ip']
        },
        permission: ['account', 'password'],
        service: ['password'],
        apiName: 'password_setBackup'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const uid = res.result.account._id
      const countres = await db.collection('password').where({
        type: requestdata.type,
        uid: uid
      }).count()
      if (countres.total >= 10) {
        const userres = await db.collection('productuser').where({
          product: 'password',
          uid: uid
        }).get()
        const vipenddate = userres.data[0].vipEndDate
        if (vipenddate < Date.now() && vipenddate !== 0) {
          return {
            errCode: 8000,
            errMsg: '数量达到上限',
            errFix: '开通会员'
          }
        }
        const passwordres = await db.collection('password').where({
          id: requestdata.id,
          type: requestdata.type,
          uid: uid
        }).get()
        if (passwordres.data.length == 0) {
          await db.collection('password').add({
            content: requestdata.content,
            id: requestdata.id,
            iv: requestdata.iv,
            type: requestdata.type,
            uid: uid
          })
          return {
            errCode: 0,
            errMsg: '成功'
          }
        }
        await db.collection('password').where({
          _id: passwordres.data[0]._id
        }).update({
          content: requestdata.content,
          iv: requestdata.iv
        })
        return {
          errCode: 0,
          errMsg: '成功'
        }
      }
      const passwordres = await db.collection('password').where({
        id: requestdata.id,
        type: requestdata.type,
        uid: uid
      }).get()
      if (passwordres.data.length == 0) {
        await db.collection('password').add({
          content: requestdata.content,
          id: requestdata.id,
          iv: requestdata.iv,
          type: requestdata.type,
          uid: uid
        })
        return {
          errCode: 0,
          errMsg: '成功'
        }
      }
      await db.collection('password').where({
        _id: passwordres.data[0]._id
      }).update({
        content: requestdata.content,
        iv: requestdata.iv
      })
      return {
        errCode: 0,
        errMsg: '成功'
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