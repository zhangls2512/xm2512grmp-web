<script setup>
document.title = '轩铭2512 - 管理后台 - 违规记录管理'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const data = ref([])
const currentpage = ref(1)
const pagesize = ref(10)
const total = ref(0)
const id = ref('')
const uid = ref('')
async function get() {
  const countres = await request({
    apiPath: '/admin/getBanlogCount',
    body: {
      accessToken: accesstoken,
      id: id.value,
      uid: uid.value
    }
  })
  total.value = countres.count
  const res = await request({
    apiPath: '/admin/getBanlogList',
    body: {
      accessToken: accesstoken,
      id: id.value,
      uid: uid.value,
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
function newBanlog() {
  router.push('/product/admin/newbanlog')
}
async function deleteBanlog(t) {
  await request({
    apiPath: '/admin/deleteBanlog',
    body: {
      accessToken: accesstoken,
      id: t
    }
  })
  TinyMessage({
    message: '删除成功',
    status: 'success'
  })
  get()
}
</script>

<template>
  <div class="cz">
    <div><tiny-button type="info" @click="newBanlog">新增</tiny-button></div>
    <div class="sp">
      <tiny-input v-model="id" clearable placeholder="请输入记录 ID"></tiny-input>
      <tiny-input v-model="uid" clearable placeholder="请输入 UID"></tiny-input>
      <tiny-button type="info" @click="get">搜索</tiny-button>
    </div>
    <tiny-grid :data="data">
      <tiny-grid-column field="_id" title="记录ID" align="center"></tiny-grid-column>
      <tiny-grid-column field="uid" title="UID" align="center"></tiny-grid-column>
      <tiny-grid-column field="content" title="违规内容" show-overflow align="center"></tiny-grid-column>
      <tiny-grid-column field="method" title="处罚方式" show-overflow align="center"></tiny-grid-column>
      <tiny-grid-column field="date" title="时间" align="center" format-text="longDateTime"></tiny-grid-column>
      <tiny-grid-column title="操作" align="center">
        <template #default="{ row }">
          <tiny-popconfirm title="提示" message="删除后无法恢复，确定删除？" type="warning" trigger="hover"
            @confirm="deleteBanlog(row._id)">
            <template #reference>
              <tiny-button type="danger">删除</tiny-button>
            </template>
          </tiny-popconfirm>
        </template>
      </tiny-grid-column>
    </tiny-grid>
    <tiny-pager mode="number" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]" :current-page="currentpage"
      :total="total" @current-change="currentpageChange" @size-change="pagesizeChange"></tiny-pager>
  </div>
</template>