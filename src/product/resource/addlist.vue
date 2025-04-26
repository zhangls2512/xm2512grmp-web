<script setup>
document.title = '轩铭2512 - 资源 - 我的资源'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
const accesstoken = cookie.get('accessToken')
const data = ref([])
const currentpage = ref(1)
const pagesize = ref(10)
const total = ref(0)
const keyword = ref('')
const tags = ref([])
const tag = ref('')
const mytag = ref([])
const checkversionupdate = ref(false)
const onlyshowversionupdate = ref(false)
const dialog = ref(false)
let addid = ''
const addtags = ref([])
const addtag = ref('')
async function get() {
  const countres = await request({
    apiPath: '/resource/getAddResourceCount',
    body: {
      accessToken: accesstoken,
      keyword: keyword.value,
      tag: tags.value
    }
  })
  total.value = countres.count
  const res = await request({
    apiPath: '/resource/getAddResourceList',
    body: {
      accessToken: accesstoken,
      keyword: keyword.value,
      tag: tags.value,
      checkVersionUpdate: checkversionupdate.value,
      skip: (currentpage.value - 1) * pagesize.value,
      limit: pagesize.value
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  data.value = res.data.map(item => {
    if (item.latestVersion !== undefined) {
      if (item.version == item.latestVersion || !item.latestVersion) {
        return {
          ...item,
          versionUpdate: false
        }
      }
      return {
        ...item,
        versionUpdate: true
      }
    }
    return {
      ...item,
      versionUpdate: ''
    }
  })
}
async function getTag() {
  if (accesstoken) {
    const res = await request({
      apiPath: '/product/getUserInfo',
      body: {
        accessToken: accesstoken,
        product: 'resource'
      }
    })
    mytag.value = res.data.setting.tag
  }
}
get()
getTag()
function currentpageChange(t) {
  currentpage.value = t
  get()
}
function pagesizeChange(t) {
  pagesize.value = t
  get()
}
function info(id) {
  window.open('/product/resource/info?id=' + id, '_blank')
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
  tag.value = ''
}
function removeTag(index) {
  tags.value.splice(index, 1)
}
function inputTag(inputtags) {
  tags.value = tags.value.concat(inputtags)
}
async function syncSingle(id) {
  await request({
    apiPath: '/resource/syncAddResourceInfo',
    body: {
      accessToken: accesstoken,
      id: [id]
    }
  })
  TinyModal.message({
    message: '同步成功',
    status: 'success'
  })
  get()
}
async function syncAll() {
  await request({
    apiPath: '/resource/syncAddResourceInfo',
    body: {
      accessToken: accesstoken,
      id: data.value.map(item => item._id)
    }
  })
  TinyModal.message({
    message: '同步成功',
    status: 'success'
  })
  get()
}
function addAddTag() {
  if (!addtag.value) {
    TinyModal.message({
      message: '请输入内容',
      status: 'warning'
    })
    return
  }
  addtags.value.push(addtag.value)
  addtag.value = ''
}
function removeAddTag(index) {
  addtags.value.splice(index, 1)
}
function updateAddResourceOpen(item) {
  dialog.value = true
  addtags.value = [...item.tag]
  addid = item._id
}
function updateAddResourceClose() {
  dialog.value = false
  addid = ''
  addtags.value = []
}
async function updateAddResource() {
  await request({
    apiPath: '/resource/updateAddResource',
    body: {
      accessToken: accesstoken,
      id: addid,
      tag: addtags.value
    }
  })
  updateAddResourceClose()
  TinyModal.message({
    message: '修改成功',
    status: 'success'
  })
  get()
}
async function deleteAddResource(resourceid) {
  await request({
    apiPath: '/resource/deleteAddResource',
    body: {
      accessToken: accesstoken,
      resourceId: resourceid
    }
  })
  TinyModal.message({
    message: '删除成功',
    status: 'success'
  })
  get()
}
</script>

<template>
  <div class="cz">
    <tiny-alert :closable="false"
      description="名称、版本号不随原资源名称、版本号更新而更新，保持添加时原资源的名称、版本号不变。如需更新名称、版本号为原资源更新后的名称、版本号，请使用同步功能。"></tiny-alert>
    <tiny-form>
      <tiny-form-item label="名称">
        <tiny-input v-model="keyword" clearable placeholder="请输入名称"></tiny-input>
      </tiny-form-item>
      <tiny-form-item label="标签">
        <div class="cz">
          <div class="sp">
            <tiny-input v-model="tag" clearable placeholder="请输入内容"></tiny-input>
            <tiny-button type="success" @click="addTag">添加</tiny-button>
          </div>
          <div v-for="(item, index) in tags" class="sp">
            <tiny-tag type="info">{{ item }}</tiny-tag>
            <tiny-button type="danger" @click="removeTag(index)">删除</tiny-button>
          </div>
        </div>
      </tiny-form-item>
      <tiny-form-item v-if="mytag.length > 0" label="我的标签">
        <div class="cz">
          <div v-for="(item, index) in mytag">
            <div class="sp">
              <div>{{ index + 1 }}.</div>
              <tiny-tag v-for="item in item" type="info">{{ item }}</tiny-tag>
              <tiny-button type="success" @click="inputTag(item)">添加</tiny-button>
            </div>
          </div>
        </div>
      </tiny-form-item>
      <tiny-form-item label="检查更新">
        <tiny-switch v-model="checkversionupdate"></tiny-switch>
      </tiny-form-item>
      <tiny-form-item>
        <tiny-button type="info" @click="get">搜索</tiny-button>
      </tiny-form-item>
    </tiny-form>
    <div v-if="checkversionupdate == true && data.length > 0" class="sp">
      <div>仅显示有更新</div>
      <tiny-switch v-model="onlyshowversionupdate"></tiny-switch>
    </div>
    <tiny-button v-if="data.length > 0" type="success" @click="syncAll">同步此页</tiny-button>
    <div v-if="data.length == 0">
      <tiny-divider></tiny-divider>
      <div class="large-bold-text" style="text-align: center">无数据</div>
    </div>
    <div v-for="item in data">
      <div v-if="item.versionUpdate != false || onlyshowversionupdate == false" class="cz">
        <tiny-divider></tiny-divider>
        <div class="sp">
          <tiny-alert v-if="item.name == null" style="flex-grow:1" type="error" :closable="false"
            description="资源已失效"></tiny-alert>
          <div v-if="item.name != null" class="cz" style="cursor: pointer;flex-grow:1" @click="info(item.resourceId)">
            <div class="bold-text">{{ item.name }}</div>
            <div v-if="item.version != ''">当前版本：{{ item.version }}</div>
            <div class="sp">
              <tiny-tag v-for="item in item.tag" type="info">{{ item }}</tiny-tag>
            </div>
            <div v-if="item.versionUpdate !== ''">
              <tiny-alert v-if="item.versionUpdate == false" type="success" :closable="false"
                description="已是最新"></tiny-alert>
              <tiny-alert v-if="item.versionUpdate == true" type="warning" :closable="false">
                <template #description>
                  <div>有新版本：{{ item.latestVersion }}</div>
                </template>
              </tiny-alert>
            </div>
          </div>
          <div class="sp">
            <tiny-button type="success" @click="syncSingle(item._id)">同步</tiny-button>
            <tiny-button type="info" @click="updateAddResourceOpen(item)">修改</tiny-button>
            <tiny-button type="danger" @click="deleteAddResource(item.resourceId)">删除</tiny-button>
          </div>
        </div>
      </div>
    </div>
    <tiny-divider v-if="data.length > 0"></tiny-divider>
    <tiny-pager mode="number" :current-page="currentpage" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]"
      :total="total" @current-change="currentpageChange" @size-change="pagesizeChange"></tiny-pager>
    <tiny-dialog-box class="dialog" :visible="dialog" title="设置标签" @close="updateAddResourceClose">
      <div class="dialog-cz">
        <div class="sp">
          <tiny-input v-model="addtag" clearable placeholder="请输入内容"></tiny-input>
          <tiny-button type="success" @click="addAddTag">添加</tiny-button>
        </div>
        <div v-for="(item, index) in addtags" class="sp">
          <tiny-tag type="info">{{ item }}</tiny-tag>
          <tiny-button type="danger" @click="removeAddTag(index)">删除</tiny-button>
        </div>
      </div>
      <template #footer>
        <tiny-button type="info" @click="updateAddResource">保存</tiny-button>
      </template>
    </tiny-dialog-box>
  </div>
</template>