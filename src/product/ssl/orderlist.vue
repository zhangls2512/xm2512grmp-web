<script setup>
document.title = '轩铭2512 - SSL 证书 - 订单管理'
import { ref } from 'vue'
import cookie from 'js-cookie'
import validator from 'validator'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const data = ref([])
const currentpage = ref(1)
const pagesize = ref(10)
const total = ref(0)
const domain = ref('')
const status = ref('')
const statuss = ref([
  {
    value: '',
    label: '全部'
  },
  {
    value: 'pending',
    label: '待授权'
  },
  {
    value: 'ready',
    label: '待提交'
  },
  {
    value: 'invalid',
    label: '已失效'
  },
  {
    value: 'processing',
    label: '签发中'
  },
  {
    value: 'valid',
    label: '已签发'
  },
  {
    value: 'expired',
    label: '已过期'
  }
])
async function get() {
  const countres = await request({
    apiPath: '/ssl/getOrderCount',
    body: {
      accessToken: accesstoken,
      domain: domain.value,
      status: status.value
    }
  })
  total.value = countres.count
  const res = await request({
    apiPath: '/ssl/getOrderList',
    body: {
      accessToken: accesstoken,
      domain: domain.value,
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
function search() {
  if (!validator.isFQDN(domain.value, {
    allow_wildcard: true
  }) && !validator.isIP(domain.value) && domain.value !== '') {
    TinyModal.message({
      message: '请输入有效的域名 / IP 地址',
      status: 'warning'
    })
    return
  }
  get()
}
function newOrder() {
  router.push('/product/ssl/neworder')
}
function authorization(id) {
  router.push('/product/ssl/authorization?id=' + id)
}
function info(id) {
  router.push('/product/ssl/orderinfo?id=' + id)
}
async function submit(id) {
  await request({
    apiPath: '/ssl/submitOrder',
    body: {
      accessToken: accesstoken,
      id: id
    }
  })
  TinyModal.message({
    message: '提交成功',
    status: 'success'
  })
  get()
}
async function deleteOrder(id) {
  await request({
    apiPath: '/ssl/deleteOrder',
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
    <div><tiny-button type="success" @click="newOrder">新增</tiny-button></div>
    <div class="sp">
      <tiny-input v-model="domain" clearable placeholder="请输入域名 / IP 地址"></tiny-input>
      <tiny-base-select v-model="status">
        <tiny-option v-for="item in statuss" :value="item.value" :label="item.label"></tiny-option>
      </tiny-base-select>
      <tiny-button type="info" @click="search">搜索</tiny-button>
    </div>
    <tiny-grid :data="data">
      <tiny-grid-column field="domains" title="域名、IP 地址" align="center" show-overflow></tiny-grid-column>
      <tiny-grid-column field="desc" title="备注" align="center" show-overflow></tiny-grid-column>
      <tiny-grid-column title="状态" align="center">
        <template #default="{ row }">
          <tiny-tag v-if="row.status == 'pending'" type="info">待授权</tiny-tag>
          <tiny-tag v-if="row.status == 'ready'" type="info">待提交</tiny-tag>
          <tiny-tag v-if="row.status == 'invalid'" type="danger">已失效</tiny-tag>
          <tiny-tag v-if="row.status == 'processing'" type="warning">签发中</tiny-tag>
          <tiny-tag v-if="row.status == 'valid'" type="success">已签发</tiny-tag>
          <tiny-tag v-if="row.status == 'expired'" type="warning">已过期</tiny-tag>
        </template>
      </tiny-grid-column>
      <tiny-grid-column field="createDate" title="创建时间" align="center" format-text="longDateTime"></tiny-grid-column>
      <tiny-grid-column title="操作" align="center">
        <template #default="{ row }">
          <div class="czsp">
            <tiny-button type="info" @click="info(row._id)">详情</tiny-button>
            <tiny-button type="warning" @click="authorization(row._id)">授权</tiny-button>
            <tiny-button v-if="row.status == 'ready'" type="success" @click="submit(row._id)">提交</tiny-button>
            <tiny-popconfirm v-if="row.status != 'processing'" title="提示" message="删除后无法恢复，确定删除？" type="warning"
              trigger="hover" @confirm="deleteOrder(row._id)">
              <template #reference>
                <tiny-button type="danger">删除</tiny-button>
              </template>
            </tiny-popconfirm>
          </div>
        </template>
      </tiny-grid-column>
    </tiny-grid>
    <tiny-pager mode="number" :current-page="currentpage" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]"
      :total="total" @current-change="currentpageChange" @size-change="pagesizeChange"></tiny-pager>
  </div>
</template>