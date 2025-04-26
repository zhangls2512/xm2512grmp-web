<script setup>
document.title = '轩铭2512 - 管理后台 - 产品会员兑换码'
import { ref } from 'vue'
import cookie from 'js-cookie'
import moment from 'moment-timezone'
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
function formatEnddate(t) {
  const enddate = t.cellValue
  if (enddate == 0) {
    return '永久'
  }
  return moment(enddate).format('YYYY-MM-DD HH:mm:ss')
}
async function get() {
  const countres = await request({
    apiPath: '/admin/getVipcodeCount',
    body: {
      accessToken: accesstoken,
      product: product.value
    }
  })
  total.value = countres.count
  const res = await request({
    apiPath: '/admin/getVipcodeList',
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
    password: '密码智能备忘录'
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
function newVipcode() {
  router.push('/product/admin/newvipcode')
}
function copy(value) {
  navigator.clipboard.writeText(value)
  TinyModal.message({
    message: '内容已复制',
    status: 'success'
  })
}
async function deleteVipcode(t) {
  await request({
    apiPath: '/admin/deleteVipcode',
    body: {
      accessToken: accesstoken,
      id: t
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
    <div><tiny-button type="success" @click="newVipcode">新增</tiny-button></div>
    <div class="sp">
      <tiny-base-select v-model="product">
        <tiny-option v-for="item in products" :value="item.value" :label="item.label"></tiny-option>
      </tiny-base-select>
      <tiny-button type="info" @click="get">搜索</tiny-button>
    </div>
    <tiny-grid :data="data">
      <tiny-grid-column title="兑换码" align="center">
        <template #default="{ row }">
          <tiny-tooltip content="点击复制" placement="top">
            <div style="cursor: pointer" @click="copy(row._id)">{{ row._id }}</div>
          </tiny-tooltip>
        </template>
      </tiny-grid-column>
      <tiny-grid-column field="product" title="产品" align="center"></tiny-grid-column>
      <tiny-grid-column field="duration" title="时长" align="center" :format-text="formatDuration"></tiny-grid-column>
      <tiny-grid-column title="权限" align="center">
        <template #default="{ row }">
          <div v-if="typeof (row.permission) == 'string'">指定用户：{{ row.permission }}</div>
          <div v-if="typeof (row.permission) == 'number'">最大次数：{{ row.permission }}</div>
        </template>
      </tiny-grid-column>
      <tiny-grid-column field="endDate" title="兑换截止时间" align="center" :format-text="formatEnddate"></tiny-grid-column>
      <tiny-grid-column field="date" title="创建时间" align="center" format-text="longDateTime"></tiny-grid-column>
      <tiny-grid-column field="count" title="兑换次数" align="center"></tiny-grid-column>
      <tiny-grid-column title="操作" align="center">
        <template #default="{ row }">
          <tiny-popconfirm title="提示" message="删除后无法恢复，确定删除？" type="warning" trigger="hover"
            @confirm="deleteVipcode(row._id)">
            <template #reference>
              <tiny-button type="danger">删除</tiny-button>
            </template>
          </tiny-popconfirm>
        </template>
      </tiny-grid-column>
    </tiny-grid>
    <tiny-pager mode="number" :current-page="currentpage" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]"
      :total="total" @current-change="currentpageChange" @size-change="pagesizeChange"></tiny-pager>
  </div>
</template>