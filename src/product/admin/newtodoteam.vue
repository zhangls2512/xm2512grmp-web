<script setup>
document.title = '轩铭2512 - 管理后台 - 新增智能待办团队'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const name = ref('')
async function newTodoteam() {
  if (!name.value) {
    TinyModal.message({
      message: '请输入名称',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/admin/newTodoteam',
    body: {
      accessToken: accesstoken,
      name: name.value
    }
  })
  TinyModal.message({
    message: '新增成功',
    status: 'success'
  })
  router.push('/product/admin/todoteamlist')
}
</script>

<template>
  <div class="cz">
    <tiny-breadcrumb>
      <tiny-breadcrumb-item :to="{ path: '/product/admin/todoteamlist' }" label="智能待办团队列表"></tiny-breadcrumb-item>
      <tiny-breadcrumb-item :to="{ path: '/product/admin/newtodoteam' }" label="新增智能待办团队"></tiny-breadcrumb-item>
    </tiny-breadcrumb>
    <tiny-form>
      <tiny-form-item label="名称">
        <tiny-input v-model="name" clearable placeholder="请输入名称"></tiny-input>
      </tiny-form-item>
      <tiny-form-item>
        <tiny-button type="success" @click="newTodoteam">新增</tiny-button>
      </tiny-form-item>
    </tiny-form>
  </div>
</template>