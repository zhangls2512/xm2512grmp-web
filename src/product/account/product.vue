<script setup>
document.title = '轩铭2512 - 统一账号 - 产品管理'
import { ref } from 'vue'
import cookie from 'js-cookie'
import callfunction from '../../callfunction'
import request from '../../request'
import time from '../../time'
const accesstoken = cookie.get('accessToken')
const products = [
  {
    name: 'account',
    logo: '/logo.jpg',
    title: '统一账号高级功能',
    desc: '管理账号通知设置。',
    defaultallow: true
  },
  {
    name: 'admin',
    logo: '/logo.jpg',
    title: '管理后台',
    desc: '一个后台即可管理轩铭2512全部产品，方便、快捷。',
    defaultallow: false
  },
  {
    name: 'resource',
    logo: '/logo.jpg',
    title: '资源',
    desc: '获取优质、安全、实用、易用的资源并快捷使用。',
    defaultallow: true
  },
  {
    name: 'resourcecreator',
    logo: '/logo.jpg',
    title: '资源投稿',
    desc: '投稿优质、安全、实用、易用的资源。',
    defaultallow: false
  },
  {
    name: 'ssl',
    logo: '/logossl.png',
    title: 'SSL 证书',
    desc: '简单、便捷地申请免费 DV SSL 证书。',
    defaultallow: true
  }
]
const validproducts = products.map(item => item.name).concat(['password'])
const productszt = ref(validproducts.reduce((out, item) => {
  out[item + 'ktzt'] = false
  out[item + 'fjzt'] = false
  return out
}, {}))
async function getAccountInfo() {
  const res = await request({
    apiPath: '/account/getAccountInfo',
    body: {
      accessToken: accesstoken
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  const service = res.data.service
  const permission = res.data.permission
  validproducts.forEach(item => {
    productszt.value[item + 'ktzt'] = service.includes(item)
    if (permission[item] === false) {
      productszt.value[item + 'fjzt'] = true
    }
    if (typeof (permission[item]) == 'number' && Date.now() <= permission[item]) {
      productszt.value[item + 'fjzt'] = time(permission[item])
    }
  })
}
getAccountInfo()
function use(product) {
  window.open('/product/' + product, '_blank')
}
async function open(product) {
  await callfunction({
    functionName: 'openService',
    data: {
      accessToken: accesstoken,
      service: product
    }
  })
  TinyModal.message({
    message: '开通成功',
    status: 'success'
  })
  getAccountInfo()
}
async function close(product) {
  await request({
    apiPath: '/account/closeService',
    body: {
      accessToken: accesstoken,
      service: product
    }
  })
  TinyModal.message({
    message: '取消开通成功',
    status: 'success'
  })
  getAccountInfo()
}
function openAppDetail(bundleName) {
  window.open('https://appgallery.huawei.com/app/detail?id=' + bundleName, '_blank')
}
</script>

<template>
  <div class="cz">
    <div class="grid">
      <div class="kuang">
        <div class="cz">
          <div class="sp">
            <img class="image" src="/logo.jpg" loading="lazy"></img>
            <div class="bold-text">统一账号基本功能</div>
          </div>
          <div class="sp">
            <tiny-tag type="success">已开通</tiny-tag>
            <tiny-tag v-if="productszt.accountfjzt === true" type="danger">永久封禁</tiny-tag>
            <tiny-tag v-if="typeof (productszt.accountfjzt) == 'string'" type="danger">
              封禁至 {{ productszt.accountfjzt }}
            </tiny-tag>
          </div>
          <div>一个账号即可使用轩铭2512全部产品，方便、快捷。</div>
          <tiny-alert :closable="false" description="如需取消开通，请注销账号"></tiny-alert>
        </div>
      </div>
      <div v-for="item in products" class="kuang">
        <div class="cz">
          <div class="sp">
            <img class="image" :src="item.logo" loading="lazy"></img>
            <div class="bold-text">{{ item.title }}</div>
          </div>
          <div class="sp">
            <tiny-tag v-if="productszt[item.name + 'ktzt'] == false" type="danger">未开通</tiny-tag>
            <tiny-tag v-if="productszt[item.name + 'ktzt'] == true" type="success">已开通</tiny-tag>
            <tiny-tag v-if="productszt[item.name + 'fjzt'] === true" type="danger">永久封禁</tiny-tag>
            <tiny-tag v-if="typeof (productszt[item.name + 'fjzt']) == 'string'" type="danger">封禁至 {{
              productszt[item.name + 'fjzt'] }}</tiny-tag>
          </div>
          <div>{{ item.desc }}</div>
          <tiny-alert
            v-if="item.defaultallow == false && productszt[item.name + 'ktzt'] == false && productszt[item.name + 'fjzt'] != false"
            :closable="false" description="如需开通，请联系客服"></tiny-alert>
          <div class="sp">
            <tiny-button v-if="productszt[item.name + 'ktzt'] == true && productszt[item.name + 'fjzt'] == false"
              type="info" @click="use(item.name)">去使用</tiny-button>
            <tiny-button v-if="productszt[item.name + 'ktzt'] == false" type="success"
              :disabled="productszt[item.name + 'fjzt']" @click="open(item.name)">开通</tiny-button>
            <tiny-button v-if="productszt[item.name + 'ktzt'] == true" type="danger"
              @click="close(item.name)">取消开通</tiny-button>
          </div>
        </div>
      </div>
      <div class="kuang">
        <div class="cz">
          <div class="sp">
            <img class="image" src="/password.png" loading="lazy"></img>
            <div class="bold-text">密码智能备忘录</div>
          </div>
          <div class="sp">
            <tiny-tag v-if="productszt.passwordktzt == false" type="danger">未开通</tiny-tag>
            <tiny-tag v-if="productszt.passwordktzt == true" type="success">已开通</tiny-tag>
            <tiny-tag v-if="productszt.passwordfjzt === true" type="danger">永久封禁</tiny-tag>
            <tiny-tag v-if="typeof (productszt.passwordfjzt) == 'string'" type="danger">封禁至 {{
              productszt.passwordfjzt }}</tiny-tag>
          </div>
          <div>密码智能管理工具。</div>
          <div class="sp">
            <tiny-button v-if="productszt.passwordktzt == true && productszt.passwordfjzt == false" type="info"
              @click="openAppDetail('com.zhangxm.aipasswordmemo')">去使用</tiny-button>
            <tiny-button v-if="productszt.passwordktzt == false" type="success" :disabled="productszt.passwordfjzt"
              @click="open('password')">开通</tiny-button>
            <tiny-button v-if="productszt.passwordktzt == true" type="danger"
              @click="close('password')">取消开通</tiny-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
}
</style>