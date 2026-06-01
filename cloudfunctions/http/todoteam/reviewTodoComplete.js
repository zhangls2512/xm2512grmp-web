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
  if (typeof (requestdata.todoId) != 'string' || requestdata.todoId.length != 36) {
    return {
      code: 400,
      msg: '请求参数错误'
    }
  }
  if (typeof (requestdata.userId) != 'string' || requestdata.userId.length != 8) {
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
      id: requestdata.todoId
    }).get()
    if (todores.data.length == 0) {
      return {
        code: 400,
        msg: '待办不存在'
      }
    }
    const todo = todores.data[0]
    if (!todo.allowReviewUids.includes(account.userId)) {
      return {
        code: 403,
        msg: '无权限'
      }
    }
    const recentCompletedTime = todo.recentCompletedTime
    const reviewRecentCompletedTime = todo.reviewRecentCompletedTime
    const recentCompletedTimeIndex = recentCompletedTime.findIndex(item => item.uid == requestdata.userId)
    const reviewRecentCompletedTimeIndex = reviewRecentCompletedTime.findIndex(item => item.uid == requestdata.userId)
    if (recentCompletedTimeIndex == -1 && reviewRecentCompletedTimeIndex == -1) {
      return {
        code: 400,
        msg: '待办未完成'
      }
    }
    const completedTime = Date.now()
    if (recentCompletedTimeIndex == -1) {
      if (todo.endTime < completedTime) {
        return {
          code: 400,
          msg: '已过结束时间'
        }
      }
      recentCompletedTime.push(reviewRecentCompletedTime[reviewRecentCompletedTimeIndex])
      reviewRecentCompletedTime.splice(reviewRecentCompletedTimeIndex, 1)
    }
    if (reviewRecentCompletedTimeIndex == -1) {
      if (todo.endTime >= completedTime) {
        reviewRecentCompletedTime.push(recentCompletedTime[recentCompletedTimeIndex])
      }
      recentCompletedTime.splice(recentCompletedTimeIndex, 1)
    }
    await db.collection('teamtodo').where({
      teamId: team.teamId,
      id: requestdata.todoId
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