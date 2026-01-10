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
  let limit = 10
  if (Number.isInteger(requestdata.limit) && requestdata.limit > 0 && requestdata.limit <= 20) {
    limit = requestdata.limit
  }
  let type = ''
  let code = ''
  if (typeof (requestdata.accessToken) == 'string' && requestdata.accessToken) {
    type = 'accesstoken'
    code = requestdata.accessToken
  }
  if (typeof (requestdata.accessKey) == 'string' && requestdata.accessKey && !type) {
    type = 'accesskey'
    code = requestdata.accessKey
  }
  if (!type) {
    const resourceres = await db.collection('resource').aggregate().match({
      releaseStatus: 'release'
    }).sample({
      size: limit
    }).end()
    let array = resourceres.data
    array = array.map(item => ({
      _id: item._id,
      name: item.name,
      desc: item.desc,
      version: item.version,
      location: item.location,
      tag: item.tag,
      info: item.info
    }))
    return {
      errCode: 0,
      errMsg: '成功',
      data: array
    }
  }
  if (type) {
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
        apiName: 'resource_getRandomResourceList'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const userres = await db.collection('productuser').where({
        product: 'resource',
        uid: res.result.account._id
      }).get()
      const userdata = userres.data[0]
      const personalizedrecommendation = userdata.setting.personalizedRecommendation ? true : false
      if (!personalizedrecommendation) {
        const resourceres = await db.collection('resource').aggregate().match({
          releaseStatus: 'release'
        }).sample({
          size: limit
        }).end()
        const array = resourceres.data.map(item => ({
          _id: item._id,
          name: item.name,
          desc: item.desc,
          version: item.version,
          location: item.location,
          tag: item.tag,
          info: item.info
        }))
        return {
          errCode: 0,
          errMsg: '成功',
          data: array
        }
      }
      if (personalizedrecommendation) {
        const tag = [...new Set(userdata.setting.tag.flat())]
        const match = {
          releaseStatus: 'release'
        }
        if (tag.length > 0) {
          match.searchTag = db.command.in(tag)
        }
        const resourceres = await db.collection('resource').aggregate().match(match).sample({
          size: limit
        }).end()
        const array = resourceres.data.map(item => ({
          _id: item._id,
          name: item.name,
          desc: item.desc,
          version: item.version,
          location: item.location,
          tag: item.tag,
          info: item.info
        }))
        return {
          errCode: 0,
          errMsg: '成功',
          data: array
        }
      }
    }
  }
}