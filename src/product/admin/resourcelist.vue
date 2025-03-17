<script setup>
document.title = '轩铭2512 - 管理后台 - 资源管理 - 资源管理'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const data = ref([])
const currentpage = ref(1)
const pagesize = ref(10)
const total = ref(0)
const id = ref('')
const keyword = ref('')
const releasestatus = ref('')
const reviewstatus = ref([])
const releasestatuss = ref([
  {
    value: '',
    label: '全部'
  },
  {
    value: 'release',
    label: '已上架'
  },
  {
    value: 'unrelease',
    label: '未上架'
  },
  {
    value: 'ban',
    label: '已封禁'
  }
])
const reviewstatuss = ref([
  {
    value: '',
    label: '全部'
  },
  {
    value: 'pending',
    label: '待提交审核'
  },
  {
    value: 'processing',
    label: '审核中'
  },
  {
    value: 'valid',
    label: '审核通过'
  },
  {
    value: 'invalid',
    label: '审核不通过'
  }
])
async function get() {
  const countres = await request({
    apiPath: '/admin/getResourceCount',
    body: {
      accessToken: accesstoken,
      id: id.value,
      keyword: keyword.value,
      releaseStatus: releasestatus.value,
      reviewStatus: reviewstatus.value
    }
  })
  total.value = countres.count
  const res = await request({
    apiPath: '/admin/getResourceList',
    body: {
      accessToken: accesstoken,
      id: id.value,
      keyword: keyword.value,
      releaseStatus: releasestatus.value,
      reviewStatus: reviewstatus.value,
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
function info(id) {
  router.push('/product/admin/resourceinfo?id=' + id)
}
</script>

<template>
  <div class="cz">
    <div class="sp">
      <tiny-input v-model="id" clearable placeholder="请输入资源 ID"></tiny-input>
      <tiny-base-select v-model="releasestatus">
        <tiny-option v-for="item in releasestatuss" :value="item.value" :label="item.label"></tiny-option>
      </tiny-base-select>
      <tiny-base-select v-model="reviewstatus">
        <tiny-option v-for="item in reviewstatuss" :value="item.value" :label="item.label"></tiny-option>
      </tiny-base-select>
      <tiny-search v-model="keyword" clearable placeholder="名称" @search="get"></tiny-search>
    </div>
    <tiny-grid :data="data">
      <tiny-grid-column field="name" title="名称" align="center"></tiny-grid-column>
      <tiny-grid-column title="线上版本状态" align="center">
        <template #default="{ row }">
          <tiny-tag v-if="row.releaseStatus == 'release'" type="success">已上架</tiny-tag>
          <tiny-tag v-if="row.releaseStatus == 'unrelease'" type="info">未上架</tiny-tag>
          <tiny-tag v-if="row.releaseStatus == 'ban'" type="danger">已封禁</tiny-tag>
        </template>
      </tiny-grid-column>
      <tiny-grid-column title="审核版本状态" align="center">
        <template #default="{ row }">
          <tiny-tag v-if="row.reviewStatus == 'pending'" type="info">待提交审核</tiny-tag>
          <tiny-tag v-if="row.reviewStatus == 'processing'" type="warning">审核中</tiny-tag>
          <tiny-tag v-if="row.reviewStatus == 'valid'" type="success">审核通过</tiny-tag>
          <tiny-tag v-if="row.reviewStatus == 'invalid'" type="danger">审核不通过</tiny-tag>
        </template>
      </tiny-grid-column>
      <tiny-grid-column field="createDate" title="创建时间" align="center" format-text="longDateTime"></tiny-grid-column>
      <tiny-grid-column title="操作" align="center">
        <template #default="{ row }">
          <tiny-button type="info" @click="info(row._id)">详情</tiny-button>
        </template>
      </tiny-grid-column>
    </tiny-grid>
    <tiny-pager mode="number" :current-page="currentpage" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]"
      :total="total" @current-change="currentpageChange" @size-change="pagesizeChange"></tiny-pager>
  </div>
</template>