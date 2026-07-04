<script setup>
document.title = '轩铭2512 - 管理后台 - 产品用户列表 - 智能待办团队'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
import router from '../../router'
import time from '../../time'
const accesstoken = cookie.get('accessToken')
const data = ref([])
const currentpage = ref(1)
const pagesize = ref(10)
const total = ref(0)
const teamid = ref('')
async function get() {
  const countres = await request({
    apiPath: '/admin/getProductUserCount',
    body: {
      accessToken: accesstoken,
      product: 'todoteam'
    }
  })
  total.value = countres.count
  const res = await request({
    apiPath: '/admin/getProductUserList',
    body: {
      accessToken: accesstoken,
      product: 'todoteam',
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
get()
async function currentpageChange(t) {
  currentpage.value = t
  get()
}
async function pagesizeChange(t) {
  pagesize.value = t
  get()
}
function newTodoteam() {
  router.push('/product/admin/newtodoteam')
}
async function copy(value) {
  await navigator.clipboard.writeText(value)
  TinyModal.message({
    message: '内容已复制',
    status: 'success'
  })
}
async function search() {
  if (!teamid.value) {
    get()
    return
  }
  if (teamid.value && teamid.value.length != 36) {
    TinyModal.message({
      message: '请输入有效的团队 ID',
      status: 'warning'
    })
    return
  }
  const userres = await request({
    apiPath: '/admin/searchProductUser',
    body: {
      accessToken: accesstoken,
      product: 'todoteam',
      uid: teamid.value
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  data.value = userres.data
}
async function updateTodoteamEnabled(id) {
  await request({
    apiPath: '/admin/updateTodoteamEnabled',
    body: {
      accessToken: accesstoken,
      id: id
    }
  })
  TinyModal.message({
    message: '请求成功',
    status: 'success'
  })
  get()
}
async function resetTodoteamAdminPassword(teamid) {
  await request({
    apiPath: '/admin/resetTodoteamAdminPassword',
    body: {
      accessToken: accesstoken,
      teamId: teamid
    }
  })
  TinyModal.message({
    message: '重置成功',
    status: 'success'
  })
}
</script>

<template>
  <div class="cz">
    <div><tiny-button type="success" @click="newTodoteam">新增</tiny-button></div>
    <div class="sp">
      <tiny-input v-model="teamid" clearable minlength="36" maxlength="36" placeholder="请输入团队 ID"></tiny-input>
      <tiny-button type="info" @click="search">搜索</tiny-button>
    </div>
    <tiny-grid :data="data">
      <tiny-grid-column title="ID" align="center">
        <template #default="{ row }">
          <tiny-tooltip content="点击复制" placement="top">
            <div style="cursor: pointer" @click="copy(row.teamId)">{{ row.teamId }}</div>
          </tiny-tooltip>
        </template>
      </tiny-grid-column>
      <tiny-grid-column field="teamName" title="名称" align="center"></tiny-grid-column>
      <tiny-grid-column field="teamEnabled" title="是否可用" align="center" format-text="boole"></tiny-grid-column>
      <tiny-grid-column field="userMaxCount" title="最大用户个数" align="center"></tiny-grid-column>
      <tiny-grid-column field="todoMaxCount" title="最大待办个数" align="center"></tiny-grid-column>
      <tiny-grid-column title="管理员用户 ID" align="center">
        <template #default="{ row }">
          <tiny-tooltip content="点击复制" placement="top">
            <div style="cursor: pointer" @click="copy(row.userId)">{{ row.userId }}</div>
          </tiny-tooltip>
        </template>
      </tiny-grid-column>
      <tiny-grid-column title="操作" align="center">
        <template #default="{ row }">
          <div class="czsp">
            <tiny-button v-if="row.teamEnabled == true" type="danger"
              @click="updateTodoteamEnabled(row.teamId)">封禁</tiny-button>
            <tiny-button v-if="row.teamEnabled == false" type="success"
              @click="updateTodoteamEnabled(row.teamId)">解封</tiny-button>
            <tiny-button type="warning" @click="resetTodoteamAdminPassword(row.teamId)">重置密码</tiny-button>
          </div>
        </template>
      </tiny-grid-column>
    </tiny-grid>
    <tiny-pager mode="number" :current-page="currentpage" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]"
      :total="total" @current-change="currentpageChange" @size-change="pagesizeChange"></tiny-pager>
  </div>
</template>