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
      'product_useVipcode',
      'product_getViplogCount',
      'product_getViplogList',
      'product_useInvitationcode',
      'product_getInviteUserCount',
      'account_openService',
      'account_closeService',
      'account_getBanlogCount',
      'account_getBanlogList',
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
      'admin_deleteBaxk',
      'admin_newVipcode',
      'admin_getVipcodeCount',
      'admin_getVipcodeList',
      'admin_deleteVipcode',
      'admin_getViplogCount',
      'admin_getViplogList',
      'admin_getPushCount',
      'admin_getPushList',
      'admin_sendPush',
      'admin_getPushlogCount',
      'admin_getPushlogList',
      'admin_revokePush',
      'admin_deletePushlog',
      'admin_getResourceCount',
      'admin_getResourceList',
      'admin_getResourceInfo',
      'admin_releaseResource',
      'admin_unreleaseResource',
      'admin_updateResource',
      'admin_updateResourceAuu',
      'admin_updateResourceUvwr',
      'admin_deleteResource',
      'admin_getProcessingReviewResource',
      'admin_getProcessingReviewResourceCount',
      'admin_updateResourceReviewResult',
      'admin_getSslUserCount',
      'admin_getSslUserList',
      'admin_SearchSslUser',
      'admin_newSslLimitChange',
      'admin_getSslLimitChangeCount',
      'admin_getSslLimitChangeList',
      'admin_getPasswordUserCount',
      'admin_getPasswordUserList',
      'admin_SearchPasswordUser',
      'resource_newAddResource',
      'resource_getAddResourceCount',
      'resource_getAddResourceList',
      'resource_updateAddResource',
      'resource_syncAddResourceInfo',
      'resource_deleteAddResource',
      'resource_checkResourceAdded',
      'resource_updateResourceUserSetting',
      'resourcecreator_aiGenerateResourceInfo',
      'resourcecreator_newResource',
      'resourcecreator_getResourceCount',
      'resourcecreator_getResourceList',
      'resourcecreator_getResourceInfo',
      'resourcecreator_updateResourceVersion',
      'resourcecreator_submitReviewResource',
      'resourcecreator_unsubmitReviewResource',
      'resourcecreator_updateReviewResource',
      'resourcecreator_deleteResource',
      'ssl_getLimitChangeCount',
      'ssl_getLimitChangeList',
      'ssl_getAcmeAccountInfo',
      'ssl_deactivateAcmeAccount',
      'ssl_newAcmeAccount',
      'ssl_newOrder',
      'ssl_getOrderCount',
      'ssl_getOrderList',
      'ssl_getOrderInfo',
      'ssl_getOrderAuthorization',
      'ssl_refreshOrder',
      'ssl_submitOrder',
      'ssl_updateOrder',
      'ssl_deleteOrder',
      'ssl_deleteUselessStatusOrder',
      'ssl_deactivateAuthorization',
      'ssl_respondChallenge',
      'ssl_revokeCertificate',
      'ssl_getDnsTaskCount',
      'ssl_getDnsTaskList',
      'ssl_endDnsTask',
      'ssl_deleteDnsTask',
      'ssl_deleteEndStatusDnsTask',
      'ssl_newTemplate',
      'ssl_getTemplateList',
      'ssl_getTemplateInfo',
      'ssl_updateTemplate',
      'ssl_deleteTemplate',
      'ssl_updateUserSetting',
      'ssl_updateUserDns',
      'password_setBackup',
      'password_getBackupCount',
      'password_getBackupList',
      'password_deleteBackup',
      'password_clearBackup'
    ]
    if (!Array.isArray(requestdata.allowApi) || !requestdata.allowApi.every(item => validapis.includes(item))) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的allowApi参数'
      }
    }
    if (!Array.isArray(requestdata.allowIp) || !requestdata.allowIp.every(item => new cidr().range(item) != null)) {
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
      const accesskeys = account.accessKey
      if (accesskeys.length >= 9) {
        return {
          errCode: 8000,
          errMsg: '暂仅支持最多10个accessKey',
          errFix: '无修复建议'
        }
      }
      const accesskeyvalue = sm4.encrypt(account._id + '\0' + nanoid(60), process.env.key)
      const accesskey = {
        name: requestdata.name,
        value: accesskeyvalue,
        endDate: requestdata.endDate,
        allowApi: requestdata.allowApi,
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