<script setup>
document.title = '轩铭2512 - 资源投稿 - 资源管理'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const data = ref([])
const currentpage = ref(1)
const pagesize = ref(10)
const total = ref(0)
const reviewstatus = ref('')
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
  const countres = await request({
    apiPath: '/resourcecreator/getResourceCount',
    body: {
      accessToken: accesstoken,
      reviewStatus: reviewstatus.value
    }
  })
  total.value = countres.count
  const res = await request({
    apiPath: '/resourcecreator/getResourceList',
    body: {
      accessToken: accesstoken,
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
function newResource(name) {
  router.push('/product/resourcecreator/' + name)
}
function info(id) {
  router.push('/product/resourcecreator/resourceinfo?id=' + id)
}
async function submitReview(id) {
  await request({
    apiPath: '/resourcecreator/submitReviewResource',
    body: {
      accessToken: accesstoken,
      id: id
    }
  })
  TinyModal.message({
    message: '提交审核成功',
    status: 'success'
  })
  get()
}
async function unsubmitReview(id) {
  await request({
    apiPath: '/resourcecreator/unsubmitReviewResource',
    body: {
      accessToken: accesstoken,
      id: id
    }
  })
  TinyModal.message({
    message: '撤回审核成功',
    status: 'success'
  })
  get()
}
function update(id) {
  router.push('/product/resourcecreator/updateresource?id=' + id)
}
async function deleteResource(id) {
  await request({
    apiPath: '/resourcecreator/deleteResource',
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
    <div>
      <tiny-dropdown type="success" border>
        <span>新增</span>
        <template #dropdown>
          <tiny-dropdown-menu placement="bottom-start">
            <tiny-dropdown-item @click="newResource('newresourceeasy')">便捷</tiny-dropdown-item>
            <tiny-dropdown-item @click="newResource('newresource')">完整</tiny-dropdown-item>
          </tiny-dropdown-menu>
        </template>
      </tiny-dropdown>
    </div>
    <div class="sp">
      <tiny-base-select v-model="reviewstatus">
        <tiny-option v-for="item in reviewstatuss" :value="item.value" :label="item.label"></tiny-option>
      </tiny-base-select>
      <tiny-button type="info" @click="get">搜索</tiny-button>
    </div>
    <tiny-grid :data="data">
      <tiny-grid-column title="名称" align="center">
        <template #default="{ row }">
          <div>{{ row.reviewInfo.name }}</div>
        </template>
      </tiny-grid-column>
      <tiny-grid-column title="状态" align="center">
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
            <tiny-button v-if="row.reviewStatus != 'processing'" type="success" :disabled="row.disallowUpdate"
              @click="submitReview(row._id)">提交审核</tiny-button>
            <tiny-button v-if="row.reviewStatus == 'processing'" type="danger"
              @click="unsubmitReview(row._id)">撤回审核</tiny-button>
            <tiny-button v-if="row.reviewStatus != 'processing'" type="info" :disabled="row.disallowUpdate"
              @click="update(row._id)">修改</tiny-button>
            <tiny-popconfirm v-if="row.name == '' && row.reviewStatus != 'processing'" title="提示"
              message="删除后无法恢复，确定删除？" type="warning" trigger="hover" @confirm="deleteResource(row._id)">
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