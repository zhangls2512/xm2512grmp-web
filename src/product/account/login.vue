<script setup>
document.title = '轩铭2512 - 统一账号 - 登录'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import cookie from 'js-cookie'
import qrcode from 'qrcode'
import validator from 'validator'
import callfunction from '../../callfunction'
import request from '../../request'
import router from '../../router'
const route = useRoute()
const product = route.query.product
const type = ref('password')
const email = ref('')
const code = ref('')
const countdown = ref(60)
const buttondisabled = ref(false)
const buttontext = ref('获取验证码')
let ticket = ''
const qrcodeimg = ref('')
const ticketexpired = ref(true)
function base64url(buffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
function routePush() {
  const products = ['account', 'admin', 'resource', 'resourcecreator', 'ssl']
  if (products.includes(product)) {
    router.push('/product/' + product + '/panel')
  } else {
    router.push('/product/account/panel')
  }
}
async function getTicket() {
  ticketexpired.value = false
  const res = await request({
    apiPath: '/account/getTicket'
  })
  ticket = res.ticket
  qrcodeimg.value = await qrcode.toDataURL('https://www.zhangls2512.cn/product/account/login?ticket=' + res.ticket, {
    type: 'image/png'
  })
  setTimeout(() => {
    ticketexpired.value = true
  }, 60000)
}
if (cookie.get('accessToken')) {
  routePush()
} else {
  getTicket()
}
async function login() {
  if (!validator.isEmail(email.value)) {
    TinyModal.message({
      message: '请输入有效的邮箱',
      status: 'warning'
    })
    return
  }
  if (type.value == 'password' && code.value.length < 8) {
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
  const res = await callfunction({
    functionName: 'getAccessToken',
    data: {
      email: email.value,
      verifyType: type.value,
      verifyCode: code.value,
      userAgent: navigator.userAgent
    }
  })
  cookie.set('accessToken', res.accessToken, {
    expires: new Date(res.endDate),
    secure: true,
    sameSite: 'strict'
  })
  routePush()
  TinyModal.message({
    message: '登录成功',
    status: 'success'
  })
}
async function loginByPasskey() {
  const resa = await navigator.credentials.get({
    publicKey: {
      challenge: new TextEncoder().encode(String(Date.now()).slice(0, -5) + '00000'),
      timeout: 100000
    }
  })
  const resb = await callfunction({
    functionName: 'getAccessToken',
    data: {
      verifyType: 'passkey',
      credentialId: resa.id,
      authenticatorData: base64url(resa.response.authenticatorData),
      clientDataJSON: base64url(resa.response.clientDataJSON),
      signature: base64url(resa.response.signature),
      userAgent: navigator.userAgent
    }
  })
  cookie.set('accessToken', resb.accessToken, {
    expires: new Date(resb.endDate),
    secure: true,
    sameSite: 'strict'
  })
  routePush()
  TinyModal.message({
    message: '登录成功',
    status: 'success'
  })
}
async function loginByTicket() {
  const res = await callfunction({
    functionName: 'getAccessToken',
    data: {
      verifyType: 'ticket',
      verifyCode: ticket,
      userAgent: navigator.userAgent
    }
  })
  cookie.set('accessToken', res.accessToken, {
    expires: new Date(res.endDate),
    secure: true,
    sameSite: 'strict'
  })
  routePush()
  TinyModal.message({
    message: '登录成功',
    status: 'success'
  })
}
async function getEmailCode() {
  if (!validator.isEmail(email.value)) {
    TinyModal.message({
      message: '请输入有效的邮箱',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/account/sendEmailCode',
    body: {
      email: email.value
    }
  })
  TinyModal.message({
    message: '验证码已成功发送到邮箱：' + email.value,
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
</script>

<template>
  <div class="in-container">
    <div class="kuang">
      <div class="cz">
        <div class="title">登录</div>
        <div class="sp">
          <div class="cz">
            <tiny-alert v-if="ticketexpired == false" :closable="false"
              description="使用轩铭密码智能备忘录（App）、轩铭智能待办（App）、SSL 证书（微信小程序）扫描下方二维码"></tiny-alert>
            <img v-if="ticketexpired == false" class="qrcode" :src="qrcodeimg" loading="lazy"></img>
            <tiny-button v-if="ticketexpired == false" type="success" @click="loginByTicket">我已扫码并确认登录</tiny-button>
            <tiny-alert v-if="ticketexpired == true" type="error" :closable="false" description="二维码已过期"></tiny-alert>
            <tiny-button v-if="ticketexpired == true" type="info" @click="getTicket">重新获取</tiny-button>
          </div>
          <div class="cz">
            <tiny-form>
              <tiny-form-item label="方式">
                <tiny-radio-group v-model="type">
                  <tiny-radio label="password">密码</tiny-radio>
                  <tiny-radio label="mfa">MFA</tiny-radio>
                  <tiny-radio label="emailcode">邮箱验证码</tiny-radio>
                </tiny-radio-group>
              </tiny-form-item>
              <tiny-form-item label="邮箱">
                <div class="sp">
                  <tiny-input v-model="email" type="email" clearable autocomplete="email"
                    placeholder="请输入邮箱"></tiny-input>
                  <tiny-button v-if="type == 'emailcode'" :disabled="buttondisabled" clearable @click="getEmailCode">{{
                    buttontext }}</tiny-button>
                </div>
              </tiny-form-item>
              <tiny-form-item v-if="type == 'password'" label="密码">
                <tiny-input v-model="code" type="password" clearable show-password minlength="8" maxlength="32"
                  autocomplete="password" placeholder="请输入密码"></tiny-input>
              </tiny-form-item>
              <tiny-form-item v-if="type == 'mfa'" label="MFA">
                <tiny-input v-model="code" clearable minlength="6" maxlength="6" autocomplete="one-time-code"
                  placeholder="请输入 MFA"></tiny-input>
              </tiny-form-item>
              <tiny-form-item v-if="type == 'emailcode'" label="验证码">
                <tiny-input v-model="code" clearable minlength="8" maxlength="8" autocomplete="one-time-code"
                  placeholder="请输入验证码"></tiny-input>
              </tiny-form-item>
              <tiny-form-item>
                <div class="sp">
                  <tiny-button type="success" @click="login">登录</tiny-button>
                  <tiny-button type="info" @click="loginByPasskey">通行密钥登录</tiny-button>
                </div>
              </tiny-form-item>
            </tiny-form>
            <div class="sp">
              <router-link to="/product/account/register">注册账号</router-link>
              <tiny-divider direction="vertical"></tiny-divider>
              <router-link to="/product/account/unfreeze">解冻账号</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sp {
  justify-content: center;
}

.cz {
  align-items: center;
}

.title {
  text-align: center;
}
</style>