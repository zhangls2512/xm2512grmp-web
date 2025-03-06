<script setup>
document.title = '轩铭2512 - SSL 证书 - 额度信息'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
const accesstoken = cookie.get('accessToken')
const production = ref(0)
const staging = ref(0)
const data = ref([])
const currentpage = ref(1)
const pagesize = ref(10)
const total = ref(0)
const changetype = ref('')
const date = ref([])
const changetypes = ref([
  {
    value: '',
    label: '全部'
  },
  {
    value: 'add',
    label: '加'
  },
  {
    value: 'minus',
    label: '减'
  }
])
async function getUserInfo() {
  const res = await request({
    apiPath: '/product/getUserInfo',
    body: {
      accessToken: accesstoken,
      product: 'ssl'
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  production.value = res.data.productionLimit
  staging.value = res.data.stagingLimit
}
async function getLimitChange() {
  let startdate = 0
  let enddate = Date.now()
  if (date.value && date.value.length > 0) {
    startdate = date.value[0].getTime()
    enddate = date.value[1].getTime()
  }
  const countres = await request({
    apiPath: '/ssl/getLimitChangeCount',
    body: {
      accessToken: accesstoken,
      changeType: changetype.value,
      startDate: startdate,
      endDate: enddate
    }
  })
  total.value = countres.count
  const res = await request({
    apiPath: '/ssl/getLimitChangeList',
    body: {
      accessToken: accesstoken,
      changeType: changetype.value,
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
  const changetypemap = {
    add: '加',
    minus: '减'
  }
  data.value = res.data.map(item => ({
    ...item,
    changeType: changetypemap[item.changeType]
  }))
}
function get() {
  getUserInfo()
  getLimitChange()
}
get()
function currentpageChange(t) {
  currentpage.value = t
  getLimitChange()
}
function pagesizeChange(t) {
  pagesize.value = t
  getLimitChange()
}
</script>

<template>
  <div class="cz">
    <div class="large-bold-text">当前剩余</div>
    <div class="sp">
      <div class="bold-text">正式</div>
      <div>{{ production }}</div>
    </div>
    <tiny-alert :closable="false" description="选择使用正式环境新增订单时消耗。如需提高请联系客服。"></tiny-alert>
    <div class="sp">
      <div class="bold-text">测试</div>
      <div>{{ staging }}</div>
    </div>
    <tiny-alert :closable="false" description="选择使用测试环境新增订单时消耗。仅供测试使用，用完即无，不支持提高。"></tiny-alert>
    <div class="large-bold-text">变更记录</div>
    <div class="sp">
      <tiny-base-select v-model="changetype">
        <tiny-option v-for="item in changetypes" :value="item.value" :label="item.label"></tiny-option>
      </tiny-base-select>
      <tiny-date-picker v-model="date" type="datetimerange"></tiny-date-picker>
      <tiny-button type="info" @click="getLimitChange">搜索</tiny-button>
    </div>
    <tiny-grid :data="data">
      <tiny-grid-column field="changeType" title="类型" align="center"></tiny-grid-column>
      <tiny-grid-column field="number" title="数量" align="center"></tiny-grid-column>
      <tiny-grid-column field="reason" title="原因" align="center"></tiny-grid-column>
      <tiny-grid-column field="date" title="时间" align="center" format-text="longDateTime"></tiny-grid-column>
    </tiny-grid>
    <tiny-pager mode="number" :current-page="currentpage" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]"
      :total="total" @current-change="currentpageChange" @size-change="pagesizeChange"></tiny-pager>
  </div>
</template>