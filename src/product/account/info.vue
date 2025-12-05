<script setup>
document.title = '轩铭2512 - 统一账号 - 账号管理 - 基本信息'
import { ref } from 'vue'
import cookie from 'js-cookie'
import moment from 'moment-timezone'
import qrcode from 'qrcode'
import validator from 'validator'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const accountinfo = ref({})
const passkey = ref([])
const externalaccount = ref([])
const type = ref('')
const code = ref('')
const dialog = ref(false)
const yzmtext = ref(false)
const yzmmfatext = ref(false)
const yzmmfammtext = ref(false)
const newemail = ref('')
const newemailcode = ref('')
const newpassworda = ref('')
const newpasswordb = ref('')
const duration = ref('')
let platform = ''
let rawid = ''
let publickey = ''
const updateemailbutton = ref(false)
const setmfabutton = ref(false)
const removemfabutton = ref(false)
const setpasswordbutton = ref(false)
const removepasswordbutton = ref(false)
const updatedurationbutton = ref(false)
const freezebutton = ref(false)
const refreshbutton = ref(false)
const deleteaccountbutton = ref(false)
const newpasskeybutton = ref(false)
const deletepasskeybutton = ref(false)
const unbindexternalaccountbutton = ref(false)
const countdown = ref(60)
const buttondisabled = ref(false)
const buttontext = ref('获取验证码')
const countdowna = ref(60)
const buttondisableda = ref(false)
const buttontexta = ref('获取验证码')
const qrcodedialog = ref(false)
const qrcodeimg = ref('')
const secret = ref('')
function base64url(buffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
async function getAccountInfo() {
  const res = await request({
    apiPath: '/account/getAccountInfo',
    body: {
      accessToken: accesstoken
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  Object.keys(res.data).forEach(item => {
    accountinfo.value[item] = res.data[item]
    accountinfo.value.endDate = moment(accountinfo.value.endDate).format('YYYY-MM-DD HH:mm:ss')
    duration.value = String(accountinfo.value.duration)
  })
}
async function getExternalAccount() {
  const res = await request({
    apiPath: '/account/getExternalAccount',
    body: {
      accessToken: accesstoken
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  const platformmap = {
    passkey: '通行密钥',
    sslwxxcx: 'SSL 证书（微信小程序）',
    huawei: '华为账号'
  }
  passkey.value = res.data.map(item => ({
    ...item,
    platformwz: platformmap[item.platform]
  })).filter(item => item.platformwz == '通行密钥')
  externalaccount.value = res.data.map(item => ({
    ...item,
    platformwz: platformmap[item.platform]
  })).filter(item => item.platformwz != '通行密钥')
}
async function get() {
  await getAccountInfo()
  getExternalAccount()
}
get()
function logOut() {
  cookie.remove('accessToken')
  cookie.remove('email')
  router.push('/product/account/login')
}
function copy(value) {
  navigator.clipboard.writeText(value)
  TinyModal.message({
    message: '内容已复制',
    status: 'success'
  })
}
function closeDialog() {
  type.value = ''
  code.value = ''
  dialog.value = false
  yzmtext.value = false
  yzmmfatext.value = false
  yzmmfammtext.value = false
  newemail.value = ''
  newemailcode.value = ''
  newpassworda.value = ''
  newpasswordb.value = ''
  duration.value = String(accountinfo.value.duration)
  updateemailbutton.value = false
  setmfabutton.value = false
  removemfabutton.value = false
  setpasswordbutton.value = false
  removepasswordbutton.value = false
  updatedurationbutton.value = false
  freezebutton.value = false
  refreshbutton.value = false
  deleteaccountbutton.value = false
  newpasskeybutton.value = false
  deletepasskeybutton.value = false
  unbindexternalaccountbutton.value = false
}
function closeQrcodeDialog() {
  qrcodedialog.value = false
  qrcodeimg.value = ''
  secret.value = ''
  getAccountInfo()
}
function updateEmailOpen() {
  dialog.value = true
  yzmtext.value = true
  updateemailbutton.value = true
  type.value = 'emailcode'
}
async function updateEmail() {
  if (!validator.isEmail(newemail.value)) {
    TinyModal.message({
      message: '请输入有效的新邮箱',
      status: 'warning'
    })
    return
  }
  if (code.value.length != 8) {
    TinyModal.message({
      message: '请输入有效的邮箱验证码',
      status: 'warning'
    })
    return
  }
  if (newemailcode.value.length != 8) {
    TinyModal.message({
      message: '请输入有效的新邮箱验证码',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/account/updateEmail',
    body: {
      email: accountinfo.value.email,
      verifyType: 'emailcode',
      verifyCode: code.value,
      newEmail: newemail.value,
      newEmailCode: newemailcode.value
    }
  })
  closeDialog()
  TinyModal.message({
    message: '修改成功',
    status: 'success'
  })
  getAccountInfo()
}
function setMfaOpen() {
  dialog.value = true
  yzmtext.value = true
  setmfabutton.value = true
  type.value = 'emailcode'
}
async function setMfa() {
  if (code.value.length != 8) {
    TinyModal.message({
      message: '请输入有效的邮箱验证码',
      status: 'warning'
    })
    return
  }
  const res = await request({
    apiPath: '/account/setMfa',
    body: {
      email: accountinfo.value.email,
      emailCode: code.value
    }
  })
  closeDialog()
  qrcodedialog.value = true
  const mfasecret = res.secret
  secret.value = mfasecret
  const accountname = 'xm2512:' + accountinfo.value.email
  const totpurl = `otpauth://totp/${encodeURIComponent(accountname)}?secret=` + mfasecret
  qrcodeimg.value = await qrcode.toDataURL(totpurl, {
    type: 'image/png'
  })
}
function removeMfaOpen() {
  dialog.value = true
  yzmmfatext.value = true
  removemfabutton.value = true
  type.value = 'mfa'
}
async function removeMfa() {
  if (type.value == 'mfa' && code.value.length != 6) {
    TinyModal.message({
      message: '请输入有效的 MFA',
      status: 'warning'
    })
    return
  }
  if (type.value == 'emailcode' && code.value.length != 8) {
    TinyModal.message({
      message: '请输入有效的邮箱验证码',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/account/removeMfa',
    body: {
      email: accountinfo.value.email,
      verifyType: type.value,
      verifyCode: code.value
    }
  })
  closeDialog()
  TinyModal.message({
    message: '关闭成功',
    status: 'success'
  })
  getAccountInfo()
}
function setPasswordOpen() {
  dialog.value = true
  yzmmfammtext.value = true
  setpasswordbutton.value = true
  type.value = 'password'
}
async function setPassword() {
  if (type.value == 'password' && (code.value.length < 8 || code.value.length > 30)) {
    TinyModal.message({
      message: '请输入有效的密码',
      status: 'warning'
    })
    return
  }
  if (type.value == 'mfa' && code.value.length != 6) {
    TinyModal.message({
      message: '请输入有效的 MFA',
      status: 'warning'
    })
    return
  }
  if (type.value == 'emailcode' && code.value.length != 8) {
    TinyModal.message({
      message: '请输入有效的邮箱验证码',
      status: 'warning'
    })
    return
  }
  if (newpassworda.value.length < 8 || newpassworda.value.length > 30) {
    TinyModal.message({
      message: '请输入有效的新密码',
      status: 'warning'
    })
    return
  }
  if (newpassworda.value != newpasswordb.value) {
    TinyModal.message({
      message: '两次输入的密码不一致',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/account/setPassword',
    body: {
      email: accountinfo.value.email,
      verifyType: type.value,
      verifyCode: code.value,
      newPassword: newpassworda.value
    }
  })
  closeDialog()
  TinyModal.message({
    message: '修改成功',
    status: 'success'
  })
  getAccountInfo()
}
function removePasswordOpen() {
  dialog.value = true
  yzmmfammtext.value = true
  removepasswordbutton.value = true
  type.value = 'password'
}
async function removePassword() {
  if (type.value == 'password' && (code.value.length < 8 || code.value.length > 30)) {
    TinyModal.message({
      message: '请输入有效的密码',
      status: 'warning'
    })
    return
  }
  if (type.value == 'mfa' && code.value.length != 6) {
    TinyModal.message({
      message: '请输入有效的 MFA',
      status: 'warning'
    })
    return
  }
  if (type.value == 'emailcode' && code.value.length != 8) {
    TinyModal.message({
      message: '请输入有效的邮箱验证码',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/account/setPassword',
    body: {
      email: accountinfo.value.email,
      verifyType: type.value,
      verifyCode: code.value,
      newPassword: ''
    }
  })
  closeDialog()
  TinyModal.message({
    message: '修改成功',
    status: 'success'
  })
  getAccountInfo()
}
function updateDurationOpen() {
  dialog.value = true
  yzmmfatext.value = true
  updatedurationbutton.value = true
  type.value = 'mfa'
}
async function updateDuration() {
  if (type.value == 'mfa' && code.value.length != 6) {
    TinyModal.message({
      message: '请输入有效的 MFA',
      status: 'warning'
    })
    return
  }
  if (type.value == 'emailcode' && code.value.length != 8) {
    TinyModal.message({
      message: '请输入有效的邮箱验证码',
      status: 'warning'
    })
    return
  }
  const durationvalue = Number(duration.value)
  if (!Number.isInteger(durationvalue) || durationvalue < 1 || durationvalue > 60) {
    TinyModal.message({
      message: '请输入有效的时长',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/account/updateDuration',
    body: {
      email: accountinfo.value.email,
      verifyType: type.value,
      verifyCode: code.value,
      duration: durationvalue
    }
  })
  closeDialog()
  TinyModal.message({
    message: '设置成功，将在下次登录账号后生效',
    status: 'success'
  })
  getAccountInfo()
}
function freezeOpen() {
  dialog.value = true
  yzmmfatext.value = true
  freezebutton.value = true
  type.value = 'mfa'
}
async function freeze() {
  if (type.value == 'mfa' && code.value.length != 6) {
    TinyModal.message({
      message: '请输入有效的 MFA',
      status: 'warning'
    })
    return
  }
  if (type.value == 'emailcode' && code.value.length != 8) {
    TinyModal.message({
      message: '请输入有效的邮箱验证码',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/account/freezeAccessToken',
    body: {
      email: accountinfo.value.email,
      verifyType: type.value,
      verifyCode: code.value
    }
  })
  closeDialog()
  TinyModal.message({
    message: '冻结成功',
    status: 'success'
  })
  logOut()
}
function refreshOpen() {
  dialog.value = true
  yzmmfatext.value = true
  refreshbutton.value = true
  type.value = 'mfa'
}
async function refresh() {
  if (type.value == 'mfa' && code.value.length != 6) {
    TinyModal.message({
      message: '请输入有效的 MFA',
      status: 'warning'
    })
    return
  }
  if (type.value == 'emailcode' && code.value.length != 8) {
    TinyModal.message({
      message: '请输入有效的邮箱验证码',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/account/refreshAccessToken',
    body: {
      email: accountinfo.value.email,
      verifyType: type.value,
      verifyCode: code.value
    }
  })
  closeDialog()
  TinyModal.message({
    message: '强制登出成功',
    status: 'success'
  })
  logOut()
}
function deleteAccountOpen() {
  dialog.value = true
  yzmmfatext.value = true
  deleteaccountbutton.value = true
  type.value = 'mfa'
}
async function deleteAccount() {
  if (type.value == 'mfa' && code.value.length != 6) {
    TinyModal.message({
      message: '请输入有效的 MFA',
      status: 'warning'
    })
    return
  }
  if (type.value == 'emailcode' && code.value.length != 8) {
    TinyModal.message({
      message: '请输入有效的邮箱验证码',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/account/deleteAccount',
    body: {
      email: accountinfo.value.email,
      verifyType: type.value,
      verifyCode: code.value
    }
  })
  closeDialog()
  TinyModal.message({
    message: '注销成功',
    status: 'success'
  })
  logOut()
}
async function newPasskeyOpen() {
  const res = await navigator.credentials.create({
    publicKey: {
      challenge: new TextEncoder().encode(String(Date.now()).slice(0, -5) + '00000'),
      pubKeyCredParams: [{
        type: 'public-key',
        alg: -7
      }],
      rp: {
        name: 'xm2512'
      },
      user: {
        id: new TextEncoder().encode(accountinfo.value.uid),
        name: accountinfo.value.email,
        displayName: accountinfo.value.email
      }
    }
  })
  rawid = base64url(res.rawId)
  publickey = base64url(res.response.getPublicKey())
  dialog.value = true
  yzmmfatext.value = true
  newpasskeybutton.value = true
  type.value = 'mfa'
}
async function newPasskey() {
  if (type.value == 'mfa' && code.value.length != 6) {
    TinyModal.message({
      message: '请输入有效的 MFA',
      status: 'warning'
    })
    return
  }
  if (type.value == 'emailcode' && code.value.length != 8) {
    TinyModal.message({
      message: '请输入有效的邮箱验证码',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/account/bindExternalAccount',
    body: {
      email: accountinfo.value.email,
      verifyType: type.value,
      verifyCode: code.value,
      platform: 'passkey',
      rawId: rawid,
      publicKey: publickey
    }
  })
  closeDialog()
  TinyModal.message({
    message: '新增成功',
    status: 'success'
  })
  getExternalAccount()
}
function deletePasskeyOpen(openid) {
  dialog.value = true
  yzmmfatext.value = true
  deletepasskeybutton.value = true
  type.value = 'mfa'
  rawid = openid
}
async function deletePasskey() {
  if (type.value == 'mfa' && code.value.length != 6) {
    TinyModal.message({
      message: '请输入有效的 MFA',
      status: 'warning'
    })
    return
  }
  if (type.value == 'emailcode' && code.value.length != 8) {
    TinyModal.message({
      message: '请输入有效的邮箱验证码',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/account/unbindExternalAccount',
    body: {
      email: accountinfo.value.email,
      verifyType: type.value,
      verifyCode: code.value,
      platform: 'passkey',
      openid: rawid
    }
  })
  closeDialog()
  TinyModal.message({
    message: '删除成功',
    status: 'success'
  })
  getExternalAccount()
}
function unbindExternalAccountOpen(platforminput) {
  dialog.value = true
  yzmmfatext.value = true
  unbindexternalaccountbutton.value = true
  type.value = 'mfa'
  platform = platforminput
}
async function unbindExternalAccount() {
  if (type.value == 'mfa' && code.value.length != 6) {
    TinyModal.message({
      message: '请输入有效的 MFA',
      status: 'warning'
    })
    return
  }
  if (type.value == 'emailcode' && code.value.length != 8) {
    TinyModal.message({
      message: '请输入有效的邮箱验证码',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/account/unbindExternalAccount',
    body: {
      email: accountinfo.value.email,
      verifyType: type.value,
      verifyCode: code.value,
      platform: platform
    }
  })
  closeDialog()
  TinyModal.message({
    message: '解绑成功',
    status: 'success'
  })
  getExternalAccount()
}
async function getEmailCode() {
  await request({
    apiPath: '/account/sendEmailCode',
    body: {
      email: accountinfo.value.email
    }
  })
  TinyModal.message({
    message: '验证码已成功发送到邮箱：' + accountinfo.value.email,
    status: 'success'
  })
  buttondisabled.value = true
  buttontext.value = '重新发送(' + countdown.value + 's)'
  const interval = setInterval(() => {
    countdown.value--
    if (countdown.value > 0) {
      buttontext.value = '重新发送(' + countdown.value + 's)'
    } else {
      clearInterval(interval)
      countdown.value = 60
      buttondisabled.value = false
      buttontext.value = '获取验证码'
    }
  }, 1000)
}
async function getEmailCodea() {
  await request({
    apiPath: '/account/sendEmailCode',
    body: {
      email: newemail.value
    }
  })
  TinyModal.message({
    message: '验证码已成功发送到邮箱：' + newemail.value,
    status: 'success'
  })
  buttondisableda.value = true
  buttontexta.value = '重新发送(' + countdowna.value + 's)'
  const interval = setInterval(() => {
    countdowna.value--
    if (countdowna.value > 0) {
      buttontexta.value = '重新发送(' + countdowna.value + 's)'
    } else {
      clearInterval(interval)
      countdowna.value = 60
      buttondisableda.value = false
      buttontexta.value = '获取验证码'
    }
  }, 1000)
}
</script>

<template>
  <div>
    <div class="cz">
      <div class="sp">
        <div class="bold-text">UID</div>
        <div>{{ accountinfo.uid }}</div>
        <tiny-button type="info" @click="copy(accountinfo.uid)">复制</tiny-button>
      </div>
      <div class="sp">
        <div class="bold-text">邮箱</div>
        <div>{{ accountinfo.email }}</div>
        <tiny-button type="info" @click="updateEmailOpen">修改</tiny-button>
      </div>
      <div class="sp">
        <div class="bold-text">MFA</div>
        <div v-if="accountinfo.mfa == false">未设置</div>
        <div v-if="accountinfo.mfa == true">已设置</div>
        <tiny-button v-if="accountinfo.mfa == false" type="success" @click="setMfaOpen">开启</tiny-button>
        <tiny-button v-if="accountinfo.mfa == true" type="danger" @click="removeMfaOpen">关闭</tiny-button>
      </div>
      <tiny-alert v-if="accountinfo.password == true" :closable="false"
        description="为了保证账号安全，建议设置强密码、定期修改密码，或关闭密码，仅允许将短期有效、更安全的邮箱验证码、MFA 作为允许的登录验证方式。"></tiny-alert>
      <div class="sp">
        <div class="bold-text">密码</div>
        <div v-if="accountinfo.password == false">未设置</div>
        <div v-if="accountinfo.password == true">已设置</div>
        <tiny-button v-if="accountinfo.password == false" type="success" @click="setPasswordOpen">开启</tiny-button>
        <tiny-button v-if="accountinfo.password == true" type="info" @click="setPasswordOpen">修改</tiny-button>
        <tiny-button v-if="accountinfo.password == true" type="danger" @click="removePasswordOpen">关闭</tiny-button>
      </div>
      <div class="sp">
        <div class="bold-text">登录保持时长</div>
        <div>{{ accountinfo.duration }} 天</div>
        <tiny-button type="info" @click="updateDurationOpen">修改</tiny-button>
      </div>
      <tiny-alert :closable="false" description="系统会在登录账号时自动延长登录到期时间。如果在登录到期时间前未登录账号，为了保证账号安全，将需要退出重新登录。"></tiny-alert>
      <div class="sp">
        <div class="bold-text">登录到期时间</div>
        <div>{{ accountinfo.endDate }}</div>
      </div>
      <tiny-alert :closable="false"
        description="系统会在登录账号时使用邮箱 zhangls2512@vip.qq.com 作为发件人发送登录提醒邮件到邮箱。当发现登录行为可疑时，可使用下方冻结账号、强制登出功能，防止账号被他人非法使用。"></tiny-alert>
      <div class="sp">
        <tiny-button type="info" @click="freezeOpen">冻结账号</tiny-button>
        <tiny-popconfirm title="提示" message="执行此操作后所有产品将退出登录，确定执行？" type="warning" trigger="hover"
          @confirm="refreshOpen">
          <template #reference>
            <tiny-button type="danger">强制登出</tiny-button>
          </template>
        </tiny-popconfirm>
        <tiny-divider direction="vertical"></tiny-divider>
        <tiny-popconfirm title="提示" message="注销成功后无法恢复，确定注销？" type="warning" trigger="hover"
          @confirm="deleteAccountOpen">
          <template #reference>
            <tiny-button type="danger">注销账号</tiny-button>
          </template>
        </tiny-popconfirm>
      </div>
      <div class="large-bold-text">通行密钥</div>
      <tiny-alert :closable="false"
        description="通行密钥是一种安全、快捷的无密码验证方式。添加后，你可以使用设备屏幕解锁方式（PIN、指纹、面容等）直接登录账号，无需使用邮箱验证码、MFA 、密码验证。"></tiny-alert>
      <div v-if="passkey.length < 5"><tiny-button type="success" @click="newPasskeyOpen">新增</tiny-button></div>
      <tiny-grid :data="passkey">
        <tiny-grid-column field="openid" title="ID" align="center"></tiny-grid-column>
        <tiny-grid-column field="publicKey" title="公钥" align="center"></tiny-grid-column>
        <tiny-grid-column field="signCount" title="使用次数" align="center"></tiny-grid-column>
        <tiny-grid-column title="操作" align="center">
          <template #default="{ row }">
            <tiny-popconfirm title="提示" message="删除成功后无法恢复，确定删除？" type="warning" trigger="hover"
              @confirm="deletePasskeyOpen(row.openid)">
              <template #reference>
                <tiny-button type="danger">删除</tiny-button>
              </template>
            </tiny-popconfirm>
          </template>
        </tiny-grid-column>
      </tiny-grid>
      <div class="large-bold-text">外部账号</div>
      <tiny-alert :closable="false" description="你可以使用绑定的外部账号直接登录账号，无需使用邮箱验证码、MFA 、密码验证。"></tiny-alert>
      <tiny-grid :data="externalaccount">
        <tiny-grid-column field="platformwz" title="外部平台名称" align="center"></tiny-grid-column>
        <tiny-grid-column field="openid" title="外部账号 ID" align="center"></tiny-grid-column>
        <tiny-grid-column title="操作" align="center">
          <template #default="{ row }">
            <tiny-popconfirm title="提示" message="解绑成功后需重新绑定才可直接登录账号，确定解绑？" type="warning" trigger="hover"
              @confirm="unbindExternalAccountOpen(row.platform)">
              <template #reference>
                <tiny-button type="danger">解绑</tiny-button>
              </template>
            </tiny-popconfirm>
          </template>
        </tiny-grid-column>
      </tiny-grid>
    </div>
    <tiny-dialog-box class="dialog" :visible="dialog" title="身份验证" @close="closeDialog">
      <div class="dialog-cz">
        <tiny-alert v-if="yzmtext == true" type="warning" :closable="false"
          description="为了保证账号安全，执行本操作需要进行邮箱验证码验证"></tiny-alert>
        <tiny-alert v-if="yzmmfatext == true" type="warning" :closable="false"
          description="为了保证账号安全，执行本操作需要进行 MFA / 邮箱验证码验证"></tiny-alert>
        <tiny-alert v-if="yzmmfammtext == true" type="warning" :closable="false"
          description="为了保证账号安全，执行本操作需要进行密码 / MFA / 邮箱验证码验证"></tiny-alert>
        <div class="sp">
          <div v-if="yzmmfatext == true || yzmmfammtext == true">验证方式</div>
          <tiny-radio-group v-if="yzmmfatext == true" v-model="type">
            <tiny-radio label="mfa">MFA</tiny-radio>
            <tiny-radio label="emailcode">邮箱验证码</tiny-radio>
          </tiny-radio-group>
          <tiny-radio-group v-if="yzmmfammtext == true" v-model="type">
            <tiny-radio label="password">密码</tiny-radio>
            <tiny-radio label="mfa">MFA</tiny-radio>
            <tiny-radio label="emailcode">邮箱验证码</tiny-radio>
          </tiny-radio-group>
        </div>
        <div v-if="type == 'emailcode'" class="sp">
          <tiny-input v-model="code" clearable minlength="8" maxlength="8" autocomplete="one-time-code"
            placeholder="请输入验证码"></tiny-input>
          <tiny-button :disabled="buttondisabled" @click="getEmailCode">{{ buttontext }}</tiny-button>
        </div>
        <div v-if="updateemailbutton == true" class="sp">
          <tiny-input v-model="newemail" type="email" clearable autocomplete="email" placeholder="请输入新邮箱"></tiny-input>
          <tiny-button :disabled="buttondisableda" @click="getEmailCodea">{{ buttontexta }}</tiny-button>
        </div>
        <tiny-input v-if="updateemailbutton == true" v-model="newemailcode" clearable minlength="8" maxlength="8"
          autocomplete="one-time-code" placeholder="请输入新邮箱验证码"></tiny-input>
        <tiny-input v-if="type == 'mfa'" v-model="code" clearable minlength="6" maxlength="6"
          autocomplete="one-time-code" placeholder="请输入 MFA"></tiny-input>
        <tiny-input v-if="type == 'password'" v-model="code" type="password" clearable minlength="8" maxlength="30"
          autocomplete="current-password" placeholder="请输入密码"></tiny-input>
        <tiny-input v-if="setpasswordbutton == true" v-model="newpassworda" type="password" clearable minlength="8"
          maxlength="30" autocomplete="new-password" placeholder="请输入新密码（长度 8 - 30 位）"></tiny-input>
        <tiny-input v-if="setpasswordbutton == true" v-model="newpasswordb" type="password" clearable minlength="8"
          maxlength="30" autocomplete="new-password" placeholder="请再次输入新密码"></tiny-input>
        <tiny-input v-if="updatedurationbutton == true" v-model="duration" clearable minlength="1" maxlength="2"
          placeholder="范围：1 - 60，单位：天"></tiny-input>
      </div>
      <template #footer>
        <tiny-button v-if="updateemailbutton == true" type="info" @click="updateEmail">修改</tiny-button>
        <tiny-button v-if="setmfabutton == true" type="success" @click="setMfa">开启</tiny-button>
        <tiny-button v-if="removemfabutton == true" type="danger" @click="removeMfa">关闭</tiny-button>
        <tiny-button v-if="setpasswordbutton == true" type="info" @click="setPassword">设置</tiny-button>
        <tiny-button v-if="removepasswordbutton == true" type="danger" @click="removePassword">关闭</tiny-button>
        <tiny-button v-if="updatedurationbutton == true" type="info" @click="updateDuration">修改</tiny-button>
        <tiny-button v-if="freezebutton == true" type="info" @click="freeze">冻结账号</tiny-button>
        <tiny-button v-if="refreshbutton == true" type="danger" @click="refresh">强制登出</tiny-button>
        <tiny-button v-if="deleteaccountbutton == true" type="danger" @click="deleteAccount">注销账号</tiny-button>
        <tiny-button v-if="newpasskeybutton == true" type="success" @click="newPasskey">新增</tiny-button>
        <tiny-button v-if="deletepasskeybutton == true" type="danger" @click="deletePasskey">删除</tiny-button>
        <tiny-button v-if="unbindexternalaccountbutton == true" type="danger"
          @click="unbindExternalAccount">解绑</tiny-button>
      </template>
    </tiny-dialog-box>
    <tiny-dialog-box class="dialog" :visible="qrcodedialog" title="保存 MFA（以下两种方式二选一）" @close="closeQrcodeDialog">
      <div class="dialog-cz">
        <div>1. 使用身份验证应用程序（如阿里云、腾讯云助手微信小程序、Google Authenticator）扫描下方二维码添加 MFA 。</div>
        <img class="qrcode" :src="qrcodeimg" loading="lazy"></img>
        <div>2. 使用身份验证应用程序（如阿里云、腾讯云助手微信小程序、Google Authenticator）手动输入下方密钥添加 MFA 。</div>
        <div class="sp">
          <div>{{ secret }} </div>
          <tiny-button type="info" @click="copy(secret)">复制</tiny-button>
        </div>
      </div>
      <template #footer>
        <tiny-button type="danger" @click="closeQrcodeDialog">关闭</tiny-button>
      </template>
    </tiny-dialog-box>
  </div>
</template>

<style scoped>
.qrcode {
  width: 200px;
}
</style>