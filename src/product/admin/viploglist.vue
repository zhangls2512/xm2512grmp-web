<script setup>
document.title = '轩铭2512 - 管理后台 - 产品会员管理 - 开通记录'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
const accesstoken = cookie.get('accessToken')
const data = ref([])
const currentpage = ref(1)
const pagesize = ref(10)
const total = ref(0)
const product = ref('')
const uid = ref('')
const date = ref([])
const products = ref([
  {
    value: '',
    label: '全部'
  },
  {
    value: 'password',
    label: '密码智能备忘录'
  }
])
function formatDuration(t) {
  const duration = t.cellValue
  if (duration == 0) {
    return '终身'
  }
  if (duration > 0) {
    return duration + ' 天'
  }
}
async function get() {
  let startdate = 0
  let enddate = Date.now()
  if (date.value && date.value.length > 0) {
    startdate = date.value[0].getTime()
    enddate = date.value[1].getTime()
  }
  const countres = await request({
    apiPath: '/admin/getViplogCount',
    body: {
      accessToken: accesstoken,
      product: product.value,
      uid: uid.value,
      startDate: startdate,
      endDate: enddate
    }
  })
  total.value = countres.count
  const res = await request({
    apiPath: '/admin/getViplogList',
    body: {
      accessToken: accesstoken,
      uid: uid.value,
      product: product.value,
      startDate: startdate,
      endDate: enddate,
      skip: (currentpage.value - 1) * pagesize.value,
      limit: pagesize.value
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  const productmap = {
    password: '密码智能备忘录'
  }
  const typemap = {
    pay: '付费',
    vipcode: '兑换码'
  }
  data.value = res.data.map(item => ({
    ...item,
    product: productmap[item.product],
    type: typemap[item.type]
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
</script>

<template>
  <div class="cz">
    <div class="sp">
      <tiny-base-select v-model="product">
        <tiny-option v-for="item in products" :value="item.value" :label="item.label"></tiny-option>
      </tiny-base-select>
      <tiny-input v-model="uid" clearable placeholder="请输入 UID"></tiny-input>
      <tiny-date-picker v-model="date" type="datetimerange"></tiny-date-picker>
      <tiny-button type="info" @click="get">搜索</tiny-button>
    </div>
    <tiny-grid :data="data">
      <tiny-grid-column field="product" title="产品" align="center"></tiny-grid-column>
      <tiny-grid-column field="uid" title="UID" align="center"></tiny-grid-column>
      <tiny-grid-column field="duration" title="时长" align="center" :format-text="formatDuration"></tiny-grid-column>
      <tiny-grid-column field="type" title="类型" align="center"></tiny-grid-column>
      <tiny-grid-column field="info" title="详情" align="center"></tiny-grid-column>
      <tiny-grid-column field="date" title="时间" align="center" format-text="longDateTime"></tiny-grid-column>
    </tiny-grid>
    <tiny-pager mode="number" :current-page="currentpage" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]"
      :total="total" @current-change="currentpageChange" @size-change="pagesizeChange"></tiny-pager>
  </div>
</template>