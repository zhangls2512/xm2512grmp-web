<script setup>
document.title = '轩铭2512 - SSL 证书 - 功能设置'
import { ref } from 'vue'
import cookie from 'js-cookie'
import validator from 'validator'
import request from '../../request'
const accesstoken = cookie.get('accessToken')
const settings = ref({})
const dns = ref([
  {
    platform: 'aliyun',
    platformname: '阿里云',
    keyId: '',
    keySecret: '',
    domains: []
  },
  {
    platform: 'tencentcloud',
    platformname: '腾讯云',
    keyId: '',
    keySecret: '',
    domains: []
  }
])
const dialog = ref(false)
const platform = ref('')
const keyid = ref('')
const keysecret = ref('')
const domains = ref([])
const domain = ref('')
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
  settings.value = res.data.setting
  const dnslist = res.data.dns
  dnslist.forEach(item => {
    if (item.platform == 'aliyun') {
      dns.value[0].keyId = item.keyId
      dns.value[0].keySecret = item.keySecret
      dns.value[0].domains = item.domains
    }
    if (item.platform == 'tencentcloud') {
      dns.value[1].keyId = item.keyId
      dns.value[1].keySecret = item.keySecret
      dns.value[1].domains = item.domains
    }
  })
}
getUserInfo()
async function change(name, value) {
  await request({
    apiPath: '/ssl/updateUserSetting',
    body: {
      accessToken: accesstoken,
      settingName: name,
      settingValue: value
    }
  })
  TinyModal.message({
    message: '设置成功',
    status: 'success'
  })
  getUserInfo()
}
async function deleteUselessStatusOrder() {
  await request({
    apiPath: '/ssl/deleteUselessStatusOrder',
    body: {
      accessToken: accesstoken
    }
  })
  TinyModal.message({
    message: '清理成功',
    status: 'success'
  })
}
async function deleteEndStatusDnsTask() {
  await request({
    apiPath: '/ssl/deleteEndStatusDnsTask',
    body: {
      accessToken: accesstoken
    }
  })
  TinyModal.message({
    message: '清理成功',
    status: 'success'
  })
}
function openDialog(row) {
  dialog.value = true
  platform.value = row.platform
  keyid.value = row.keyId
  keysecret.value = row.keySecret
  domains.value = [...row.domains]
}
function closeDialog() {
  dialog.value = false
  platform.value = ''
  keyid.value = ''
  keysecret.value = ''
  domains.value = []
}
function add() {
  if (!validator.isFQDN(domain.value)) {
    TinyModal.message({
      message: '请输入有效的域名',
      status: 'warning'
    })
    return
  }
  if (domains.value.includes(domain.value)) {
    TinyModal.message({
      message: '域名已存在',
      status: 'warning'
    })
    return
  }
  domains.value.push(domain.value)
  domain.value = ''
}
function remove(index) {
  domains.value.splice(index, 1)
}
async function updateDns() {
  await request({
    apiPath: '/ssl/updateUserDns',
    body: {
      accessToken: accesstoken,
      platform: platform.value,
      keyId: keyid.value,
      keySecret: keysecret.value,
      domains: domains.value
    }
  })
  closeDialog()
  TinyModal.message({
    message: '保存成功',
    status: 'success'
  })
  getUserInfo()
}
</script>

