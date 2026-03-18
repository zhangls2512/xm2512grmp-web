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
  if (typeof (requestdata.name) != 'string' || !requestdata.name) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的name参数'
    }
  }
  if (typeof (requestdata.desc) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的desc参数'
    }
  }
  if (typeof (requestdata.version) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的version参数'
    }
  }
  if (!Array.isArray(requestdata.location) || requestdata.location.length == 0) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的location参数'
    }
  }
  if (!Array.isArray(requestdata.tag)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的tag参数'
    }
  }
  if (!Array.isArray(requestdata.info)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的info参数'
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
      permission: ['account', 'resourcecreator'],
      service: ['resourcecreator'],
      apiName: 'resourcecreator_newResource'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const uid = res.result.account._id
    const addres = await db.collection('resource').add({
      allowUpdateUser: [],
      createDate: Date.now(),
      desc: '',
      disallowUpdate: false,
      info: [],
      location: [],
      name: '',
      releaseStatus: 'unrelease',
      reviewInfo: {
        desc: requestdata.desc,
        info: requestdata.info,
        location: requestdata.location,
        name: requestdata.name,
        tag: requestdata.tag,
        version: requestdata.version
      },
      reviewInvalidReason: '',
      reviewStatus: 'pending',
      searchTag: [],
      submitReviewDate: 0,
      tag: [],
      uid: uid,
      updateVersionWithoutReview: '',
      version: ''
    })
    return {
      errCode: 0,
      errMsg: '成功',
      id: addres.id
    }
  }
}