<script setup>
document.title = '轩铭2512 - 管理后台 - 新增违规记录'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const uid = ref('')
const content = ref('')
const method = ref('')
async function newBanlog() {
  if (uid.value === '') {
    TinyModal.message({
      message: '请输入 UID',
      status: 'warning'
    })
    return
  }
  if (content.value === '') {
    TinyModal.message({
      message: '请输入违规内容',
      status: 'warning'
    })
    return
  }
  if (method.value === '') {
    TinyModal.message({
      message: '请输入处罚方式',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/admin/newBanlog',
    body: {
      accessToken: accesstoken,
      uid: uid.value,
      content: content.value,
      method: method.value
    }
  })
  TinyModal.message({
    message: '新增成功',
    status: 'success'
  })
  router.push('/admin/banloglist')
}
</script>

<template>
  <div class="cz">
    <tiny-breadcrumb>
      <tiny-breadcrumb-item :to="{ path: '/product/admin/banloglist' }" label="违规记录管理"></tiny-breadcrumb-item>
      <tiny-breadcrumb-item :to="{ path: '/product/admin/newbanlog' }" label="新增违规记录"></tiny-breadcrumb-item>
    </tiny-breadcrumb>
    <tiny-form>
      <tiny-form-item label="UID">
        <tiny-input v-model="uid" clearable placeholder="请输入 UID"></tiny-input>
      </tiny-form-item>
      <tiny-form-item label="违规内容">
        <tiny-input v-model="content" type="textarea" clearable placeholder="请输入违规内容"></tiny-input>
      </tiny-form-item>
      <tiny-form-item label="处罚方式">
        <tiny-input v-model="method" type="textarea" clearable placeholder="请输入处罚方式"></tiny-input>
      </tiny-form-item>
      <tiny-form-item>
        <tiny-button type="info" @click="newBanlog">新增</tiny-button>
      </tiny-form-item>
    </tiny-form>
  </div>
</template>