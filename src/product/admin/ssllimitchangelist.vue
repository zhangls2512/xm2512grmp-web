<script setup>
document.title = '轩铭2512 - 管理后台 - SSL 证书额度管理'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const data = ref([])
const currentpage = ref(1)
const pagesize = ref(10)
const total = ref(0)
const uid = ref('')
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
async function get() {
  if (uid.value && uid.value.length != 32) {
    TinyModal.message({
      message: '请输入有效的 UID',
      status: 'warning'
    })
    return
  }
  let startdate = 0
  let enddate = Date.now()
  if (date.value && date.value.length > 0) {
    startdate = date.value[0].getTime()
    enddate = date.value[1].getTime()
  }
  const countres = await request({
    apiPath: '/admin/getSslLimitChangeCount',
    body: {
      accessToken: accesstoken,
      uid: uid.value,
      changeType: changetype.value,
      startDate: startdate,
      endDate: enddate
    }
  })
  total.value = countres.count
  const res = await request({
    apiPath: '/admin/getSslLimitChangeList',
    body: {
      accessToken: accesstoken,
      uid: uid.value,
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
get()
function currentpageChange(t) {
  currentpage.value = t
  get()
}
function pagesizeChange(t) {
  pagesize.value = t
  get()
}
function newLimitChange() {
  router.push('/product/admin/sslnewlimitchange')
}
</script>

<template>
  <div class="cz">
    <div><tiny-button type="success" @click="newLimitChange">新增</tiny-button></div>
    <div class="sp">
      <tiny-input v-model="uid" clearable minlength="32" maxlength="32" placeholder="请输入 UID"></tiny-input>
      <tiny-base-select v-model="changetype">
        <tiny-option v-for="item in changetypes" :value="item.value" :label="item.label"></tiny-option>
      </tiny-base-select>
      <tiny-date-picker v-model="date" type="datetimerange"></tiny-date-picker>
      <tiny-button type="info" @click="get">搜索</tiny-button>
    </div>
    <tiny-grid :data="data">
      <tiny-grid-column field="uid" title="UID" align="center"></tiny-grid-column>
      <tiny-grid-column field="changeType" title="类型" align="center"></tiny-grid-column>
      <tiny-grid-column field="number" title="数量" align="center"></tiny-grid-column>
      <tiny-grid-column field="reason" title="原因" align="center"></tiny-grid-column>
      <tiny-grid-column field="date" title="时间" align="center" format-text="longDateTime"></tiny-grid-column>
    </tiny-grid>
    <tiny-pager mode="number" :current-page="currentpage" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]"
      :total="total" @current-change="currentpageChange" @size-change="pagesizeChange"></tiny-pager>
  </div>
</template>