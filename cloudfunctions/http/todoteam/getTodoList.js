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
  const validtypes = ['complete', 'get', 'review', 'create']
  if (!validtypes.includes(requestdata.type)) {
    return {
      code: 400,
      msg: '请求参数错误'
    }
  }
  if (!Number.isInteger(requestdata.time) || requestdata.time < -1) {
    return {
      code: 400,
      msg: '请求参数错误'
    }
  }
  let skip = 0
  let limit = 10
  if (Number.isInteger(requestdata.skip) && requestdata.skip >= 0) {
    skip = requestdata.skip
  }
  if (Number.isInteger(requestdata.limit) && requestdata.limit > 0 && requestdata.limit <= 20) {
    limit = requestdata.limit
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
    if (requestdata.type == 'complete') {
      const todores = await db.collection('teamtodo').where({
        teamId: account.teamId,
        startTime: requestdata.time === -1 ? db.command.gte(0) : db.command.lt(requestdata.time + 86400000),
        allowCompleteUids: db.command.in([account.userId])
      }).skip(skip).limit(limit).field({
        _id: false,
        allowGetUids: false,
        allowCompleteUids: false,
        allowReviewUids: false,
        uid: false,
        setting: false
      }).get()
      const data = todores.data
      data.forEach(item => {
        const recentCompleteTimeIndex = item.recentCompleteTime.findIndex(item => item.uid == account.userId)
        const reviewRecentCompleteTimeIndex = item.reviewRecentCompleteTime.findIndex(item => item.uid == account.userId)
        if (item.completeMode == 'single') {
          if (item.recentCompleteTime.length > 0) {
            item.status = 'finished'
            item.recentCompletedTime = item.recentCompleteTime[0].time
          } else if (reviewRecentCompleteTimeIndex != -1) {
            item.status = 'reviewing'
            item.recentCompletedTime = item.reviewRecentCompleteTime[reviewRecentCompleteTimeIndex].time
          } else {
            item.status = 'pending'
            item.recentCompletedTime = -1
          }
        }
        if (item.completeMode == 'multiple') {
          if (recentCompleteTimeIndex != -1) {
            item.status = 'finished'
            item.recentCompletedTime = item.recentCompleteTime[recentCompleteTimeIndex].time
          } else if (reviewRecentCompleteTimeIndex != -1) {
            item.status = 'reviewing'
            item.recentCompletedTime = item.reviewRecentCompleteTime[reviewRecentCompleteTimeIndex].time
          } else {
            item.status = 'pending'
            item.recentCompletedTime = -1
          }
        }
        delete item.recentCompleteTime
        delete item.reviewRecentCompleteTime
      })
      return {
        code: 0,
        msg: '成功',
        data: data
      }
    }
    if (requestdata.type == 'review') {
      const todores = await db.collection('teamtodo').where({
        teamId: account.teamId,
        startTime: requestdata.time === -1 ? db.command.gte(0) : db.command.lt(requestdata.time + 86400000),
        allowReviewUids: db.command.in([account.userId])
      }).skip(skip).limit(limit).field({
        _id: false,
        allowGetUids: false,
        allowCompleteUids: false,
        allowReviewUids: false,
        uid: false,
        setting: false
      }).get()
      return {
        code: 0,
        msg: '成功',
        data: todores.data
      }
    }
    if (requestdata.type == 'get') {
      if (!account.admin && !account.permission.includes('getTodo')) {
        const todores = await db.collection('teamtodo').where({
          teamId: account.teamId,
          startTime: requestdata.time === -1 ? db.command.gte(0) : db.command.lt(requestdata.time + 86400000),
          allowGetUids: db.command.in([account.userId])
        }).skip(skip).limit(limit).field({
          _id: false
        }).get()
        return {
          code: 0,
          msg: '成功',
          data: todores.data
        }
      } else {
        const todores = await db.collection('teamtodo').where({
          teamId: account.teamId,
          startTime: requestdata.time === -1 ? db.command.gte(0) : db.command.lt(requestdata.time + 86400000)
        }).skip(skip).limit(limit).field({
          _id: false
        }).get()
        return {
          code: 0,
          msg: '成功',
          data: todores.data
        }
      }
    }
    if (requestdata.type == 'create') {
      const todores = await db.collection('teamtodo').where({
        teamId: account.teamId,
        startTime: requestdata.time === -1 ? db.command.gte(0) : db.command.lt(requestdata.time + 86400000),
        uid: account.userId
      }).skip(skip).limit(limit).field({
        _id: false
      }).get()
      return {
        code: 0,
        msg: '成功',
        data: todores.data
      }
    }
  }
}