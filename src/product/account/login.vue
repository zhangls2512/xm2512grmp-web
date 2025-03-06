<script setup>
document.title = '轩铭2512 - 统一账号 - 登录'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import cookie from 'js-cookie'
import validator from 'validator'
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
function routePush() {
  const products = ['account', 'admin', 'ssl']
  if (products.includes(product)) {
    router.push('/product/' + product + '/panel')
  } else {
    router.push('/product/account/panel')
  }
}
if (cookie.get('accessToken')) {
  routePush()
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
  const res = await request({
    apiPath: '/account/getAccessToken',
    body: {
      email: email.value,
      verifyType: type.value,
      verifyCode: code.value
    }
  })
  const expires = new Date(res.endDate)
  cookie.set('accessToken', res.accessToken, { expires: expires, secure: true, sameSite: 'strict' })
  cookie.set('email', email.value, { expires: expires, secure: true, sameSite: 'strict' })
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
              <tiny-input v-model="email" type="email" clearable autocomplete="email" placeholder="请输入邮箱"></tiny-input>
              <tiny-button v-if="type == 'emailcode'" :disabled="buttondisabled" clearable @click="getEmailCode">{{
                buttontext }}</tiny-button>
            </div>
          </tiny-form-item>
          <tiny-form-item v-if="type == 'password'" label="密码">
            <tiny-input v-model="code" type="password" clearable minlength="8" maxlength="30" autocomplete="password"
              placeholder="请输入密码"></tiny-input>
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
            <tiny-button type='info' @click="login">登录</tiny-button>
          </tiny-form-item>
        </tiny-form>
        <div class="sp">
          <router-link to="/product/account/register">注册账号</router-link>
          <router-link to="/product/account/unfreeze">解冻账号</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sp {
  justify-content: center;
}

.title {
  text-align: center;
}
</style>