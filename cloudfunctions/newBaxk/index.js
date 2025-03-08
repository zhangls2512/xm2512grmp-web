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
  try {
    const requestdata = JSON.parse(event.body)
    if (typeof (requestdata.accessToken) != 'string' && typeof (requestdata.accessKey) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的accessToken或accessKey参数'
      }
    }
    const validmaintypes = ['0', '1', '2', '3', '4']
    if (!validmaintypes.includes(requestdata.mainType)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的mainType参数'
      }
    }
    if (typeof (requestdata.desc) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的desc参数'
      }
    }
    if (requestdata.mainType != '1' && typeof (requestdata.productNumber) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的productNumber参数'
      }
    }
    if (requestdata.mainType == '1' && typeof (requestdata.productName) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的productName参数'
      }
    }
    if (requestdata.mainType != '3' && typeof (requestdata.specificType) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的specificType参数'
      }
    }
    const avalidspecifictypes = ['0', '1']
    const bvalidspecifictypes = ['0', '1', '2', '3']
    const cvalidspecifictypes = ['0', '1', '2', '3', '4', '5', '6']
    const evalidspecifictypes = ['0', '1', '2', '3', '4']
    if (requestdata.mainType == '0' && !avalidspecifictypes.includes(requestdata.specificType)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的specificType参数'
      }
    }
    if (requestdata.mainType == '1' && !bvalidspecifictypes.includes(requestdata.specificType)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的specificType参数'
      }
    }
    if (requestdata.mainType == '2' && !cvalidspecifictypes.includes(requestdata.specificType)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的specificType参数'
      }
    }
    if (requestdata.mainType == '4' && !evalidspecifictypes.includes(requestdata.specificType)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的specificType参数'
      }
    }
    let houzhui = ''
    if (requestdata.mainType == '0') {
      if (requestdata.specificType == '0') {
        houzhui = 'C'
      }
      if (requestdata.specificType == '1') {
        houzhui = 'M'
      }
    }
    if (requestdata.mainType == '1') {
      if (requestdata.specificType == '0') {
        houzhui = 'W'
      }
      if (requestdata.specificType == '1') {
        houzhui = 'WX'
      }
      if (requestdata.specificType == '2') {
        houzhui = 'HA'
      }
      if (requestdata.specificType == '3') {
        houzhui = 'HY'
      }
    }
    if (requestdata.mainType == '2') {
      if (requestdata.specificType == '0') {
        houzhui = 'L'
      }
      if (requestdata.specificType == '1') {
        houzhui = 'Q'
      }
      if (requestdata.specificType == '2') {
        houzhui = 'Z'
      }
      if (requestdata.specificType == '3') {
        houzhui = 'P'
      }
      if (requestdata.specificType == '4') {
        houzhui = 'W'
      }
      if (requestdata.specificType == '5') {
        houzhui = 'S'
      }
      if (requestdata.specificType == '6') {
        houzhui = 'Y'
      }
    }
    if (requestdata.mainType == '4') {
      if (requestdata.specificType == '0') {
        houzhui = 'G'
      }
      if (requestdata.specificType == '1') {
        houzhui = 'P'
      }
      if (requestdata.specificType == '2') {
        houzhui = 'J'
      }
      if (requestdata.specificType == '3') {
        houzhui = 'D'
      }
      if (requestdata.specificType == '4') {
        houzhui = 'S'
      }
    }
    let type = ''
    let code = ''
    if (requestdata.accessToken) {
      type = 'accesstoken'
      code = requestdata.accessToken
    } else {
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
        permission: ['account', 'admin'],
        service: ['admin'],
        apiName: 'admin_newBaxk'
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      if (requestdata.mainType == '0') {
        const countres = await db.collection('baxk').where({
          mainType: '0',
          productNumber: requestdata.productNumber
        }).count()
        await db.collection('baxk').add({
          baxkNumber: '轩铭2512许' + requestdata.productNumber + '号-' + (countres.total + 1) + houzhui,
          date: Date.now(),
          desc: requestdata.desc,
          mainType: '0',
          productNumber: requestdata.productNumber,
          specificType: requestdata.specificType
        })
        return {
          errCode: 0,
          errMsg: '成功'
        }
      }
      if (requestdata.mainType == '1') {
        const countres = await db.collection('baxk').where({
          mainType: '1'
        }).count()
        await db.collection('baxk').add({
          baxkNumber: '轩铭2512品备' + (countres.total + 1) + '号-' + houzhui,
          date: Date.now(),
          desc: requestdata.desc,
          mainType: '1',
          productName: requestdata.productName,
          productNumber: String(countres.total + 1),
          specificType: requestdata.specificType
        })
        return {
          errCode: 0,
          errMsg: '成功'
        }
      }
      if (requestdata.mainType == '2') {
        const countres = await db.collection('baxk').where({
          mainType: '2',
          productNumber: requestdata.productNumber
        }).count()
        await db.collection('baxk').add({
          baxkNumber: '轩铭2512适备' + requestdata.productNumber + '号-' + (countres.total + 1) + houzhui,
          date: Date.now(),
          desc: requestdata.desc,
          mainType: '2',
          productNumber: requestdata.productNumber,
          specificType: requestdata.specificType
        })
        return {
          errCode: 0,
          errMsg: '成功'
        }
      }
      if (requestdata.mainType == '3') {
        const countres = await db.collection('baxk').where({
          mainType: '3',
          productNumber: requestdata.productNumber
        }).count()
        await db.collection('baxk').add({
          baxkNumber: '轩铭2512私安备' + requestdata.productNumber + '号-' + (countres.total + 1),
          date: Date.now(),
          desc: requestdata.desc,
          mainType: '3',
          productNumber: requestdata.productNumber,
          specificType: '0'
        })
        return {
          errCode: 0,
          errMsg: '成功'
        }
      }
      if (requestdata.mainType == '4') {
        const countres = await db.collection('baxk').where({
          mainType: '4',
          productNumber: requestdata.productNumber
        }).count()
        await db.collection('baxk').add({
          baxkNumber: '轩铭2512算备' + requestdata.productNumber + '号-' + (countres.total + 1) + houzhui,
          date: Date.now(),
          desc: requestdata.desc,
          mainType: '4',
          productNumber: requestdata.productNumber,
          specificType: requestdata.specificType
        })
        return {
          errCode: 0,
          errMsg: '成功'
        }
      }
    }
  } catch {
    return {
      errCode: 5000,
      errMsg: '内部错误',
      errFix: '联系客服'
    }
  }
}