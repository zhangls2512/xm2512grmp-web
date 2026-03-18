<script setup>
document.title = '轩铭2512 - 资源 - 功能设置'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
const accesstoken = cookie.get('accessToken')
const personalizedrecommendation = ref(false)
const tags = ref([])
const dialog = ref(false)
const tag = ref([])
const inputtags = ref([])
const inputtag = ref('')
async function getUserInfo() {
  const res = await request({
    apiPath: '/product/getUserInfo',
    body: {
      accessToken: accesstoken,
      product: 'resource'
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  personalizedrecommendation.value = res.data.setting.personalizedRecommendation ? true : false
  tags.value = res.data.setting.tag
  inputtags.value = [...res.data.setting.tag]
}
getUserInfo()
async function change(name, value) {
  await request({
    apiPath: '/resource/updateUserSetting',
    body: {
      accessToken: accesstoken,
      settingName: name,
      settingValue: value
    }
  })
  TinyModal.message({
    message: '设置成功',
    status: 'success'
  })
  getUserInfo()
}
async function set() {
  await request({
    apiPath: '/resource/updateUserSetting',
    body: {
      accessToken: accesstoken,
      settingName: 'tag',
      settingValue: inputtags.value
    }
  })
  closeDialog()
  TinyModal.message({
    message: '设置成功',
    status: 'success'
  })
  getUserInfo()
}
function openDialog() {
  dialog.value = true
}
function closeDialog() {
  dialog.value = false
}
function addIntag() {
  if (!inputtag.value) {
    TinyModal.message({
      message: '请输入内容',
      status: 'warning'
    })
    return
  }
  if (tag.value.includes(inputtag.value)) {
    TinyModal.message({
      message: '标签已存在',
      status: 'warning'
    })
    return
  }
  tag.value.push(inputtag.value)
  inputtag.value = ''
}
function removeIntag(index) {
  tag.value.splice(index, 1)
}
function addTag() {
  if (tag.value.length == 0) {
    TinyModal.message({
      message: '请添加标签',
      status: 'warning'
    })
    return
  }
  inputtags.value.push(tag.value)
  tag.value = []
}
function removeTag(index) {
  inputtags.value.splice(index, 1)
}
</script>

<template>
  <div class="cz">
    <div class="sp">
      <div>个性化推荐</div>
      <tiny-switch v-model="personalizedrecommendation"
        @change="(zt) => change('personalizedRecommendation', zt)"></tiny-switch>
    </div>
    <tiny-alert :closable="false" description="开启后首页将使用下方设置的标签个性化推荐资源。"></tiny-alert>
    <div class="sp">
      <div class="large-bold-text">标签</div>
      <tiny-button type="info" @click="openDialog">编辑</tiny-button>
    </div>
    <tiny-alert :closable="false" description="你可以在搜索等场景中一键添加标签用于搜索。"></tiny-alert>
    <div v-for="(item, index) in tags">
      <div class="sp">
        <div>{{ index + 1 }}.</div>
        <tiny-tag v-for="item in item" type="info">{{ item }}</tiny-tag>
      </div>
    </div>
    <tiny-dialog-box class="dialog" :visible="dialog" title="编辑标签" @close="closeDialog">
      <div class="dialog-cz">
        <div class="sp">
          <tiny-input v-model="inputtag" clearable placeholder="请输入内容"></tiny-input>
          <tiny-button type="success" @click="addIntag">添加单标签</tiny-button>
        </div>
        <div v-for="(item, index) in tag" class="sp">
          <tiny-tag type="info">{{ item }}</tiny-tag>
          <tiny-button type="danger" @click="removeIntag(index)">删除</tiny-button>
        </div>
        <tiny-button type="success" @click="addTag">添加标签组</tiny-button>
        <div v-for="(item, index) in inputtags" class="sp">
          <div class="sp">
            <tiny-tag v-for="item in item" type="info">{{ item }}</tiny-tag>
          </div>
          <tiny-button type="danger" @click="removeTag(index)">删除</tiny-button>
        </div>
      </div>
      <template #footer>
        <tiny-button type="info" @click="set">保存</tiny-button>
      </template>
    </tiny-dialog-box>
  </div>
</template>