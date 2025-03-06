<script setup>
document.title = '轩铭2512 - SSL 证书 - ACME 账户管理'
import { ref } from 'vue'
import cookie from 'js-cookie'
import callfunction from '../../callfunction'
const accesstoken = cookie.get('accessToken')
const production = ref('')
const staging = ref('')
async function getAcmeAccountInfo() {
  const res = await callfunction({
    functionName: 'getAcmeAccountInfo',
    data: {
      accessToken: accesstoken
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  production.value = res.production
  staging.value = res.staging
}
getAcmeAccountInfo()
function copy(id) {
  navigator.clipboard.writeText(id)
  TinyModal.message({
    message: '内容已复制',
    status: 'success'
  })
}
function deactivateAccount(type) {
  TinyModal.confirm({
    status: 'warning',
    title: '提示',
    message: '停用后无法恢复，确定停用？',
    events: {
      async confirm() {
        await callfunction({
          functionName: 'deactivateAcmeAccount',
          data: {
            accessToken: accesstoken,
            accountType: type
          }
        })
        TinyModal.message({
          message: '停用成功',
          status: 'success'
        })
        getAcmeAccountInfo()
      }
    }
  })
}
async function newAccount(type) {
  await callfunction({
    functionName: 'newAcmeAccount',
    data: {
      accessToken: accesstoken,
      accountType: type
    }
  })
  TinyModal.message({
    message: '创建成功',
    status: 'success'
  })
  getAcmeAccountInfo()
}
</script>

<template>
  <div class="cz">
    <tiny-alert :closable="false" description="以下功能请在客服引导下使用。"></tiny-alert>
    <div class="large-bold-text">正式</div>
    <div v-if="production.status == 'valid'" class="sp">
      <div class="bold-text">ID</div>
      <div>{{ production.id }}</div>
      <tiny-button type="info" @click="copy(production.id)">复制</tiny-button>
    </div>
    <div class="sp">
      <div class="bold-text">状态</div>
      <tiny-tag v-if="production.status == 'valid'" type="success">可用</tiny-tag>
      <tiny-tag v-if="production.status == 'invalid'" type="danger">停用</tiny-tag>
      <tiny-button v-if="production.status == 'valid'" type="danger"
        @click="deactivateAccount('production')">停用</tiny-button>
      <tiny-button v-if="production.status == 'invalid'" type="success"
        @click="newAccount('production')">创建</tiny-button>
    </div>
    <div class="large-bold-text">测试</div>
    <div v-if="staging.status == 'valid'" class="sp">
      <div class="bold-text">ID</div>
      <div>{{ staging.id }}</div>
      <tiny-button type="info" @click="copy(staging.id)">复制</tiny-button>
    </div>
    <div class="sp">
      <div class="bold-text">状态</div>
      <tiny-tag v-if="staging.status == 'valid'" type="success">可用</tiny-tag>
      <tiny-tag v-if="staging.status == 'invalid'" type="danger">停用</tiny-tag>
      <tiny-button v-if="staging.status == 'valid'" type="danger" @click="deactivateAccount('staging')">停用</tiny-button>
      <tiny-button v-if="staging.status == 'invalid'" type="success" @click="newAccount('staging')">创建</tiny-button>
    </div>
  </div>
</template>