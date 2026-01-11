<script setup>
document.title = '轩铭2512 - 统一账号 - 解冻账号'
import { ref } from 'vue'
import validator from 'validator'
import request from '../../request'
import router from '../../router'
const type = ref('mfa')
const email = ref('')
const code = ref('')
const countdown = ref(60)
const buttondisabled = ref(false)
const buttontext = ref('获取验证码')
async function unfreeze() {
  if (!validator.isEmail(email.value)) {
    TinyModal.message({
      message: '请输入有效的邮箱',
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
    apiPath: '/account/refreshAccessToken',
    body: {
      email: email.value,
      verifyType: type.value,
      verifyCode: code.value,
      unfreeze: true
    }
  })
  router.push('/product/account/login')
  TinyModal.message({
    message: '解冻成功',
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
        <div class="title">解冻账号</div>
        <tiny-form>
          <tiny-form-item label="方式">
            <tiny-radio-group v-model="type">
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
          <tiny-form-item v-if="type == 'mfa'" label="MFA">
            <tiny-input v-model="code" clearable minlength="6" maxlength="6" autocomplete="one-time-code"
              placeholder="请输入 MFA"></tiny-input>
          </tiny-form-item>
          <tiny-form-item v-if="type == 'emailcode'" label="验证码">
            <tiny-input v-model="code" clearable minlength="8" maxlength="8" autocomplete="one-time-code"
              placeholder="请输入验证码"></tiny-input>
          </tiny-form-item>
          <tiny-form-item>
            <tiny-button type="info" @click="unfreeze">解冻</tiny-button>
          </tiny-form-item>
        </tiny-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  text-align: center;
}
</style>