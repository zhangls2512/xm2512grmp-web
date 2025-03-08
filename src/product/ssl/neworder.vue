<script setup>
document.title = '轩铭2512 - SSL 证书 - 新增订单'
import { ref } from 'vue'
import cookie from 'js-cookie'
import validator from 'validator'
import callfunction from '../../callfunction'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const orderdesc = ref('')
const type = ref('classic')
const csr = ref('')
const template = ref([])
const templatedisplay = ref(true)
const domains = ref([])
const domain = ref('')
const keytype = ref('rsa')
const rsakeysize = ref('2048')
const ecdsakeysize = ref('prime256v1')
const environmenttype = ref('production')
const certificatetype = ref('classic')
const autoneworder = ref('ari')
const autonewtemplate = ref(false)
const templatedesc = ref('')
async function getTemplate() {
  const res = await request({
    apiPath: '/ssl/getTemplateList',
    body: {
      accessToken: accesstoken
    }
  })
  template.value = res.data
}
getTemplate()
function add() {
  if (domains.value.length >= 100) {
    TinyModal.message({
      message: '最多添加 100 个域名 / IP 地址',
      status: 'warning'
    })
    return
  }
  if (!validator.isFQDN(domain.value, {
    allow_wildcard: true
  }) && !validator.isIP(domain.value)) {
    TinyModal.message({
      message: '请输入有效的域名 / IP 地址',
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
function close() {
  templatedisplay.value = false
}
function input(domainsinput) {
  domains.value = domainsinput
}
async function newOrder() {
  let csrused = ''
  let domainsused = []
  let keytypeused = ''
  let keysizeused = ''
  if (type.value == 'csr') {
    if (csr.value === '') {
      TinyModal.message({
        message: '请输入 CSR',
        status: 'warning'
      })
      return
    }
    csrused = csr.value
  } else {
    if (domains.value.length == 0) {
      TinyModal.message({
        message: '请添加域名 / IP 地址',
        status: 'warning'
      })
      return
    }
    if (certificatetype.value != 'shortlived' && domains.value.some(item => validator.isIP(item))) {
      TinyModal.message({
        message: '仅短期证书类型支持添加 IP 地址',
        status: 'warning'
      })
      return
    }
    domainsused = domains.value
    keytypeused = keytype.value
    if (keytype.value == 'rsa') {
      keysizeused = Number(rsakeysize.value)
    }
    if (keytype.value == 'ecdsa') {
      keysizeused = ecdsakeysize.value
    }
  }
  await callfunction({
    functionName: 'newSslOrder',
    data: {
      accessToken: accesstoken,
      desc: orderdesc.value,
      csr: csrused,
      domains: domainsused,
      keyType: keytypeused,
      keySize: keysizeused,
      environmentType: environmenttype.value,
      certificateType: certificatetype.value,
      autoNewOrder: autoneworder.value
    }
  })
  TinyModal.message({
    message: '新增成功',
    status: 'success'
  })
  if (autonewtemplate.value && type.value == 'classic') {
    request({
      apiPath: '/ssl/newTemplate',
      body: {
        accessToken: accesstoken,
        domains: domainsused,
        desc: templatedesc.value
      }
    })
  }
  router.push('/product/ssl/orderlist')
}
</script>

<template>
  <div class="cz">
    <tiny-breadcrumb>
      <tiny-breadcrumb-item :to="{ path: '/product/ssl/orderlist' }" label="订单管理"></tiny-breadcrumb-item>
      <tiny-breadcrumb-item :to="{ path: '/product/ssl/neworder' }" label="新增订单"></tiny-breadcrumb-item>
    </tiny-breadcrumb>
    <tiny-form>
      <tiny-form-item label="方式">
        <tiny-radio-group v-model="type">
          <tiny-radio label="classic">经典</tiny-radio>
          <tiny-radio label="csr">CSR</tiny-radio>
        </tiny-radio-group>
      </tiny-form-item>
      <tiny-form-item v-if="type == 'csr'" label="CSR">
        <tiny-input v-model="csr" type="textarea" autosize clearable placeholder="请输入 CSR"></tiny-input>
      </tiny-form-item>
      <tiny-form-item v-if="type == 'classic'" label="域名">
        <div class="cz">
          <tiny-alert :closable="false" description="第一个将作为证书通用名称（Common Name）。"></tiny-alert>
          <div class="sp">
            <tiny-input v-model="domain" placeholder="请输入域名 / IP 地址"></tiny-input>
            <tiny-button type="success" @click="add">添加</tiny-button>
          </div>
          <div v-for="(item, index) in domains" class="sp">
            <tiny-tag type="info">{{ item }}</tiny-tag>
            <tiny-button type="danger" @click="remove(index)">删除</tiny-button>
          </div>
        </div>
      </tiny-form-item>
      <tiny-form-item v-if="type == 'classic' && templatedisplay == true" label="模板">
        <div class="cz">
          <tiny-button type="danger" @click="close">隐藏</tiny-button>
          <tiny-grid :data="template">
            <tiny-grid-column field="domains" title="域名、IP 地址" align="center" show-overflow></tiny-grid-column>
            <tiny-grid-column field="desc" title="备注" align="center" show-overflow></tiny-grid-column>
            <tiny-grid-column title="操作" align="center">
              <template #default="{ row }">
                <tiny-button type="info" @click="input(row.domains)">填入</tiny-button>
              </template>
            </tiny-grid-column>
          </tiny-grid>
        </div>
      </tiny-form-item>
      <tiny-form-item v-if="type == 'classic'" label="存入模板">
        <tiny-switch v-model="autonewtemplate"></tiny-switch>
      </tiny-form-item>
      <tiny-form-item v-if="type == 'classic' && autonewtemplate == true" label="模板备注">
        <tiny-input v-model="templatedesc" clearable show-word-limit maxlength="20"
          placeholder="请输入模板备注（可选）"></tiny-input>
      </tiny-form-item>
      <tiny-form-item label="订单备注">
        <tiny-input v-model="orderdesc" clearable show-word-limit maxlength="20" placeholder="请输入订单备注（可选）"></tiny-input>
      </tiny-form-item>
      <tiny-form-item v-if="type == 'classic'" label="密钥类型">
        <tiny-radio-group v-model="keytype">
          <tiny-radio label="rsa">RSA</tiny-radio>
          <tiny-radio label="ecdsa">ECDSA</tiny-radio>
        </tiny-radio-group>
      </tiny-form-item>
      <tiny-form-item v-if="type == 'classic' && keytype == 'rsa'" label="密钥位数">
        <tiny-radio-group v-model="rsakeysize">
          <tiny-radio label="2048">2048 位</tiny-radio>
          <tiny-radio label="3072">3072 位</tiny-radio>
          <tiny-radio label="4096">4096 位</tiny-radio>
        </tiny-radio-group>
      </tiny-form-item>
      <tiny-form-item v-if="type == 'classic' && keytype == 'ecdsa'" label="密钥曲线">
        <tiny-radio-group v-model="ecdsakeysize">
          <tiny-radio label="prime256v1">prime256v1（256 位）</tiny-radio>
          <tiny-radio label="secp384r1">secp384r1（384 位）</tiny-radio>
        </tiny-radio-group>
      </tiny-form-item>
      <tiny-form-item label="环境类型">
        <div class="cz">
          <tiny-radio-group v-model="environmenttype">
            <tiny-radio label="production">正式</tiny-radio>
            <tiny-radio label="staging">测试</tiny-radio>
          </tiny-radio-group>
          <tiny-alert v-if="environmenttype == 'staging'" type="warning" :closable="false"
            description="测试环境颁发的证书不受信任，仅供测试使用。"></tiny-alert>
        </div>
      </tiny-form-item>
      <tiny-form-item label="证书类型">
        <div class="cz">
          <tiny-radio-group v-model="certificatetype">
            <tiny-radio label="classic">经典</tiny-radio>
            <tiny-radio label="shortlived" disabled>短期</tiny-radio>
            <tiny-radio label="tlsserver" disabled>TLS 服务器</tiny-radio>
          </tiny-radio-group>
          <tiny-alert :closable="false"
            description="CA 暂未全量开放短期、TLS 服务器证书类型，因此选项被禁用。CA 全量开放后将更新版本解除禁用，敬请期待！"></tiny-alert>
        </div>
      </tiny-form-item>
      <tiny-form-item label="自动续期">
        <tiny-radio-group v-model="autoneworder">
          <tiny-radio label="ari">CA 建议</tiny-radio>
          <tiny-radio label="nearexpire">即将到期</tiny-radio>
          <tiny-radio label="close">关闭</tiny-radio>
        </tiny-radio-group>
      </tiny-form-item>
      <tiny-form-item>
        <tiny-button type="success" @click="newOrder">新增</tiny-button>
      </tiny-form-item>
    </tiny-form>
  </div>
</template>