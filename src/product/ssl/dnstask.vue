<script setup>
document.title = '轩铭2512 - SSL 证书 - DNS 自动配置任务管理'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
const accesstoken = cookie.get('accessToken')
const data = ref([])
const currentpage = ref(1)
const pagesize = ref(10)
const total = ref(0)
const status = ref('')
const statuss = ref([
  {
    value: '',
    label: '全部'
  },
  {
    value: 'setpending',
    label: '待配置解析记录'
  },
  {
    value: 'submitpending',
    label: '待提交挑战验证'
  },
  {
    value: 'setfail',
    label: '配置解析记录失败'
  },
  {
    value: 'submitsuccess',
    label: '已提交挑战验证'
  },
  {
    value: 'submitfail',
    label: '提交挑战验证失败'
  },
  {
    value: 'manualend',
    label: '手动结束'
  },
  {
    value: 'autoend',
    label: '自动结束'
  },
  {
    value: 'timeoutend',
    label: '超时结束'
  }
])
async function get() {
  const countres = await request({
    apiPath: '/ssl/getDnsTaskCount',
    body: {
      accessToken: accesstoken,
      status: status.value
    }
  })
  total.value = countres.count
  const res = await request({
    apiPath: '/ssl/getDnsTaskList',
    body: {
      accessToken: accesstoken,
      status: status.value,
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
function orderinfo(orderid) {
  window.open('/product/ssl/orderinfo?id=' + orderid, '_blank')
}
function error(error) {
  TinyModal.alert({
    status: 'error',
    title: '失败原因',
    message: error
  })
}
async function endDnsTask(id) {
  await request({
    apiPath: '/ssl/endDnsTask',
    body: {
      accessToken: accesstoken,
      id: id
    }
  })
  TinyModal.message({
    message: '结束成功',
    status: 'success'
  })
  get()
}
async function deleteDnsTask(id) {
  await request({
    apiPath: '/ssl/deleteDnsTask',
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
    <tiny-alert :closable="false" description="任务执行超时时间 1 小时，超时后会被系统自动结束。只保留最近 7 天的任务，超过 7 天的任务会被系统自动删除。"></tiny-alert>
    <div class="sp">
      <tiny-base-select v-model="status">
        <tiny-option v-for="item in statuss" :value="item.value" :label="item.label"></tiny-option>
      </tiny-base-select>
      <tiny-button type="info" @click="get">搜索</tiny-button>
    </div>
    <tiny-grid :data="data">
      <tiny-grid-column field="_id" title="ID" align="center"></tiny-grid-column>
      <tiny-grid-column field="domain" title="域名" align="center"></tiny-grid-column>
      <tiny-grid-column title="状态" align="center">
        <template #default="{ row }">
          <tiny-tag v-if="row.status == 'setpending'" type="warning">待配置解析记录</tiny-tag>
          <tiny-tag v-if="row.status == 'submitpending'" type="warning">待提交挑战验证</tiny-tag>
          <tiny-tag v-if="row.status == 'setfail'" type="danger">配置解析记录失败</tiny-tag>
          <tiny-tag v-if="row.status == 'submitsuccess'" type="success">已提交挑战验证</tiny-tag>
          <tiny-tag v-if="row.status == 'submitfail'" type="danger">提交挑战验证失败</tiny-tag>
          <tiny-tag v-if="row.status == 'manualend'" type="danger">手动结束</tiny-tag>
          <tiny-tag v-if="row.status == 'autoend'" type="danger">自动结束</tiny-tag>
          <tiny-tag v-if="row.status == 'timeoutend'" type="danger">超时结束</tiny-tag>
        </template>
      </tiny-grid-column>
      <tiny-grid-column field="updateDate" title="更新时间" align="center" format-text="longDateTime"></tiny-grid-column>
      <tiny-grid-column title="操作" align="center">
        <template #default="{ row }">
          <div class="czsp">
            <tiny-button type="info" @click="orderinfo(row.orderId)">订单</tiny-button>
            <tiny-button v-if="row.status == 'setfail' || row.status == 'submitfail'" type="info"
              @click="error(row.error)">原因</tiny-button>
            <tiny-button v-if="row.status == 'setpending' || row.status == 'submitpending'" type="danger"
              @click="endDnsTask(row._id)">结束</tiny-button>
            <tiny-button v-if="row.status != 'setpending' && row.status != 'submitpending'" type="danger"
              @click="deleteDnsTask(row._id)">删除</tiny-button>
          </div>
        </template>
      </tiny-grid-column>
    </tiny-grid>
    <tiny-pager mode="number" :current-page="currentpage" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]"
      :total="total" @current-change="currentpageChange" @size-change="pagesizeChange"></tiny-pager>
  </div>
</template>