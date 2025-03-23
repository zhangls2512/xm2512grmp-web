<script setup>
document.title = '轩铭2512 - 资源 - 搜索'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import cookie from 'js-cookie'
import request from '../../request'
const accesstoken = cookie.get('accessToken')
const route = useRoute()
const data = ref([])
const currentpage = ref(1)
const pagesize = ref(10)
const total = ref(0)
const keyword = ref('')
const tags = ref([])
const tag = ref('')
const mytag = ref([])
const showdesc = ref(false)
async function get() {
  const countres = await request({
    apiPath: '/resource/getResourceCount',
    body: {
      keyword: keyword.value,
      tag: tags.value
    }
  })
  total.value = countres.count
  const res = await request({
    apiPath: '/resource/getResourceList',
    body: {
      keyword: keyword.value,
      tag: tags.value,
      skip: (currentpage.value - 1) * pagesize.value,
      limit: pagesize.value
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  data.value = res.data
}
if (typeof (route.query.keyword) == 'string') {
  keyword.value = route.query.keyword
  if (keyword.value) {
    get()
  }
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
}
function removeTag(index) {
  tags.value.splice(index, 1)
}
function inputTag(inputtags) {
  tags.value = [...new Set(tags.value.concat(inputtags))]
}
</script>

<template>
  <div class="main">
    <div class="cz">
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
        <tiny-form-item>
          <tiny-button type="info" @click="get">搜索</tiny-button>
        </tiny-form-item>
      </tiny-form>
      <div class="sp">
        <div class="bold-text">显示简介</div>
        <tiny-switch v-model="showdesc"></tiny-switch>
      </div>
      <div v-if="data.length == 0" class="large-bold-text" style="text-align: center">无数据</div>
      <div v-for="item in data" class="cz" style="cursor: pointer" @click="info(item._id)">
        <tiny-divider></tiny-divider>
        <div class="bold-text">{{ item.name }}</div>
        <div v-if="showdesc == true">{{ item.desc }}</div>
        <div class="sp">
          <tiny-tag v-for="item in item.tag" :type="item.type">{{ item.value }}</tiny-tag>
        </div>
      </div>
      <tiny-divider v-if="data.length > 0"></tiny-divider>
      <tiny-pager mode="number" :current-page="currentpage" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]"
        :total="total" @current-change="currentpageChange" @size-change="pagesizeChange"></tiny-pager>
    </div>
  </div>
</template>