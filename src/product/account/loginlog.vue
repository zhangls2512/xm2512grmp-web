<script setup>
document.title = '轩铭2512 - 统一账号 - 账号管理 - 登录日志'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
const accesstoken = cookie.get('accessToken')
const loginlog = ref([])
const typemap = {
  emailcode: '邮箱验证码',
  mfa: 'MFA',
  password: '密码'
}
async function getLoginLog() {
  const res = await request({
    apiPath: '/account/getLoginLog',
    body: {
      accessToken: accesstoken
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  const outloginlog = res.data.map(item => ({
    ...item,
    verifyType: typemap[item.verifyType]
  }))
  loginlog.value = outloginlog
}
getLoginLog()
</script>

<template>
  <div>
    <tiny-alert :closable="false" description="仅展示近30天内的最多10条最新登录日志。"></tiny-alert>
    <tiny-grid :data="loginlog" :IRadioConfig="{ checkMethod: false }">
      <tiny-grid-column field="verifyType" title="验证方式" align="center"></tiny-grid-column>
      <tiny-grid-column field="ipAddress" title="地点" align="center"></tiny-grid-column>
      <tiny-grid-column field="ip" title="IP" align="center"></tiny-grid-column>
      <tiny-grid-column field="ua" title="UserAgent" align="center"></tiny-grid-column>
      <tiny-grid-column field="date" title="时间" align="center" format-text="longDateTime"></tiny-grid-column>
    </tiny-grid>
  </div>
</template>