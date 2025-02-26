'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const cidr = require('cidr-js')
  const { sm4 } = require('sm-crypto-v2')
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
  try {
    const requestdata = JSON.parse(event.body)
    if (typeof (requestdata.accessToken) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的accessToken参数'
      }
    }
    if (typeof (requestdata.name) != 'string' || requestdata.name.length < 1 || requestdata.name.length > 10) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的name参数'
      }
    }
    if (!Number.isInteger(requestdata.endDate)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的endDate参数'
      }
    }
    const validapis = [
      'product_getUserInfo',
      'product_setWebhookUrl',
      'product_updateNoticeSetting',
      'account_openService',
      'account_closeService',
      'account_getUserBanlogCount',
      'account_getBanlog',
      'admin_getUserCount',
      'admin_getUserList',
      'admin_searchUser',
      'admin_updateUserPermission',
      'admin_newBanlog',
      'admin_getBanlogCount',
      'admin_getBanlogList',
      'admin_deleteBanlog',
      'admin_getProductBaList',
      'admin_newBaxk',
      'admin_getBaxkCount',
      'admin_getBaxkList',
      'admin_updateBaxkDesc',
      'admin_deleteBaxk'
    ]
    if (!Array.isArray(requestdata.api) || !requestdata.api.every(item => validapis.includes(item))) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的api参数'
      }
    }
    if (!Array.isArray(requestdata.allowIp) || !requestdata.allowIp.every(item => new cidr().range(item) !== null)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的allowIp参数'
      }
    }
    if (typeof (requestdata.status) != 'boolean') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的status参数'
      }
    }
    const res = await app.callFunction({
      name: 'authCheck',
      data: {
        type: 'accesstoken',
        data: {
          code: requestdata.accessToken
        },
        permission: [],
        service: []
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const account = res.result.account
      let accesskeys = account.accessKey
      if (accesskeys.length >= 9) {
        return {
          errCode: 8000,
          errMsg: '暂仅支持最多10个accessKey',
          errFix: '无修复建议'
        }
      }
      const accesskeyvalue = sm4.encrypt(account._id + '\0' + nanoid(30), process.env.key)
      const accesskey = {
        name: requestdata.name,
        value: accesskeyvalue,
        endDate: requestdata.endDate,
        api: requestdata.api,
        allowIp: requestdata.allowIp,
        status: requestdata.status,
        lastUsedDate: 0
      }
      accesskeys.push(accesskey)
      await db.collection('account').where({
        _id: account._id
      }).update({
        accessKey: accesskeys
      })
      return {
        errCode: 0,
        errMsg: '成功',
        accessKey: accesskeyvalue
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