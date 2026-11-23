'use strict'
exports.main = async (event) => {
  const tcb = require('@cloudbase/node-sdk')
  const axios = require('axios')
  const cbor2 = await import('cbor2')
  const crypto = require('crypto')
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
  const validplatforms = ['passkey', 'sslwxxcx', 'huaweiaipasswordmemoapp', 'huaweiaitodoapp']
  if (!validplatforms.includes(requestdata.platform)) {
    return {
      errCode: 1001,
      errMsg: '请求参数错误',
      errFix: '传递有效的platform参数'
    }
  }
  const passkeyresult = {
    credentialId: '',
    publicKey: ''
  }
  if (requestdata.platform == 'passkey') {
    if (typeof (requestdata.attestationObject) != 'string' || !requestdata.attestationObject) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的attestationObject参数'
      }
    }
    if (typeof (requestdata.clientDataJSON) != 'string' || !requestdata.clientDataJSON) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的clientDataJSON参数'
      }
    }
    let attestationobject
    try {
      attestationobject = cbor2.decode(Buffer.from(requestdata.attestationObject, 'base64url'))
    } catch {
      return {
        errCode: 8000,
        errMsg: 'attestationObject校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    if (!Buffer.isBuffer(attestationobject.authData)) {
      return {
        errCode: 8000,
        errMsg: 'authData校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    const authdata = attestationobject.authData
    if (authdata.length <= 56) {
      return {
        errCode: 8000,
        errMsg: 'authData校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    const rpidhash = authdata.subarray(0, 32).toString('hex')
    const validrpids = ['zhangls2512.cn', 'www.zhangls2512.cn']
    const validrpidhashs = validrpids.map(item => crypto.createHash('sha256').update(item).digest().toString('hex'))
    if (!validrpidhashs.includes(rpidhash)) {
      return {
        errCode: 8000,
        errMsg: 'rpIdHash校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    const flags = authdata[32].toString(2).padStart(8, '0').split('').reverse().join('')
    if (flags[0] != '1') {
      return {
        errCode: 8000,
        errMsg: 'flagsUP位校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    if (flags[1] != '0' || flags[5] != '0') {
      return {
        errCode: 8000,
        errMsg: 'flagsRFU位校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    if (flags[2] != '1') {
      return {
        errCode: 8000,
        errMsg: 'flagsUV位校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    if (flags[6] != '1') {
      return {
        errCode: 8000,
        errMsg: 'flagsAT位校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    if (flags[7] != '0') {
      return {
        errCode: 8000,
        errMsg: 'flagsED位校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    const signcount = authdata.subarray(33, 37).readUInt32BE()
    if (signcount > 1) {
      return {
        errCode: 8000,
        errMsg: 'signCount校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    const idlength = authdata.subarray(53, 55).readUInt16BE()
    if (idlength == 0) {
      return {
        errCode: 8000,
        errMsg: 'credentialId校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    const offset = 55 + idlength
    const credentialidbuffer = authdata.subarray(55, offset)
    if (credentialidbuffer.length != idlength) {
      return {
        errCode: 8000,
        errMsg: 'credentialId校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    passkeyresult.credentialId = credentialidbuffer.toString('base64url')
    const cosepublickeybuffer = authdata.subarray(offset, authdata.length)
    if (cosepublickeybuffer.length != 77) {
      return {
        errCode: 8000,
        errMsg: 'publicKey校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    let cosepublickey
    try {
      cosepublickey = cbor2.decode(cosepublickeybuffer)
    } catch {
      return {
        errCode: 8000,
        errMsg: 'publicKey校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    if (!cosepublickey instanceof Map) {
      return {
        errCode: 8000,
        errMsg: 'publicKey校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    if (cosepublickey.get(3) != -7) {
      return {
        errCode: 8000,
        errMsg: 'publicKey校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    if (cosepublickey.get(-1) != 1) {
      return {
        errCode: 8000,
        errMsg: 'publicKey校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    const publickeyx = cosepublickey.get(-2)
    if (!Buffer.isBuffer(publickeyx)) {
      return {
        errCode: 8000,
        errMsg: 'publicKey校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    if (publickeyx.length != 32) {
      return {
        errCode: 8000,
        errMsg: 'publicKey校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    const publickeyy = cosepublickey.get(-3)
    if (!Buffer.isBuffer(publickeyy)) {
      return {
        errCode: 8000,
        errMsg: 'publicKey校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    if (publickeyy.length != 32) {
      return {
        errCode: 8000,
        errMsg: 'publicKey校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    const jwk = {
      kty: 'EC',
      alg: 'ES256',
      crv: 'P-256',
      x: Buffer.from(publickeyx).toString('base64url'),
      y: Buffer.from(publickeyy).toString('base64url')
    }
    try {
      passkeyresult.publicKey = crypto.createPublicKey({
        key: jwk,
        format: 'jwk',
      }).export({
        type: 'spki',
        format: 'der'
      }).toString('base64url')
    } catch {
      return {
        errCode: 8000,
        errMsg: 'publicKey校验失败',
        errFix: '传递有效的attestationObject参数'
      }
    }
    let clientdatajson
    try {
      clientdatajson = JSON.parse(Buffer.from(requestdata.clientDataJSON, 'base64url').toString())
    } catch {
      return {
        errCode: 8000,
        errMsg: 'clientDataJSON校验失败',
        errFix: '传递有效的clientDataJSON参数'
      }
    }
    if (clientdatajson.type != 'webauthn.create') {
      return {
        errCode: 8000,
        errMsg: 'type校验失败',
        errFix: '传递有效的clientDataJSON参数'
      }
    }
    if (clientdatajson.challenge != Buffer.from(new TextEncoder().encode(String(Date.now()).slice(0, -5) + '00000')).toString('base64url')) {
      return {
        errCode: 8000,
        errMsg: 'challenge校验失败',
        errFix: '请重试'
      }
    }
    const derpublickey = ['0417c119785874762ccab8e46a2365a4b878e08c0f740c691a425f028961ca5d9eaa03c7775ba6bb70a8aec1c224b9b71cc19a01a42e37070ce40a78469949afcb', '04a2fb712934bfab9fd7772a184d699db7cd4f68af43f6d4ad832528ccc61d0312c063f41011fbd61367f8064d40e9df77253980bd28fb75ab43a558bcb781b6bd']
    if (clientdatajson.origin != 'https://www.zhangls2512.cn' && (!clientdatajson.origin.startsWith('ohos:app-id:') || !derpublickey.includes(Buffer.from(clientdatajson.origin.slice(12), 'base64').toString('hex')))) {
      return {
        errCode: 8000,
        errMsg: 'origin校验失败',
        errFix: '传递有效的clientDataJSON参数'
      }
    }
    if (clientdatajson.crossOrigin) {
      return {
        errCode: 8000,
        errMsg: 'crossOrigin校验失败',
        errFix: '传递有效的clientDataJSON参数'
      }
    }
  } else {
    if (typeof (requestdata.code) != 'string' || !requestdata.code) {
      return {
        errCode: 1001,
        errMsg: '请求参数错误',
        errFix: '传递有效的code参数'
      }
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
    if (platform == 'passkey') {
      const passkeyres = await db.collection('externalaccount').where({
        platform: 'passkey',
        uid: uid
      }).get()
      if (passkeyres.data.length >= 5) {
        return {
          errCode: 8002,
          errMsg: '暂仅支持最多5个passkey',
          errFix: '无修复建议'
        }
      }
      if (passkeyres.data.find(item => item.openid == passkeyresult.credentialId)) {
        return {
          errCode: 8003,
          errMsg: '已存在openid为credentialId的passkey',
          errFix: '使用新的通行密钥重试'
        }
      }
      await db.collection('externalaccount').add({
        openid: passkeyresult.credentialId,
        platform: 'passkey',
        publicKey: passkeyresult.publicKey,
        signCount: 0,
        uid: uid
      })
      return {
        errCode: 0,
        errMsg: '成功'
      }
    } else {
      if (requestdata.platform == 'huaweiaipasswordmemoapp' || requestdata.platform == 'huaweiaitodoapp') {
        platform = 'huawei'
      }
      const externalaccountres = await db.collection('externalaccount').where({
        platform: platform,
        uid: uid
      }).limit(1).get()
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
            errMsg: 'code校验失败，原因：' + wxres.data.errmsg,
            errFix: '无修复建议'
          }
        }
        const externalaccountres = await db.collection('externalaccount').where({
          openid: wxres.data.openid,
          platform: 'sslwxxcx'
        }).limit(1).get()
        if (externalaccountres.data.length > 0) {
          return {
            errCode: 8002,
            errMsg: '此外部平台账号已绑定其他账号',
            errFix: '无修复建议'
          }
        }
        await db.collection('externalaccount').add({
          openid: wxres.data.openid,
          platform: 'sslwxxcx',
          sessionKey: wxres.data.session_key,
          uid: uid
        })
        return {
          errCode: 0,
          errMsg: '成功'
        }
      }
      if (platform == 'huawei') {
        let clientid = ''
        let clientsecret = ''
        if (requestdata.platform == 'huaweiaipasswordmemoapp') {
          clientid = '6917568345502278703'
          clientsecret = process.env.huaweiaipasswordmemoappclientsecret
        }
        if (requestdata.platform == 'huaweiaitodoapp') {
          clientid = '6917571182378882466'
          clientsecret = process.env.huaweiaitodoappclientsecret
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
          }).limit(1).get()
          if (externalaccountres.data.length > 0) {
            return {
              errCode: 8002,
              errMsg: '此外部平台账号已绑定其他账号',
              errFix: '无修复建议'
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
            errMsg: 'code校验失败，原因：' + err.response.data.error_description,
            errFix: '无修复建议'
          }
        }
      }
    }
  }
}