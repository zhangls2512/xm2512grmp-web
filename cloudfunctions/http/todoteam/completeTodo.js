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
    if (!todo.allowCompleteUids.includes(account.userId)) {
      return {
        code: 403,
        msg: '无权限'
      }
    }
    const recentCompletedTime = todo.recentCompletedTime
    const reviewRecentCompletedTime = todo.reviewRecentCompletedTime
    const recentCompletedTimeIndex = recentCompletedTime.findIndex(item => item.uid == account.userId)
    const reviewRecentCompletedTimeIndex = reviewRecentCompletedTime.findIndex(item => item.uid == account.userId)
    if (recentCompletedTimeIndex == -1 && reviewRecentCompletedTimeIndex == -1) {
      if (todo.completeMode == 'single' && recentCompletedTime.length > 0) {
        return {
          code: 400,
          msg: '已完成'
        }
      }
      const completedTime = Date.now()
      if (todo.startTime > completedTime) {
        return {
          code: 400,
          msg: '未到开始时间'
        }
      }
      if (todo.endTime < completedTime && todo.endTime != -1) {
        return {
          code: 400,
          msg: '已过结束时间'
        }
      }
      if (todo.allowReviewUids.length == 0) {
        recentCompletedTime.push({
          uid: account.userId,
          time: completedTime
        })
      }
      if (todo.allowReviewUids.length > 0) {
        reviewRecentCompletedTime.push({
          uid: account.userId,
          time: completedTime
        })
      }
    } else {
      if (recentCompletedTimeIndex != -1) {
        recentCompletedTime.splice(recentCompletedTimeIndex, 1)
      }
      if (reviewRecentCompletedTimeIndex != -1) {
        reviewRecentCompletedTime.splice(reviewRecentCompletedTimeIndex, 1)
      }
    }
    await db.collection('teamtodo').where({
      teamId: team.teamId,
      id: requestdata.id
    }).update({
      recentCompletedTime: recentCompletedTime,
      reviewRecentCompletedTime: reviewRecentCompletedTime
    })
    return {
      code: 0,
      msg: '成功'
    }
  }
}