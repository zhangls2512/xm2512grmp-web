'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const app = tcb.init()
  const db = app.database()
  if (event.httpMethod != 'POST') {
    return {
      code: 405,
      msg: '请求方法错误'
    }
  }
  const requestdata = JSON.parse(event.body)
  let success = true
  if (typeof (requestdata.id) != 'string' || requestdata.id.length != 36) {
    success = false
  }
  if (typeof (requestdata.content) != 'string' || !requestdata.content) {
    success = false
  }
  if (!Number.isInteger(requestdata.priority) || requestdata.priority < 0 || requestdata.priority > 9) {
    success = false
  }
  if (!Number.isInteger(requestdata.startTime) || requestdata.startTime < 0) {
    success = false
  }
  if (!Number.isInteger(requestdata.endTime) || (requestdata.endTime < requestdata.startTime && requestdata.endTime != -1)) {
    success = false
  }
  if (!Number.isInteger(requestdata.duration) || requestdata.duration < 0) {
    success = false
  }
  if (!Array.isArray(requestdata.excludeTime) || !requestdata.excludeTime.every(item => Number.isInteger(item) && item >= requestdata.startTime)) {
    success = false
  }
  if (!Array.isArray(requestdata.tag) || !requestdata.tag.every(item => typeof (item) == 'string' && item)) {
    success = false
  }
  if (!requestdata.location) {
    success = false
  }
  if (typeof (requestdata.location.latitude) != 'number' || requestdata.location.latitude < -90 || requestdata.location.latitude > 90) {
    success = false
  }
  if (typeof (requestdata.location.longitude) != 'number' || requestdata.location.longitude < -180 || requestdata.location.longitude > 180) {
    success = false
  }
  if (typeof (requestdata.location.location) != 'string') {
    success = false
  }
  if (!Array.isArray(requestdata.action)) {
    success = false
  }
  if (typeof (requestdata.bz) != 'string') {
    success = false
  }
  if (!Array.isArray(requestdata.allowGetUids) || !requestdata.allowGetUids.every(item => typeof (item) == 'string' && item.length == 8)) {
    success = false
  }
  if (!Array.isArray(requestdata.allowCompleteUids) || !requestdata.allowCompleteUids.every(item => typeof (item) == 'string' && item.length == 8)) {
    success = false
  }
  if (!Array.isArray(requestdata.allowReviewUids) || !requestdata.allowReviewUids.every(item => typeof (item) == 'string' && item.length == 8)) {
    success = false
  }
  const validcompletemodes = ['single', 'multiple']
  if (!validcompletemodes.includes(requestdata.completeMode)) {
    success = false
  }
  if (!success) {
    return {
      code: 400,
      msg: '请求参数错误'
    }
  }
  const res = await app.callFunction({
    name: 'authCheck',
    data: {
      type: 'todoteam',
      headers: event.headers
    }
  })
  if (res.result.code != 0) {
    return res.result
  } else {
    const account = res.result.account
    const team = res.result.team
    const todores = await db.collection('teamtodo').where({
      teamId: team.teamId,
      id: requestdata.id
    }).get()
    if (todores.data.length == 0) {
      return {
        code: 400,
        msg: '待办不存在'
      }
    }
    const todo = todores.data[0]
    if (!account.admin && account.userId != todo.uid) {
      return {
        code: 403,
        msg: '无权限'
      }
    }
    await db.collection('teamtodo').where({
      teamId: team.teamId,
      id: requestdata.id
    }).update({
      teamId: team.teamId,
      content: requestdata.content,
      priority: requestdata.priority,
      startTime: requestdata.startTime,
      endTime: requestdata.endTime,
      duration: requestdata.duration,
      recurrenceRule: '',
      excludeTime: [...new Set(requestdata.excludeTime)],
      tag: [...new Set(requestdata.tag)],
      dependency: [],
      location: {
        latitude: requestdata.location.latitude,
        longitude: requestdata.location.longitude,
        location: requestdata.location.location
      },
      action: requestdata.action,
      bz: requestdata.bz,
      allowGetUids: [...new Set(requestdata.allowGetUids)],
      allowCompleteUids: [...new Set(requestdata.allowCompleteUids)],
      allowReviewUids: [...new Set(requestdata.allowReviewUids)],
      completeMode: requestdata.completeMode,
      updateTime: Date.now()
    })
    return {
      code: 0,
      msg: '成功'
    }
  }
}