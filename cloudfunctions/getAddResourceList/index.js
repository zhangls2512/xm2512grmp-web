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
    let keyword = db.command.neq(null)
    if (typeof (requestdata.keyword) == 'string' && requestdata.keyword) {
      keyword = db.RegExp({
        regexp: requestdata.keyword
      })
    }
    let tag = db.command.neq(null)
    if (Array.isArray(requestdata.tag) && requestdata.tag.length > 0) {
      tag = db.command.all(requestdata.tag)
    }
    let checkversionupdate = false
    if (requestdata.checkVersionUpdate === true) {
      checkversionupdate = true
    }
    let skip = 0
    let limit = 10
    if (Number.isInteger(requestdata.skip)) {
      skip = requestdata.skip
    }
    if (Number.isInteger(requestdata.limit) && requestdata.limit > 0 && requestdata.limit <= 20) {
      limit = requestdata.limit
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
        service: ['resource'],
        apiName: 'resource_getAddResourceList'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const resourceaddres = await db.collection('resourceadd').where({
        name: keyword,
        tag: tag,
        uid: res.result.account._id
      }).skip(skip).limit(limit).field({
        uid: false
      }).get()
      if (checkversionupdate) {
        let resourceadd = resourceaddres.data
        const promises = resourceadd.map(async (resourceadditem, index) => {
          const resourceres = await db.collection('resource').where({
            _id: resourceadditem.resourceId,
            releaseStatus: 'release'
          }).get()
          if (resourceres.data.length > 0) {
            resourceadd[index].latestVersion = resourceres.data[0].version
          } else {
            resourceadd[index].latestVersion = null
          }
        })
        await Promise.all(promises)
        return {
          errCode: 0,
          errMsg: '成功',
          data: resourceadd
        }
      } else {
        return {
          errCode: 0,
          errMsg: '成功',
          data: resourceaddres.data
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