<script setup>
document.title = '轩铭2512 - 统一账号 - 违规记录'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
const accesstoken = cookie.get('accessToken')
const data = ref([])
const currentpage = ref(1)
const pagesize = ref(10)
const total = ref(0)
async function get() {
  const countres = await request({
    apiPath: '/account/getBanlogCount',
    body: {
      accessToken: accesstoken
    }
  })
  total.value = countres.count
  const res = await request({
    apiPath: '/account/getBanlogList',
    body: {
      accessToken: accesstoken,
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
</script>

<template>
  <div class="cz">
    <tiny-alert :closable="false" description="如有异议，可联系客服申诉。"></tiny-alert>
    <tiny-grid :data="data">
      <tiny-grid-column field="_id" title="ID" align="center"></tiny-grid-column>
      <tiny-grid-column field="content" title="违规内容" align="center" show-overflow></tiny-grid-column>
      <tiny-grid-column field="method" title="处罚方式" align="center" show-overflow></tiny-grid-column>
      <tiny-grid-column field="date" title="时间" align="center" format-text="longDateTime"></tiny-grid-column>
    </tiny-grid>
    <tiny-pager mode="number" :current-page="currentpage" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]"
      :total="total" @current-change="currentpageChange" @size-change="pagesizeChange"></tiny-pager>
  </div>
</template>