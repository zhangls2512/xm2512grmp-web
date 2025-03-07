<script setup>
document.title = '轩铭2512 - SSL 证书 - 授权'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import cookie from 'js-cookie'
import moment from 'moment-timezone'
import callfunction from '../../callfunction'
const route = useRoute()
const id = route.query.id
const accesstoken = cookie.get('accessToken')
const data = ref([])
async function get() {
  const res = await callfunction({
    functionName: 'getSslOrderAuthorization',
    data: {
      accessToken: accesstoken,
      id: id
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  data.value = res.authorization.map(item => ({
    ...item,
    expires: moment(item.expires).format('YYYY-MM-DD HH:mm:ss'),
    challenges: item.challenges.map(item => ({
      ...item,
      validated: moment(item.expires).format('YYYY-MM-DD HH:mm:ss')
    }))
  }))
}
get()
async function deactivateAuthorization(url) {
  await callfunction({
    functionName: 'deactivateSslAuthorization',
    data: {
      accessToken: accesstoken,
      orderId: id,
      url: url
    }
  })
  TinyModal.message({
    message: '停用成功',
    status: 'success'
  })
  get()
}
function copy(value) {
  navigator.clipboard.writeText(value)
  TinyModal.message({
    message: '内容已复制',
    status: 'success'
  })
}
async function respondChallenge(url) {
  await callfunction({
    functionName: 'respondSslChallenge',
    data: {
      accessToken: accesstoken,
      orderId: id,
      url: url
    }
  })
  TinyModal.message({
    message: '提交成功',
    status: 'success'
  })
  get()
}
function error(error) {
  TinyModal.alert({
    status: 'error',
    title: '不通过原因',
    message: error
  })
}
</script>

<template>
  <div class="cz">
    <tiny-breadcrumb>
      <tiny-breadcrumb-item :to="{ path: '/product/ssl/orderlist' }" label="订单管理"></tiny-breadcrumb-item>
      <tiny-breadcrumb-item :to="{ path: '/product/ssl/authorization' }" label="授权"></tiny-breadcrumb-item>
    </tiny-breadcrumb>
    <tiny-alert :closable="false" description="请联系客服获取授权操作步骤。"></tiny-alert>
    <div><tiny-button type="info" @click="get">刷新</tiny-button></div>
    <div v-for="item in data">
      <div class="cz">
        <div class="sp">
          <div class="bold-text">域名 / IP 地址</div>
          <div>{{ item.identifier }}</div>
        </div>
        <div class="sp">
          <div class="bold-text">状态</div>
          <tiny-tag v-if="item.status == 'pending'" type="info">待完成</tiny-tag>
          <tiny-tag v-if="item.status == 'valid'" type="success">已通过</tiny-tag>
          <tiny-tag v-if="item.status == 'invalid'" type="danger">不通过</tiny-tag>
          <tiny-tag v-if="item.status == 'deactivated'" type="danger">已停用</tiny-tag>
          <tiny-tag v-if="item.status == 'expired'" type="warning">已过期</tiny-tag>
          <tiny-tag v-if="item.status == 'revoked'" type="danger">被停用</tiny-tag>
          <tiny-popconfirm v-if="item.status == 'pending' || item.status == 'valid'" title="提示" message="停用后无法恢复，确定停用？"
            type="warning" trigger="hover" @confirm="deactivateAuthorization(item.url)">
            <template #reference>
              <tiny-button type="danger">停用</tiny-button>
            </template>
          </tiny-popconfirm>
        </div>
        <div class="sp">
          <div class="bold-text">截止时间</div>
          <div>{{ item.expires }}</div>
        </div>
        <div class="sp">
          <div class="bold-text">通配符域名</div>
          <div v-if="item.wildcard === true">是</div>
          <div v-if="item.wildcard !== true">否</div>
        </div>
        <tiny-grid :data="item.challenges">
          <tiny-grid-column field="type" title="类型" align="center"></tiny-grid-column>
          <tiny-grid-column title="验证值" align="center">
            <template #default="{ row }">
              <tiny-tooltip content="点击复制" placement="top">
                <div @click="copy(row.token)">{{ row.token }}</div>
              </tiny-tooltip>
            </template>
          </tiny-grid-column>
          <tiny-grid-column title="状态" align="center">
            <template #default="{ row }">
              <tiny-tag v-if="row.status == 'pending'" type="info">待验证</tiny-tag>
              <tiny-tag v-if="row.status == 'processing'" type="warning">验证中</tiny-tag>
              <tiny-tag v-if="row.status == 'valid'" type="success">已通过</tiny-tag>
              <tiny-tag v-if="row.status == 'invalid'" type="danger">不通过</tiny-tag>
            </template>
          </tiny-grid-column>
          <tiny-grid-column title="操作" align="center">
            <template #default="{ row }">
              <div class="czsp">
                <tiny-popconfirm v-if="row.status == 'pending'" title="提示" message="只有一次验证机会，确定验证？" type="warning"
                  trigger="hover" @confirm="respondChallenge(row.url)">
                  <template #reference>
                    <tiny-button type="info">验证</tiny-button>
                  </template>
                </tiny-popconfirm>
                <tiny-button v-if="row.status == 'invalid'" type="info"
                  @click="error(row.error.detail)">原因</tiny-button>
              </div>
            </template>
          </tiny-grid-column>
        </tiny-grid>
      </div>
    </div>
  </div>
</template>