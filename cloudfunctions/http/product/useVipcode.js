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
  if (typeof (requestdata.vipcode) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的vipcode参数'
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
  const vipcoderes = await db.collection('vipcode').where({
    _id: requestdata.vipcode
  }).get()
  if (vipcoderes.data.length == 0) {
    return {
      errCode: 8000,
      errMsg: '会员兑换码不存在',
      errFix: '无修复建议'
    }
  }
  const vipcodeinfo = vipcoderes.data[0]
  if (vipcodeinfo.endDate > 0 && vipcodeinfo.endDate < Date.now()) {
    return {
      errCode: 8001,
      errMsg: '会员兑换码已过期',
      errFix: '无修复建议'
    }
  }
  const res = await app.callFunction({
    name: 'authCheck',
    data: {
      type: type,
      data: {
        code: code,
        requestIp: event.headers['x-real-ip']
      },
      permission: ['account', vipcodeinfo.product],
      service: [vipcodeinfo.product],
      apiName: 'product_useVipcode'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const uid = res.result.account._id
    if (typeof (vipcodeinfo.permission) == 'string' && uid != vipcodeinfo.permission) {
      return {
        errCode: 8002,
        errMsg: '无权限使用此会员兑换码',
        errFix: '无修复建议'
      }
    }
    if (typeof (vipcodeinfo.permission) == 'string' && uid == vipcodeinfo.permission) {
      const viplogres = await db.collection('viplog').where({
        info: vipcodeinfo._id,
        product: vipcodeinfo.product,
        type: 'vipcode',
        uid: uid
      }).count()
      if (viplogres.total > 0) {
        return {
          errCode: 8003,
          errMsg: '会员兑换码已使用',
          errFix: '无修复建议'
        }
      }
      const userres = await db.collection('productuser').where({
        product: vipcodeinfo.product,
        uid: uid
      }).get()
      let vipenddate = userres.data[0].vipEndDate
      if (vipenddate == 0) {
        return {
          errCode: 8004,
          errMsg: '已是终身会员',
          errFix: '无修复建议'
        }
      }
      if (vipcodeinfo.duration == 0) {
        await db.collection('productuser').where({
          product: vipcodeinfo.product,
          uid: uid
        }).update({
          vipEndDate: 0
        })
      } else {
        if (vipenddate < Date.now()) {
          vipenddate = Date.now()
        }
        await db.collection('productuser').where({
          product: vipcodeinfo.product,
          uid: uid
        }).update({
          vipEndDate: vipenddate + vipcodeinfo.duration * 86400000
        })
      }
      await db.collection('viplog').add({
        date: Date.now(),
        duration: vipcodeinfo.duration,
        info: vipcodeinfo._id,
        product: vipcodeinfo.product,
        type: 'vipcode',
        uid: uid
      })
      return {
        errCode: 0,
        errMsg: '成功'
      }
    }
    if (typeof (vipcodeinfo.permission) == 'number') {
      const viplogres = await db.collection('viplog').where({
        info: vipcodeinfo._id,
        product: vipcodeinfo.product,
        type: 'vipcode',
        uid: uid
      }).count()
      if (viplogres.total > 0) {
        return {
          errCode: 8002,
          errMsg: '会员兑换码已使用',
          errFix: '无修复建议'
        }
      }
      const viplogcountres = await db.collection('viplog').where({
        info: vipcodeinfo._id,
        product: vipcodeinfo.product,
        type: 'vipcode'
      }).count()
      if (viplogcountres.total >= vipcodeinfo.permission) {
        return {
          errCode: 8003,
          errMsg: '会员兑换码已用完',
          errFix: '无修复建议'
        }
      }
      const userres = await db.collection('productuser').where({
        product: vipcodeinfo.product,
        uid: uid
      }).get()
      let vipenddate = userres.data[0].vipEndDate
      if (vipenddate == 0) {
        return {
          errCode: 8004,
          errMsg: '已是终身会员',
          errFix: '无修复建议'
        }
      }
      if (vipcodeinfo.duration == 0) {
        await db.collection('productuser').where({
          product: vipcodeinfo.product,
          uid: uid
        }).update({
          vipEndDate: 0
        })
      } else {
        if (vipenddate < Date.now()) {
          vipenddate = Date.now()
        }
        await db.collection('productuser').where({
          product: vipcodeinfo.product,
          uid: uid
        }).update({
          vipEndDate: vipenddate + vipcodeinfo.duration * 86400000
        })
      }
      await db.collection('viplog').add({
        date: Date.now(),
        duration: vipcodeinfo.duration,
        info: vipcodeinfo._id,
        product: vipcodeinfo.product,
        type: 'vipcode',
        uid: uid
      })
      return {
        errCode: 0,
        errMsg: '成功'
      }
    }
  }
}