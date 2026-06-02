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
  if (!Number.isInteger(requestdata.time) || requestdata.time < 0) {
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
    const team = res.result.team
    if (requestdata.type == 'complete') {
      const todores = await db.collection('teamtodo').where({
        teamId: team.teamId,
        startTime: db.command.lte(requestdata.time),
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
        const recentCompletedTimeIndex = item.recentCompletedTime.findIndex(item => item.uid == account.userId)
        const reviewRecentCompletedTimeIndex = item.reviewRecentCompletedTime.findIndex(item => item.uid == account.userId)
        if (item.completeMode == 'single') {
          if (item.recentCompletedTime.length > 0) {
            item.status = 'finished'
          } else if (reviewRecentCompletedTimeIndex != -1) {
            item.status = 'reviewing'
          } else {
            item.status = 'pending'
          }
        }
        if (item.completeMode == 'multiple') {
          if (recentCompletedTimeIndex != -1) {
            item.status = 'finished'
          } else if (reviewRecentCompletedTimeIndex != -1) {
            item.status = 'reviewing'
          } else {
            item.status = 'pending'
          }
        }
        delete item.recentCompletedTime
        delete item.reviewRecentCompletedTime
      })
      return {
        code: 0,
        msg: '成功',
        data: data
      }
    }
    if (requestdata.type == 'review') {
      const todores = await db.collection('teamtodo').where({
        teamId: team.teamId,
        startTime: db.command.lte(requestdata.time),
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
          teamId: team.teamId,
          startTime: db.command.lte(requestdata.time),
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
          teamId: team.teamId,
          startTime: db.command.lte(requestdata.time)
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
        teamId: team.teamId,
        startTime: db.command.lte(requestdata.time),
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