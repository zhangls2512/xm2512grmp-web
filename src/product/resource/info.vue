<script setup>
document.title = '轩铭2512 - 资源 - 详情'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import cookie from 'js-cookie'
import request from '../../request'
const route = useRoute()
const id = route.query.id
const accesstoken = cookie.get('accessToken')
const data = ref({})
const added = ref('')
const dialog = ref(false)
const tags = ref([])
const tag = ref('')
const mytag = ref([])
async function get() {
  const res = await request({
    apiPath: '/resource/getResourceInfo',
    body: {
      id: id
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  data.value = res.data
  if (accesstoken) {
    const addres = await request({
      apiPath: '/resource/checkResourceAdded',
      body: {
        accessToken: accesstoken,
        resourceId: id
      }
    })
    added.value = addres.added
    const tagres = await request({
      apiPath: '/product/getUserInfo',
      body: {
        accessToken: accesstoken,
        product: 'resource'
      }
    })
    mytag.value = tagres.data.setting.tag
  }
}
get()
function copy(value) {
  navigator.clipboard.writeText(value)
  TinyModal.message({
    message: '内容已复制',
    status: 'success'
  })
}
function addTag() {
  if (tag.value == '') {
    TinyModal.message({
      message: '请输入内容',
      status: 'warning'
    })
    return
  }
  tags.value.push(tag.value)
  tag.value = ''
}
function removeTag(index) {
  tags.value.splice(index, 1)
}
function inputTag() {
  const resourcetag = data.value.tag.map(item => item.value)
  tags.value = tags.value.concat(resourcetag)
}
function inputMytag(inputtags) {
  tags.value = tags.value.concat(inputtags)
}
function newAddOpen() {
  dialog.value = true
}
function newAddClose() {
  dialog.value = false
  tags.value = []
  tag.value = ''
}
async function newAdd() {
  await request({
    apiPath: '/resource/newAddResource',
    body: {
      accessToken: accesstoken,
      resourceId: id,
      tag: tags.value
    }
  })
  newAddClose()
  TinyModal.message({
    message: '添加成功',
    status: 'success'
  })
  get()
}
async function deleteAdd() {
  await request({
    apiPath: '/resource/deleteAddResource',
    body: {
      accessToken: accesstoken,
      resourceId: id
    }
  })
  TinyModal.message({
    message: '取消添加成功',
    status: 'success'
  })
  get()
}
function update() {
  window.open('/product/resourcecreator/updateresource?id=' + id, '_blank')
}
</script>

<template>
  <div class="main">
    <div class="cz">
      <div class="sp">
        <div class="bold-text">名称</div>
        <div>{{ data.name }}</div>
      </div>
      <div v-if="data.desc != ''" class="bold-text">简介</div>
      <div v-if="data.desc != ''">{{ data.desc }}</div>
      <div v-if="data.version != ''" class="sp">
        <div class="bold-text">版本号</div>
        <div>{{ data.version }}</div>
      </div>
      <div class="bold-text">地址</div>
      <div v-for="(item, index) in data.location" class="sp">
        <div>{{ index + 1 }}.</div>
        <div>
          <span v-if="item.name != ''">{{ item.name }}：</span>
          <tiny-tooltip v-if="item.type == 'text'" content="点击复制" placement="top">
            <span style="cursor: pointer" @click="copy(item.value)">{{ item.value }}</span>
          </tiny-tooltip>
          <a v-if="item.type == 'url'" :href="item.value" target="_blank">{{ item.value }}</a>
        </div>
        <tiny-tag v-for="item in item.tag" :type="item.type">{{ item.value }}</tiny-tag>
      </div>
      <div v-if="data.tag.length > 0" class="sp">
        <div class="bold-text">标签</div>
        <tiny-tag v-for="item in data.tag" :type="item.type">{{ item.value }}</tiny-tag>
      </div>
      <div v-if="data.info.length > 0" class="bold-text">更多信息</div>
      <tiny-alert v-for="item in data.info" v-if="data.info.length > 0" :closable="false" :type="item.color">
        <template #description>
          <span v-if="item.name != ''">{{ item.name }}：</span>
          <tiny-tooltip v-if="item.type == 'text'" content="点击复制" placement="top">
            <span style="cursor: pointer" @click="copy(item.value)">{{ item.value }}</span>
          </tiny-tooltip>
          <a v-if="item.type == 'url'" :href="item.value" target="_blank">{{ item.value }}</a>
        </template>
      </tiny-alert>
      <div class="sp">
        <div class="bold-text">ID</div>
        <div>{{ data._id }}</div>
        <tiny-button type="info" @click="copy(data._id)">复制</tiny-button>
      </div>
      <tiny-alert :closable="false" description="如果发现以上信息与实际不符或涉嫌违规，可联系客服举报。"></tiny-alert>
      <tiny-divider></tiny-divider>
      <div>
        <tiny-button v-if="added == false" type="success" @click="newAddOpen">添加到我的资源</tiny-button>
        <tiny-button v-if="added == true" type="danger" @click="deleteAdd">从我的资源中删除</tiny-button>
        <tiny-button type="info" @click="update">修改</tiny-button>
      </div>
    </div>
    <tiny-dialog-box class="dialog" :visible="dialog" title="设置标签" @close="newAddClose">
      <div class="dialog-cz">
        <div class="sp">
          <tiny-input v-model="tag" clearable placeholder="请输入内容"></tiny-input>
          <tiny-button type="success" @click="addTag">添加</tiny-button>
        </div>
        <div v-for="(item, index) in tags" class="sp">
          <tiny-tag type="info">{{ item }}</tiny-tag>
          <tiny-button type="danger" @click="removeTag(index)">删除</tiny-button>
        </div>
        <div v-if="data.tag.length > 0" class="sp">
          <div class="bold-text">自带标签</div>
          <tiny-button type="success" @click="inputTag">添加</tiny-button>
        </div>
        <div v-if="mytag.length > 0" class="bold-text">我的标签</div>
        <div v-for="(item, index) in mytag">
          <div class="sp">
            <div>{{ index + 1 }}.</div>
            <tiny-tag v-for="item in item" type="info">{{ item }}</tiny-tag>
            <tiny-button type="success" @click="inputMytag(item)">添加</tiny-button>
          </div>
        </div>
      </div>
      <template #footer>
        <tiny-button type="success" @click="newAdd">添加</tiny-button>
      </template>
    </tiny-dialog-box>
  </div>
</template>