<template>
  <div class="cz">
    <div class="large-bold-text">自动</div>
    <div class="sp">
      <div>自动提交“待提交”状态的订单</div>
      <tiny-switch v-model="settings.autoSubmitOrder" @change="(zt) => change('autoSubmitOrder', zt)"></tiny-switch>
    </div>
    <tiny-alert :closable="false" description="开启后，系统将自动提交“待提交”状态的订单。建议开启。"></tiny-alert>
    <div class="sp">
      <div>自动配置 DNS</div>
      <tiny-switch v-model="settings.autoSetDns" @change="(zt) => change('autoSetDns', zt)"></tiny-switch>
    </div>
    <tiny-alert :closable="false"
      description="开启后，系统将在新增订单成功后添加订单中已在 DNS 中配置的域名到 DNS 自动配置任务队列。系统将自动配置 DNS 解析记录用于完成 dns-01 挑战。"></tiny-alert>
    <div class="sp">
      <div>自动提交挑战验证</div>
      <tiny-radio-group v-model="settings.autoSubmitChallengeVerify"
        @change="(value) => change('autoSubmitChallengeVerify', value)">
        <tiny-radio label="afterverify">验证通过</tiny-radio>
        <tiny-radio label="direct">直接</tiny-radio>
        <tiny-radio label="close">关闭</tiny-radio>
      </tiny-radio-group>
    </div>
    <tiny-alert :closable="false"
      description="选择“验证通过”，系统将自行验证域名 DNS 解析记录是否生效，验证通过才会提交挑战验证；选择“直接”，系统将不自行验证，直接提交挑战验证；选择“关闭”，系统将不自动提交挑战验证。建议选择“验证通过”，降低因 DNS 解析记录生效延迟导致挑战验证不通过使订单失效浪费额度。开启自动配置 DNS 时此功能才会生效。"></tiny-alert>
    <div class="large-bold-text">清理</div>
    <div class="sp">
      <div>清理无用状态的订单</div>
      <tiny-button type="danger" @click="deleteUselessStatusOrder">清理</tiny-button>
    </div>
    <tiny-alert :closable="false" description="无用状态有：已失效、已过期。如果数据较多，可能需要执行多次。"></tiny-alert>
    <div class="sp">
      <div>清理结束状态的 DNS 自动配置任务</div>
      <tiny-button type="danger" @click="deleteEndStatusDnsTask">清理</tiny-button>
    </div>
    <tiny-alert :closable="false"
      description="结束状态有：解析记录配置失败、已提交挑战验证、提交挑战验证失败、手动结束、自动结束、超时结束。如果数据较多，可能需要执行多次。"></tiny-alert>
    <div class="large-bold-text">DNS</div>
    <tiny-alert :closable="false" description="Key ID、Key Secret 均非空时，自动配置 DNS 功能才会生效。如需关闭，修改其值为空即可。"></tiny-alert>
    <tiny-grid :data="dns">
      <tiny-grid-column field="platformname" title="平台" align="center"></tiny-grid-column>
      <tiny-grid-column field="keyId" title="Key ID" align="center"></tiny-grid-column>
      <tiny-grid-column field="keySecret" title="Key Secret" align="center"></tiny-grid-column>
      <tiny-grid-column field="domains" title="域名" align="center" show-overflow></tiny-grid-column>
      <tiny-grid-column title="操作" align="center">
        <template #default="{ row }">
          <tiny-button type="info" @click="openDialog(row)">编辑</tiny-button>
        </template>
      </tiny-grid-column>
    </tiny-grid>
    <tiny-dialog-box class="dialog" :visible="dialog" title="编辑 DNS" @close="closeDialog">
      <div class="dialog-cz">
        <tiny-input v-model="keyid" type="textarea" autosize placeholder="请输入 Key ID"></tiny-input>
        <tiny-input v-model="keysecret" type="textarea" autosize placeholder="请输入 Key Secret"></tiny-input>
        <div class="sp">
          <tiny-input v-model="domain" clearable placeholder="请输入域名"></tiny-input>
          <tiny-button type="success" @click="add">添加</tiny-button>
        </div>
        <div v-for="(item, index) in domains" class="sp">
          <tiny-tag type="info">{{ item }}</tiny-tag>
          <tiny-button type="danger" @click="remove(index)">删除</tiny-button>
        </div>
      </div>
      <template #footer>
        <tiny-button type="info" @click="updateDns">保存</tiny-button>
      </template>
    </tiny-dialog-box>
  </div>
</template>