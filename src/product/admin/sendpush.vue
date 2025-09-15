<script setup>
document.title = '轩铭2512 - 管理后台 - 推送'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import cookie from 'js-cookie'
import request from '../../request'
import router from '../../router'
const route = useRoute()
const id = route.query.id
const accesstoken = cookie.get('accessToken')
const title = ref('')
const body = ref('')
const url = ref('')
const badge = ref(false)
const foregroundshow = ref(true)
const test = ref(false)
async function send() {
  if (title.value == '') {
    TinyModal.message({
      message: '请输入标题',
      status: 'warning'
    })
    return
  }
  if (body.value == '') {
    TinyModal.message({
      message: '请输入内容',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/admin/sendPush',
    body: {
      accessToken: accesstoken,
      id: id,
      title: title.value,
      body: body.value,
      url: url.value,
      badge: badge.value,
      foregroundshow: foregroundshow.value,
      test: test.value
    }
  })
  TinyModal.message({
    message: '推送成功',
    status: 'success'
  })
  router.push('/product/admin/pushlist')
}
</script>

<template>
  <div class="cz">
    <tiny-breadcrumb>
      <tiny-breadcrumb-item :to="{ path: '/product/admin/pushlist' }" label="产品推送管理"></tiny-breadcrumb-item>
      <tiny-breadcrumb-item :to="{ path: '/product/admin/sendpush' }" label="推送"></tiny-breadcrumb-item>
    </tiny-breadcrumb>
    <tiny-form>
      <tiny-form-item label="标题">
        <tiny-input v-model="title" clearable placeholder="请输入标题"></tiny-input>
      </tiny-form-item>
      <tiny-form-item label="内容">
        <tiny-input v-model="body" type="textarea" autosize placeholder="请输入内容"></tiny-input>
      </tiny-form-item>
      <tiny-form-item label="链接">
        <tiny-input v-model="url" clearable placeholder="请输入链接"></tiny-input>
      </tiny-form-item>
      <tiny-form-item label="桌面角标">
        <tiny-switch v-model="badge"></tiny-switch>
      </tiny-form-item>
      <tiny-form-item label="前台展示">
        <tiny-switch v-model="foregroundshow"></tiny-switch>
      </tiny-form-item>
      <tiny-form-item label="测试">
        <tiny-switch v-model="test"></tiny-switch>
      </tiny-form-item>
      <tiny-form-item>
        <tiny-button type="info" @click="send">推送</tiny-button>
      </tiny-form-item>
    </tiny-form>
  </div>
</template>