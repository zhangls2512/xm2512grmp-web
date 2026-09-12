<script setup>
document.title = '轩铭2512 - 管理后台 - SSL 证书支付订单管理'
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
  if (uid.value && uid.value.length != 32) {
    TinyModal.message({
      message: '请输入有效的 UID',
      status: 'warning'
    })
    return
  }
  const countres = await request({
    apiPath: '/admin/getSslPayOrderCount',
    body: {
      accessToken: accesstoken,
      uid: uid.value
    }
  })
  total.value = countres.count
  const res = await request({
    apiPath: '/admin/getSslPayOrderList',
    body: {
      accessToken: accesstoken,
      uid: uid.value,
      skip: (currentpage.value - 1) * pagesize.value,
      limit: pagesize.value
    }
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
    <div class="sp">
      <tiny-input v-model="uid" clearable minlength="32" maxlength="32" placeholder="请输入 UID"></tiny-input>
      <tiny-button type="info" @click="get">搜索</tiny-button>
    </div>
    <tiny-grid :data="data">
      <tiny-grid-column field="uid" title="UID" align="center"></tiny-grid-column>
      <tiny-grid-column field="orderId" title="订单ID" align="center"></tiny-grid-column>
      <tiny-grid-column field="productId" title="商品ID" align="center"></tiny-grid-column>
      <tiny-grid-column field="count" title="购买数量" align="center"></tiny-grid-column>
      <tiny-grid-column field="createTime" title="创建时间" align="center" format-text="longDateTime"></tiny-grid-column>
      <tiny-grid-column field="wxOrderId" title="微信订单ID" align="center"></tiny-grid-column>
      <tiny-grid-column field="finishTime" title="完成时间" align="center" format-text="longDateTime"></tiny-grid-column>
      <tiny-grid-column field="finished" title="是否完成" align="center" format-text="boole"></tiny-grid-column>
    </tiny-grid>
    <tiny-pager mode="number" :current-page="currentpage" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]"
      :total="total" @current-change="currentpageChange" @size-change="pagesizeChange"></tiny-pager>
  </div>
</template>