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
  if (typeof (requestdata.finished) != 'boolean') {
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
    const recentCompleteTime = todo.recentCompleteTime
    const reviewRecentCompleteTime = todo.reviewRecentCompleteTime
    const recentCompleteTimeIndex = recentCompleteTime.findIndex(item => item.uid == requestdata.userId)
    const reviewRecentCompleteTimeIndex = reviewRecentCompleteTime.findIndex(item => item.uid == requestdata.userId)
    if (!requestdata.finished) {
      if (reviewRecentCompleteTimeIndex == -1 && recentCompleteTimeIndex == -1) {
        return {
          code: 400,
          msg: '无完成情况'
        }
      }
      if (recentCompleteTimeIndex != -1) {
        recentCompleteTime.splice(recentCompleteTimeIndex, 1)
      }
      if (reviewRecentCompleteTimeIndex != -1) {
        reviewRecentCompleteTime.splice(reviewRecentCompleteTimeIndex, 1)
      }
    }
    if (requestdata.finished) {
      if (reviewRecentCompleteTimeIndex == -1) {
        return {
          code: 400,
          msg: '无待审核完成情况'
        }
      }
      const completeTime = Date.now()
      if (todo.endTime < completeTime && todo.endTime != -1) {
        return {
          code: 400,
          msg: '已过结束时间'
        }
      }
      recentCompleteTime.push(reviewRecentCompleteTime[reviewRecentCompleteTimeIndex])
      reviewRecentCompleteTime.splice(reviewRecentCompleteTimeIndex, 1)
    }
    await db.collection('teamtodo').where({
      teamId: team.teamId,
      id: requestdata.todoId
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