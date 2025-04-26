'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const axios = require('axios')
  const validator = require('validator')
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
    if (typeof (requestdata.email) != 'string' || !validator.isEmail(requestdata.email)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的email参数'
      }
    }
    const validtypes = ['emailcode', 'mfa']
    if (!validtypes.includes(requestdata.verifyType)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的verifyType参数'
      }
    }
    if (typeof (requestdata.verifyCode) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的verifyCode参数'
      }
    }
    if (requestdata.verifyType == 'emailcode' && requestdata.verifyCode.length != 8) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的verifyCode参数'
      }
    }
    if (requestdata.verifyType == 'mfa' && requestdata.verifyCode.length != 6) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的verifyCode参数'
      }
    }
    const validplatforms = ['sslwxxcx', 'huaweiaipasswordmemoapp']
    if (!validplatforms.includes(requestdata.platform)) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的platform参数'
      }
    }
    if (typeof (requestdata.code) != 'string') {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的code参数'
      }
    }
    const res = await app.callFunction({
      name: 'authCheck',
      data: {
        type: requestdata.verifyType,
        data: {
          email: requestdata.email,
          code: requestdata.verifyCode
        },
        permission: []
      }
    })
    if (res.result.errCode != 0) {
      return res.result
    } else {
      const uid = res.result.account._id
      let platform = requestdata.platform
      if (requestdata.platform == 'huaweiaipasswordmemoapp') {
        platform = 'huawei'
      }
      const externalaccountres = await db.collection('externalaccount').where({
        platform: platform,
        uid: uid
      }).get()
      if (externalaccountres.data.length > 0) {
        return {
          errCode: 8000,
          errMsg: '账号已绑定此外部平台',
          errFix: '无修复建议'
        }
      }
      if (requestdata.platform == 'sslwxxcx') {
        const wxres = await axios.get('https://api.weixin.qq.com/sns/jscode2session?appid=wxd46f84216a1a856e&secret=' + process.env.sslappsecret + '&js_code=' + requestdata.code + '&grant_type=authorization_code')
        if (wxres.data.errcode) {
          return {
            errCode: 8001,
            errMsg: 'code校验错误，错误信息：' + wxres.data.errmsg,
            errFix: '传递有效的code参数'
          }
        }
        const externalaccountres = await db.collection('externalaccount').where({
          openid: wxres.data.openid,
          platform: 'sslwxxcx'
        }).get()
        if (externalaccountres.data.length > 0) {
          return {
            errCode: 8002,
            errMsg: '此外部平台账号已绑定其他账号',
            errFix: '解除此外部平台账号与其他账号的绑定'
          }
        }
        await db.collection('externalaccount').add({
          openid: wxres.data.openid,
          platform: 'sslwxxcx',
          uid: uid
        })
        return {
          errCode: 0,
          errMsg: '成功'
        }
      }
      if (requestdata.platform == 'huaweiaipasswordmemoapp') {
        let clientid = ''
        let clientsecret = ''
        if (requestdata.platform == 'huaweiaipasswordmemoapp') {
          clientid = '6917568345502278703'
          clientsecret = process.env.huaweiaipasswordmemoappclientsecret
        }
        try {
          const huaweitokenres = await axios.post('https://oauth-login.cloud.huawei.com/oauth2/v3/token', null, {
            params: {
              grant_type: 'authorization_code',
              client_id: clientid,
              client_secret: clientsecret,
              code: requestdata.code
            }
          })
          const huaweitokeninfores = await axios.post('https://oauth-api.cloud.huawei.com/rest.php?nsp_fmt=JSON&nsp_svc=huawei.oauth2.user.getTokenInfo', null, {
            params: {
              access_token: huaweitokenres.data.access_token
            }
          })
          await axios.post('https://oauth-login.cloud.huawei.com/oauth2/v3/revoke', null, {
            params: {
              token: huaweitokenres.data.access_token
            }
          })
          const externalaccountres = await db.collection('externalaccount').where({
            openid: huaweitokeninfores.data.union_id,
            platform: 'huawei'
          }).get()
          if (externalaccountres.data.length > 0) {
            return {
              errCode: 8002,
              errMsg: '此外部平台账号已绑定其他账号',
              errFix: '解除此外部平台账号与其他账号的绑定'
            }
          }
          await db.collection('externalaccount').add({
            openid: huaweitokeninfores.data.union_id,
            platform: 'huawei',
            uid: uid
          })
          return {
            errCode: 0,
            errMsg: '成功'
          }
        } catch (err) {
          return {
            errCode: 8001,
            errMsg: 'code校验错误，错误信息：' + err.response.data.error_description,
            errFix: '传递有效的code参数'
          }
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