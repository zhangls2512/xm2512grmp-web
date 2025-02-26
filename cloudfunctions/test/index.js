'use strict'
exports.main = async (event) => {
  return {
    errCode: 0,
    errMsg: '成功',
    requestIp: event.headers['x-real-ip'],
    timeStamp: Date.now()
  }
}