<script setup>
document.title = '轩铭2512 - 资源投稿 - 新增资源（便捷）'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const name = ref('')
const desc = ref('')
const location = ref('')
const submitreview = ref(true)
async function newResource() {
  if (!name.value) {
    TinyModal.message({
      message: '请输入名称',
      status: 'warning'
    })
    return
  }
  if (!location.value) {
    TinyModal.message({
      message: '请输入地址',
      status: 'warning'
    })
    return
  }
  const res = await request({
    apiPath: '/resourcecreator/newResource',
    body: {
      accessToken: accesstoken,
      name: name.value,
      desc: desc.value,
      version: '',
      location: [
        {
          name: '',
          type: 'text',
          value: location.value,
          tag: []
        }
      ],
      tag: [],
      info: []
    }
  })
  TinyModal.message({
    message: '新增成功',
    status: 'success'
  })
  if (submitreview.value) {
    await request({
      apiPath: '/resourcecreator/submitReviewResource',
      body: {
        accessToken: accesstoken,
        id: res.id
      }
    })
    TinyModal.message({
      message: '提交审核成功',
      status: 'success'
    })
  }
  router.push('/product/resourcecreator/resourcelist')
}
</script>

<template>
  <div class="cz">
    <tiny-breadcrumb>
      <tiny-breadcrumb-item :to="{ path: '/product/resourcecreator/resourcelist' }" label="资源管理"></tiny-breadcrumb-item>
      <tiny-breadcrumb-item :to="{ path: '/product/resourcecreator/newresourceeasy' }"
        label="新增资源（便捷）"></tiny-breadcrumb-item>
    </tiny-breadcrumb>
    <tiny-form>
      <tiny-form-item label="名称">
        <tiny-input v-model="name" clearable show-word-limit maxlength="30" placeholder="请输入名称"></tiny-input>
      </tiny-form-item>
      <tiny-form-item label="简介">
        <tiny-input v-model="desc" type="textarea" autosize clearable show-word-limit maxlength="500"
          placeholder="请输入简介（可选）"></tiny-input>
      </tiny-form-item>
      <tiny-form-item label="地址">
        <tiny-input v-model="location" type="textarea" autosize clearable show-word-limit maxlength="500"
          placeholder="请输入地址"></tiny-input>
      </tiny-form-item>
      <tiny-form-item label="提交审核">
        <tiny-switch v-model="submitreview"></tiny-switch>
      </tiny-form-item>
      <tiny-form-item>
        <tiny-button type="success" @click="newResource">新增</tiny-button>
      </tiny-form-item>
    </tiny-form>
  </div>
</template>