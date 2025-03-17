<script setup>
document.title = '轩铭2512 - 资源 - 资源详情'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import cookie from 'js-cookie'
import request from '../../request'
const route = useRoute()
const id = route.query.id
const accesstoken = cookie.get('accessToken')
const data = ref({
  tag: [],
  info: []
})
const added = ref('')
const dialog = ref(false)
const tags = ref([])
const tag = ref('')
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
  const addres = await request({
    apiPath: '/resource/checkResourceAdded',
    body: {
      accessToken: accesstoken,
      resourceId: id
    }
  })
  added.value = addres.added
}
get()
function copy() {
  navigator.clipboard.writeText(data.value._id)
  TinyModal.message({
    message: '内容已复制',
    status: 'success'
  })
}
function addTag() {
  if (!tag.value) {
    TinyModal.message({
      message: '请输入内容',
      status: 'warning'
    })
    return
  }
  tags.value.push(tag.value)
}
function removeTag(index) {
  tags.value.splice(index, 1)
}
function inputTag() {
  const resourcetag = data.value.tag.map(item => item.value)
  tags.value = [...new Set(tags.value.concat(resourcetag))]
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
</script>

<template>
  <div class="main">
    <div class="cz">
      <div>
        <tiny-alert v-if="added === false" :closable="false"
          description="添加后可在首页 - 个人中心 - 我的添加中查看，还可使用检查版本更新、订阅版本更新通知功能。"></tiny-alert>
        <tiny-button v-if="added === false" type="success" @click="newAddOpen">添加</tiny-button>
        <tiny-button v-if="added === true" type="danger" @click="deleteAdd">取消添加</tiny-button>
      </div>
      <div class="sp">
        <div class="bold-text">名称</div>
        <div>{{ data.name }}</div>
      </div>
      <div v-if="data.desc != ''" class="bold-text">简介</div>
      <div v-if="data.desc != ''" class="text">{{ data.desc }}</div>
      <div v-if="data.version != ''" class="sp">
        <div class="bold-text">版本号</div>
        <div>{{ data.version }}</div>
      </div>
      <div class="bold-text">地址</div>
      <div v-for="item in data.location" class="sp">
        <div>
          <span v-if="item.name != ''">{{ item.name }}：</span>
          <span v-if="item.type == 'text'">{{ item.value }}</span>
          <a v-if="item.type == 'url'" :href="item.value" target="_blank">{{ item.value }}</a>
        </div>
        <div class="sp">
          <tiny-tag v-for="item in item.tag" :type="item.type">{{ item.value }}</tiny-tag>
        </div>
      </div>
      <div v-if="data.tag.length > 0" class="sp">
        <div class="bold-text">标签</div>
        <tiny-tag v-for="item in data.tag" :type="item.type">{{ item.value }}</tiny-tag>
      </div>
      <div v-if="data.info.length > 0" class="bold-text">更多信息</div>
      <tiny-alert v-for="item in data.info" v-if="data.info.length > 0" :closable="false" :type="item.color">
        <template #description>
          <span v-if="item.name != ''">{{ item.name }}：</span>
          <span v-if="item.type == 'text'">{{ item.value }}</span>
          <a v-if="item.type == 'url'" :href="item.value" target="_blank">{{ item.value }}</a>
        </template>
      </tiny-alert>
      <tiny-divider></tiny-divider>
      <div class="sp">
        <div class="bold-text">ID</div>
        <div>{{ data._id }}</div>
        <tiny-button type="info" @click="copy">复制</tiny-button>
      </div>
      <tiny-alert :closable="false" description="如果发现以上信息与实际不符或涉嫌违规，请联系客服举报。"></tiny-alert>
    </div>
    <tiny-dialog-box class="dialog" :visible="dialog" title="设置标签" @close="newAddClose">
      <div class="dialog-cz">
        <div class="sp">
          <tiny-input v-model="tag" clearable placeholder="请输入内容"></tiny-input>
          <tiny-button type="success" @click="addTag">添加</tiny-button>
        </div>
        <tiny-button type="info" @click="inputTag">添加自带标签</tiny-button>
        <div v-for="(item, index) in tags" class="sp">
          <tiny-tag type="info">{{ item }}</tiny-tag>
          <tiny-button type="danger" @click="removeTag(index)">删除</tiny-button>
        </div>
      </div>
      <template #footer>
        <tiny-button type="success" @click="newAdd">添加</tiny-button>
      </template>
    </tiny-dialog-box>
  </div>
</template>

<style scoped>
.cz {
  width: 100%;
}
</style>