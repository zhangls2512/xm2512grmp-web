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
  const validservices = ['account', 'admin', 'resource', 'resourcecreator', 'ssl', 'password']
  if (!validservices.includes(requestdata.service)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的service参数'
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
      permission: [],
      service: [requestdata.service],
      apiName: 'account_closeService'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const uid = res.result.account._id
    const service = res.result.account.service
    service.splice(service.indexOf(requestdata.service), 1)
    if (requestdata.service == 'account') {
      await db.collection('productuser').where({
        product: 'account',
        uid: uid
      }).remove()
      await db.collection('account').where({
        _id: uid
      }).update({
        service: service
      })
      return {
        errCode: 0,
        errMsg: '成功'
      }
    }
    if (requestdata.service == 'admin') {
      await db.collection('productuser').where({
        product: 'admin',
        uid: uid
      }).remove()
      await db.collection('account').where({
        _id: uid
      }).update({
        service: service
      })
      return {
        errCode: 0,
        errMsg: '成功'
      }
    }
    if (requestdata.service == 'resource') {
      const resourceaddres = await db.collection('resourceadd').where({
        uid: uid
      }).count()
      if (resourceaddres.total > 0) {
        return {
          errCode: 8000,
          errMsg: '我的资源未清空',
          errFix: '无修复建议'
        }
      }
      await db.collection('productuser').where({
        product: 'resource',
        uid: uid
      }).remove()
      await db.collection('account').where({
        _id: uid
      }).update({
        service: service
      })
      return {
        errCode: 0,
        errMsg: '成功'
      }
    }
    if (requestdata.service == 'resourcecreator') {
      const resourceres = await db.collection('resource').where({
        uid: uid
      }).count()
      if (resourceres.total > 0) {
        return {
          errCode: 8000,
          errMsg: '存在投稿资源',
          errFix: '无修复建议'
        }
      }
      await db.collection('productuser').where({
        product: 'resourcecreator',
        uid: uid
      }).remove()
      await db.collection('account').where({
        _id: uid
      }).update({
        service: service
      })
      return {
        errCode: 0,
        errMsg: '成功'
      }
    }
    if (requestdata.service == 'ssl') {
      const orderres = await db.collection('sslorder').where({
        uid: uid
      }).count()
      if (orderres.total > 0) {
        return {
          errCode: 8000,
          errMsg: '存在订单',
          errFix: '无修复建议'
        }
      }
      const dnstaskres = await db.collection('dnstask').where({
        uid: uid
      }).count()
      if (dnstaskres.total > 0) {
        return {
          errCode: 8001,
          errMsg: '存在DNS自动配置任务',
          errFix: '无修复建议'
        }
      }
      const limitchangeres = await db.collection('ssllimitchange').where({
        uid: uid
      }).count()
      if (limitchangeres.total > 0) {
        return {
          errCode: 8002,
          errMsg: '存在额度变更记录',
          errFix: '无修复建议'
        }
      }
      const userres = await db.collection('productuser').where({
        product: 'ssl',
        uid: uid
      }).get()
      if (userres.data[0].accountKey.production) {
        return {
          errCode: 8003,
          errMsg: '正式ACME账户可用',
          errFix: '无修复建议'
        }
      }
      if (userres.data[0].accountKey.staging) {
        return {
          errCode: 8004,
          errMsg: '测试ACME账户可用',
          errFix: '无修复建议'
        }
      }
      await db.collection('ssltemplate').where({
        uid: uid
      }).remove()
      await db.collection('productuser').where({
        product: 'ssl',
        uid: uid
      }).remove()
      await db.collection('account').where({
        _id: uid
      }).update({
        service: service
      })
      return {
        errCode: 0,
        errMsg: '成功'
      }
    }
    if (requestdata.service == 'password') {
      const passwordres = await db.collection('password').where({
        uid: uid
      }).count()
      if (passwordres.total > 0) {
        return {
          errCode: 8000,
          errMsg: '存在云备份',
          errFix: '无修复建议'
        }
      }
      const viplogres = await db.collection('viplog').where({
        product: 'password',
        uid: uid
      }).count()
      if (viplogres.total > 0) {
        return {
          errCode: 8001,
          errMsg: '存在会员开通记录',
          errFix: '无修复建议'
        }
      }
      await db.collection('productuser').where({
        product: 'password',
        uid: uid
      }).remove()
      await db.collection('account').where({
        _id: uid
      }).update({
        service: service
      })
      return {
        errCode: 0,
        errMsg: '成功'
      }
    }
  }
}