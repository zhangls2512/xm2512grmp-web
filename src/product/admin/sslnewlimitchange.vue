<script setup>
document.title = '轩铭2512 - 管理后台 - 新增 SSL 证书额度变更'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const uid = ref('')
const changetype = ref('add')
const number = ref('')
const reason = ref('')
async function newLimitChange() {
  if (uid.value.length != 32) {
    TinyModal.message({
      message: '请输入有效的 UID',
      status: 'warning'
    })
    return
  }
  const numberout = Number(number.value)
  if (!Number.isInteger(numberout) || numberout <= 0) {
    TinyModal.message({
      message: '请输入有效的数量',
      status: 'warning'
    })
    return
  }
  if (!reason.value) {
    TinyModal.message({
      message: '请输入原因',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/admin/newSslLimitChange',
    body: {
      accessToken: accesstoken,
      uid: uid.value,
      changeType: changetype.value,
      number: numberout,
      reason: reason.value
    }
  })
  TinyModal.message({
    message: '新增成功',
    status: 'success'
  })
  router.push('/product/admin/ssllimitchangelist')
}
</script>

<template>
  <div class="cz">
    <tiny-breadcrumb>
      <tiny-breadcrumb-item :to="{ path: '/product/admin/ssllimitchangelist' }" label="额度管理"></tiny-breadcrumb-item>
      <tiny-breadcrumb-item :to="{ path: '/product/admin/sslnewlimitchange' }" label="新增额度变更"></tiny-breadcrumb-item>
    </tiny-breadcrumb>
    <tiny-form>
      <tiny-form-item label="UID">
        <tiny-input v-model="uid" clearable minlength="32" maxlength="32" placeholder="请输入 UID"></tiny-input>
      </tiny-form-item>
      <tiny-form-item label="类型">
        <tiny-radio-group v-model="changetype">
          <tiny-radio label="add">加</tiny-radio>
          <tiny-radio label="minus">减</tiny-radio>
        </tiny-radio-group>
      </tiny-form-item>
      <tiny-form-item label="数量">
        <tiny-input v-model="number" type="number" clearable placeholder="请输入数量"></tiny-input>
      </tiny-form-item>
      <tiny-form-item label="原因">
        <tiny-input v-model="reason" clearable placeholder="请输入原因"></tiny-input>
      </tiny-form-item>
      <tiny-form-item>
        <tiny-button type="success" @click="newLimitChange">新增</tiny-button>
      </tiny-form-item>
    </tiny-form>
  </div>
</template>