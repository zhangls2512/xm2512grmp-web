<script setup>
document.title = '轩铭2512 - 统一账号 - 注册账号'
import { ref } from 'vue'
import validator from 'validator'
import request from '../../request'
import router from '../../router'
const email = ref('')
const emailcode = ref('')
const countdown = ref(60)
const buttondisabled = ref(false)
const buttontext = ref('获取验证码')
async function register() {
  if (!validator.isEmail(email.value)) {
    TinyModal.message({
      message: '请输入有效的邮箱',
      status: 'warning'
    })
    return
  }
  if (emailcode.value.length != 8) {
    TinyModal.message({
      message: '请输入有效的邮箱验证码',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/account/registerAccount',
    body: {
      email: email.value,
      emailCode: emailcode.value
    }
  })
  TinyModal.message({
    message: '注册成功',
    status: 'success'
  })
  router.push('/product/account/login')
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
        <div class="title">注册账号</div>
        <tiny-form>
          <tiny-form-item label="邮箱">
            <div class="sp">
              <tiny-input v-model="email" type="email" clearable autocomplete="email" placeholder="请输入邮箱"></tiny-input>
              <tiny-button :disabled="buttondisabled" clearable @click="getEmailCode">{{
                buttontext }}</tiny-button>
            </div>
          </tiny-form-item>
          <tiny-form-item label="验证码">
            <tiny-input v-model="code" clearable minlength="8" maxlength="8" autocomplete="one-time-code"
              placeholder="请输入验证码"></tiny-input>
          </tiny-form-item>
          <tiny-form-item>
            <tiny-button type='info' @click="register">注册</tiny-button>
          </tiny-form-item>
        </tiny-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.in-container {
  align-items: center;
  display: flex;
  justify-content: center;
}

.title {
  text-align: center;
}
</style>