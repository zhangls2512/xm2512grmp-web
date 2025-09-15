<script setup>
document.title = '轩铭2512 - 管理后台 - 推送日志'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import cookie from 'js-cookie'
import request from '../../request'
const route = useRoute()
const id = route.query.id
const accesstoken = cookie.get('accessToken')
const data = ref([])
const currentpage = ref(1)
const pagesize = ref(10)
const total = ref(0)
async function get() {
  const countres = await request({
    apiPath: '/admin/getPushlogCount',
    body: {
      accessToken: accesstoken,
      pushId: id
    }
  })
  total.value = countres.count
  const res = await request({
    apiPath: '/admin/getPushlogList',
    body: {
      accessToken: accesstoken,
      pushId: id,
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
function currentpageChange(t) {
  currentpage.value = t
  get()
}
function pagesizeChange(t) {
  pagesize.value = t
  get()
}
function error(error) {
  TinyModal.alert({
    status: 'error',
    title: '失败原因',
    message: error
  })
}
async function revokePush(id) {
  await request({
    apiPath: '/admin/revokePush',
    body: {
      accessToken: accesstoken,
      id: id
    }
  })
  TinyModal.message({
    message: '撤回成功',
    status: 'success'
  })
  get()
}
async function deletePush(id) {
  await request({
    apiPath: '/admin/deletePushlog',
    body: {
      accessToken: accesstoken,
      id: id
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
    <tiny-breadcrumb>
      <tiny-breadcrumb-item :to="{ path: '/product/admin/pushlist' }" label="产品推送管理"></tiny-breadcrumb-item>
      <tiny-breadcrumb-item :to="{ path: '/product/admin/pushloglist' }" label="推送日志"></tiny-breadcrumb-item>
    </tiny-breadcrumb>
    <tiny-grid :data="data">
      <tiny-grid-column field="title" title="标题" align="center" show-overflow></tiny-grid-column>
      <tiny-grid-column field="body" title="内容" align="center" show-overflow></tiny-grid-column>
      <tiny-grid-column field="url" title="链接" align="center" show-overflow></tiny-grid-column>
      <tiny-grid-column field="badge" title="桌面角标" align="center" format-text="boole"></tiny-grid-column>
      <tiny-grid-column field="foregroundshow" title="前台展示" align="center" format-text="boole"></tiny-grid-column>
      <tiny-grid-column field="test" title="测试" align="center" format-text="boole"></tiny-grid-column>
      <tiny-grid-column title="状态" align="center">
        <template #default="{ row }">
          <tiny-tag v-if="row.status == 'pending'" type="info">待推送</tiny-tag>
          <tiny-tag v-if="row.status == 'success'" type="success">推送成功</tiny-tag>
          <tiny-tag v-if="row.status == 'fail'" type="danger">推送失败</tiny-tag>
          <tiny-tag v-if="row.status == 'revoke'" type="warning">已撤回</tiny-tag>
        </template>
      </tiny-grid-column>
      <tiny-grid-column field="createDate" title="创建时间" align="center" format-text="longDateTime"></tiny-grid-column>
      <tiny-grid-column field="pushDate" title="推送时间" align="center" format-text="longDateTime"></tiny-grid-column>
      <tiny-grid-column field="pushTokenCount" title="推送用户数" align="center"></tiny-grid-column>
      <tiny-grid-column title="操作" align="center">
        <template #default="{ row }">
          <div class="czsp">
            <tiny-button v-if="row.status == 'fail'" type="info" @click="error(row.error)">原因</tiny-button>
            <tiny-button v-if="row.status == 'success'" type="warning" @click="revokePush(row._id)">撤回</tiny-button>
            <tiny-button v-if="row.status != 'pending' && row.status != 'success'" type="danger"
              @click="deletePush(row._id)">删除</tiny-button>
          </div>
        </template>
      </tiny-grid-column>
    </tiny-grid>
    <tiny-pager mode="number" :current-page="currentpage" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]"
      :total="total" @current-change="currentpageChange" @size-change="pagesizeChange"></tiny-pager>
  </div>
</template>