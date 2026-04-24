<script setup>
document.title = '轩铭2512 - 管理后台 - 产品用户列表 - SSL 证书'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
const accesstoken = cookie.get('accessToken')
const data = ref([])
const currentpage = ref(1)
const pagesize = ref(10)
const total = ref(0)
const uid = ref('')
async function get() {
  const countres = await request({
    apiPath: '/admin/getProductUserCount',
    body: {
      accessToken: accesstoken,
      product: 'ssl'
    }
  })
  total.value = countres.count
  const res = await request({
    apiPath: '/admin/getProductUserList',
    body: {
      accessToken: accesstoken,
      product: 'ssl',
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
async function search() {
  if (!uid.value) {
    get()
    return
  }
  if (uid.value && uid.value.length != 32) {
    TinyModal.message({
      message: '请输入有效的 UID',
      status: 'warning'
    })
    return
  }
  const userres = await request({
    apiPath: '/admin/searchProductUser',
    body: {
      accessToken: accesstoken,
      product: 'ssl',
      uid: uid.value
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  data.value = userres.data
}
</script>

<template>
  <div class="cz">
    <div class="sp">
      <tiny-input v-model="uid" clearable minlength="32" maxlength="32" placeholder="请输入 UID"></tiny-input>
      <tiny-button type="info" @click="search">搜索</tiny-button>
    </div>
    <tiny-grid :data="data">
      <tiny-grid-column field="uid" title="UID" align="center"></tiny-grid-column>
      <tiny-grid-column field="productionLimit" title="正式剩余额度" align="center"></tiny-grid-column>
      <tiny-grid-column field="stagingLimit" title="测试剩余额度" align="center"></tiny-grid-column>
    </tiny-grid>
    <tiny-pager mode="number" :current-page="currentpage" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]"
      :total="total" @current-change="currentpageChange" @size-change="pagesizeChange"></tiny-pager>
  </div>
</template>