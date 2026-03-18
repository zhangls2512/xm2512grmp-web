<script setup>
document.title = '轩铭2512 - 管理后台 - 资源管理'
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
const reviewstatus = ref('')
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
    value: 'invalid',
    label: '审核不通过'
  }
])
async function get() {
  if (id.value && id.value.length != 32) {
    TinyModal.message({
      message: '请输入有效的 ID',
      status: 'warning'
    })
    return
  }
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
async function release(id) {
  await request({
    apiPath: '/admin/releaseResource',
    body: {
      accessToken: accesstoken,
      id: id
    }
  })
  TinyModal.message({
    message: '上架成功',
    status: 'success'
  })
  get()
}
async function unrelease(id) {
  await request({
    apiPath: '/admin/unreleaseResource',
    body: {
      accessToken: accesstoken,
      id: id
    }
  })
  TinyModal.message({
    message: '下架成功',
    status: 'success'
  })
  get()
}
function update(id) {
  router.push('/product/admin/updateresource?id=' + id)
}
async function deleteResource(id) {
  await request({
    apiPath: '/admin/deleteResource',
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
    <div class="sp">
      <tiny-base-select v-model="releasestatus">
        <tiny-option v-for="item in releasestatuss" :value="item.value" :label="item.label"></tiny-option>
      </tiny-base-select>
      <tiny-base-select v-model="reviewstatus">
        <tiny-option v-for="item in reviewstatuss" :value="item.value" :label="item.label"></tiny-option>
      </tiny-base-select>
      <tiny-input v-model="id" clearable minlength="32" maxlength="32" placeholder="请输入 ID"></tiny-input>
      <tiny-input v-model="keyword" clearable placeholder="请输入名称"></tiny-input>
      <tiny-button type="info" @click="get">搜索</tiny-button>
    </div>
    <tiny-grid :data="data">
      <tiny-grid-column field="name" title="名称" align="center"></tiny-grid-column>
      <tiny-grid-column title="线上版本状态" align="center">
        <template #default="{ row }">
          <tiny-tag v-if="row.releaseStatus == 'release'" type="success">已上架</tiny-tag>
          <tiny-tag v-if="row.releaseStatus == 'unrelease'" type="info">未上架</tiny-tag>
        </template>
      </tiny-grid-column>
      <tiny-grid-column title="审核版本状态" align="center">
        <template #default="{ row }">
          <tiny-tag v-if="row.reviewStatus == 'pending'" type="info">待提交审核</tiny-tag>
          <tiny-tag v-if="row.reviewStatus == 'processing'" type="warning">审核中</tiny-tag>
          <tiny-tag v-if="row.reviewStatus == 'invalid'" type="danger">审核不通过</tiny-tag>
        </template>
      </tiny-grid-column>
      <tiny-grid-column field="createDate" title="创建时间" align="center" format-text="longDateTime"></tiny-grid-column>
      <tiny-grid-column title="操作" align="center">
        <template #default="{ row }">
          <div class="czsp">
            <tiny-button type="info" @click="info(row._id)">详情</tiny-button>
            <tiny-button v-if="row.releaseStatus == 'unrelease' && row.name != ''" type="success"
              @click="release(row._id)">上架</tiny-button>
            <tiny-button v-if="row.releaseStatus == 'release'" type="danger"
              @click="unrelease(row._id)">下架</tiny-button>
            <tiny-button type="info" v-if="!row.uid" @click="update(row._id)">修改</tiny-button>
            <tiny-popconfirm v-if="row.releaseStatus == 'unrelease' && !row.uid" title="提示" message="删除成功后无法恢复，确定删除？"
              type="warning" trigger="hover" @confirm="deleteResource(row._id)">
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