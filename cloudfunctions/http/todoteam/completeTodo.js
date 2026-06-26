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
  if (typeof (requestdata.id) != 'string' || requestdata.id.length != 36) {
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
    const todores = await db.collection('teamtodo').where({
      teamId: account.teamId,
      id: requestdata.id
    }).get()
    if (todores.data.length == 0) {
      return {
        code: 400,
        msg: '待办不存在'
      }
    }
    const todo = todores.data[0]
    if (!todo.allowCompleteUids.includes(account.userId)) {
      return {
        code: 403,
        msg: '无权限'
      }
    }
    const recentCompleteTime = todo.recentCompleteTime
    const reviewRecentCompleteTime = todo.reviewRecentCompleteTime
    const recentCompleteTimeIndex = recentCompleteTime.findIndex(item => item.uid == account.userId)
    const reviewRecentCompleteTimeIndex = reviewRecentCompleteTime.findIndex(item => item.uid == account.userId)
    if (recentCompleteTimeIndex == -1 && reviewRecentCompleteTimeIndex == -1) {
      if (todo.completeMode == 'single' && recentCompleteTime.length > 0) {
        return {
          code: 400,
          msg: '已完成'
        }
      }
      const completeTime = Date.now()
      if (todo.startTime > completeTime) {
        return {
          code: 400,
          msg: '未到开始时间'
        }
      }
      if (todo.endTime < completeTime && todo.endTime != -1) {
        return {
          code: 400,
          msg: '已过结束时间'
        }
      }
      if (todo.allowReviewUids.length == 0) {
        recentCompleteTime.push({
          uid: account.userId,
          time: completeTime
        })
      }
      if (todo.allowReviewUids.length > 0) {
        reviewRecentCompleteTime.push({
          uid: account.userId,
          time: completeTime
        })
      }
    } else {
      if (recentCompleteTimeIndex != -1) {
        recentCompleteTime.splice(recentCompleteTimeIndex, 1)
      }
      if (reviewRecentCompleteTimeIndex != -1) {
        reviewRecentCompleteTime.splice(reviewRecentCompleteTimeIndex, 1)
      }
    }
    await db.collection('teamtodo').where({
      teamId: account.teamId,
      id: requestdata.id
    }).update({
      recentCompleteTime: recentCompleteTime,
      reviewRecentCompleteTime: reviewRecentCompleteTime
    })
    return {
      code: 0,
      msg: '成功'
    }
  }
}