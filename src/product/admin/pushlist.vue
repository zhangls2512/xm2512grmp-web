<script setup>
document.title = '轩铭2512 - 管理后台 - 产品推送管理'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const data = ref([])
const currentpage = ref(1)
const pagesize = ref(10)
const total = ref(0)
const product = ref('')
const products = ref([
  {
    value: '',
    label: '全部'
  },
  {
    value: 'password',
    label: '密码智能备忘录'
  },
  {
    value: 'synologydsmhelper',
    label: 'SynDSM 助手'
  }
])
async function get() {
  const countres = await request({
    apiPath: '/admin/getPushCount',
    body: {
      accessToken: accesstoken,
      product: product.value
    }
  })
  total.value = countres.count
  const res = await request({
    apiPath: '/admin/getPushList',
    body: {
      accessToken: accesstoken,
      product: product.value,
      skip: (currentpage.value - 1) * pagesize.value,
      limit: pagesize.value
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  const productmap = {
    password: '密码智能备忘录',
    synologydsmhelper: 'SynDSM 助手'
  }
  data.value = res.data.map(item => ({
    ...item,
    product: productmap[item.product]
  }))
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
function sendpush(id) {
  router.push('/product/admin/sendpush?id=' + id)
}
function pushloglist(id) {
  router.push('/product/admin/pushloglist?id=' + id)
}
</script>

<template>
  <div class="cz">
    <div class="sp">
      <tiny-base-select v-model="product">
        <tiny-option v-for="item in products" :value="item.value" :label="item.label"></tiny-option>
      </tiny-base-select>
      <tiny-button type="info" @click="get">搜索</tiny-button>
    </div>
    <tiny-grid :data="data">
      <tiny-grid-column field="_id" title="ID" align="center"></tiny-grid-column>
      <tiny-grid-column field="product" title="产品" align="center"></tiny-grid-column>
      <tiny-grid-column field="name" title="名称" align="center"></tiny-grid-column>
      <tiny-grid-column field="desc" title="描述" align="center" show-overflow></tiny-grid-column>
      <tiny-grid-column field="pushTokenCount" title="订阅用户数" align="center"></tiny-grid-column>
      <tiny-grid-column title="操作" align="center">
        <template #default="{ row }">
          <div class="czsp">
            <tiny-button type="success" @click="sendpush(row._id)">推送</tiny-button>
            <tiny-button type="info" @click="pushloglist(row._id)">日志</tiny-button>
          </div>
        </template>
      </tiny-grid-column>
    </tiny-grid>
    <tiny-pager mode="number" :current-page="currentpage" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]"
      :total="total" @current-change="currentpageChange" @size-change="pagesizeChange"></tiny-pager>
  </div>
</template>