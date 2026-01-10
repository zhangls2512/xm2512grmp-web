'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const axios = require('axios')
  const jsonwebtoken = require('jsonwebtoken')
  const nodemailer = require('nodemailer')
  const app = tcb.init()
  const db = app.database()
  const nodemailertransport = nodemailer.createTransport({
    host: 'smtp.qq.com',
    secure: true,
    auth: {
      user: 'zhangls2512@vip.qq.com',
      pass: process.env.mailtoken
    }
  })
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
  if (typeof (requestdata.deviceToken) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的deviceToken参数'
    }
  }
  const validproducts = ['password']
  if (!validproducts.includes(requestdata.product)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的product参数'
    }
  }
  if (typeof (requestdata.invitationcode) != 'string') {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的invitationcode参数'
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
  const invitationcoderes = await db.collection('productuser').where({
    invitationCode: requestdata.invitationcode,
    product: requestdata.product
  }).get()
  if (invitationcoderes.data.length == 0) {
    return {
      errCode: 8000,
      errMsg: '邀请码不存在',
      errFix: '无修复建议'
    }
  }
  const invitationcodeinfo = invitationcoderes.data[0]
  const res = await app.callFunction({
    name: 'authCheck',
    data: {
      type: type,
      data: {
        code: code,
        requestIp: event.headers['x-real-ip']
      },
      permission: ['account', requestdata.product],
      service: [requestdata.product],
      apiName: 'product_useInvitationcode'
    }
  })
  if (res.result.errCode != 0) {
    return res.result
  } else {
    const uid = res.result.account._id
    if (uid == invitationcodeinfo.uid) {
      return {
        errCode: 8001,
        errMsg: '不可使用自己账号的邀请码',
        errFix: '无修复建议'
      }
    }
    const viplogres = await db.collection('viplog').where({
      product: requestdata.product,
      type: 'invitationcode',
      uid: uid
    }).count()
    if (viplogres.total > 0) {
      return {
        errCode: 8002,
        errMsg: '账号使用过邀请码',
        errFix: '无修复建议'
      }
    }
    let bundlename = ''
    let productwz = ''
    if (requestdata.product == 'password') {
      bundlename = 'com.zhangxm.aipasswordmemo'
      productwz = '密码智能备忘录'
    }
    const jwt = jsonwebtoken.sign({
      iss: '114416983',
      aud: 'https://oauth-login.cloud.huawei.com/oauth2/v3/token',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60
    }, process.env.keystart + process.env.keyend, {
      algorithm: 'PS256',
      header: {
        kid: 'ed7352354a6f4d7a9c27750d83e3fa39',
        typ: 'JWT',
        alg: 'PS256'
      }
    })
    const authorization = 'Bearer ' + jwt
    try {
      const getdevicestatusres = await axios.post('https://connect-api.cloud.huawei.com/api/rms/v1/deviceVerify/getDeviceStatus', {
        data: {
          mode: 1,
          deviceToken: requestdata.deviceToken,
          timestamp: Date.now()
        }
      }, {
        headers: {
          Authorization: authorization,
          bundleName: bundlename
        }
      })
      if (getdevicestatusres.data.errorCodes != 'OK' && getdevicestatusres.data.errorCodes != 'NotFound') {
        return {
          errCode: 8003,
          errMsg: '查询设备标记状态失败，原因：' + getdevicestatusres.data.errorCodes,
          errFix: '联系客服'
        }
      }
      if (getdevicestatusres.data.errorCodes == 'OK') {
        const devicestatus = getdevicestatusres.data
        if (devicestatus.bundleName && devicestatus.bundleName != bundlename) {
          return {
            errCode: 8004,
            errMsg: 'deviceToken来源应用与product不匹配',
            errFix: '无修复建议'
          }
        }
        if (devicestatus.bit0) {
          return {
            errCode: 8005,
            errMsg: '此设备已使用过邀请码',
            errFix: '无修复建议'
          }
        }
      }
      try {
        const setdevicestatusres = await axios.post('https://connect-api.cloud.huawei.com/api/rms/v1/deviceVerify/setDeviceStatus', {
          data: {
            mode: 1,
            deviceToken: requestdata.deviceToken,
            timestamp: Date.now(),
            bit0: true,
            bit1: false
          }
        }, {
          headers: {
            Authorization: authorization,
            bundleName: bundlename
          }
        })
        if (setdevicestatusres.data.errorCodes != 'OK') {
          return {
            errCode: 8006,
            errMsg: '更新设备标记状态失败，原因：' + setdevicestatusres.data.errorCodes,
            errFix: '联系客服'
          }
        }
        const userares = await db.collection('productuser').where({
          product: requestdata.product,
          uid: uid
        }).get()
        let vipenddatea = userares.data[0].vipEndDate
        if (vipenddatea != 0) {
          if (vipenddatea < Date.now()) {
            vipenddatea = Date.now() + 2592000000
          } else {
            vipenddatea = vipenddatea + 2592000000
          }
          await db.collection('productuser').where({
            product: requestdata.product,
            uid: uid
          }).update({
            vipEndDate: vipenddatea
          })
          await db.collection('viplog').add({
            date: Date.now(),
            duration: 30,
            info: requestdata.invitationcode,
            product: requestdata.product,
            type: 'invitationcode',
            uid: uid
          })
        }
        const userbres = await db.collection('productuser').where({
          product: requestdata.product,
          uid: invitationcodeinfo.uid
        }).get()
        let vipenddateb = userbres.data[0].vipEndDate
        if (vipenddateb != 0) {
          if (vipenddateb < Date.now()) {
            vipenddateb = Date.now() + 640800000
          } else {
            vipenddateb = vipenddateb + 640800000
          }
          await db.collection('productuser').where({
            product: requestdata.product,
            uid: invitationcodeinfo.uid
          }).update({
            vipEndDate: vipenddateb
          })
          await db.collection('viplog').add({
            date: Date.now(),
            duration: 7,
            info: requestdata.invitationcode,
            product: requestdata.product,
            type: 'invitenewuser',
            uid: invitationcodeinfo.uid
          })
          const accountres = await db.collection('account').where({
            _id: invitationcodeinfo.uid
          }).get()
          const email = accountres.data[0].email
          if (email) {
            await nodemailertransport.sendMail({
              from: 'zhangls2512@vip.qq.com',
              to: email,
              subject: '免费会员到账通知',
              text: '您的账号“' + productwz + '”产品成功邀请一位新用户，已获得7天免费会员。'
            })
          }
        }
        return {
          errCode: 0,
          errMsg: '成功'
        }
      } catch (err) {
        return {
          errCode: 8006,
          errMsg: '更新设备标记状态失败，原因：' + err.response.data.errorCodes,
          errFix: '联系客服'
        }
      }
    } catch (err) {
      return {
        errCode: 8003,
        errMsg: '查询设备标记状态失败，原因：' + err.response.data.errorCodes,
        errFix: '联系客服'
      }
    }
  }
}