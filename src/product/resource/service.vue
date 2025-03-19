<script setup>
document.title = '轩铭2512 - 资源 - 功能管理'
import { ref } from 'vue'
import cookie from 'js-cookie'
import moment from 'moment-timezone'
import callfunction from '../../callfunction'
import request from '../../request'
const accesstoken = cookie.get('accessToken')
const services = [
  {
    name: 'resourcecreator',
    logo: '/logo.jpg',
    title: '资源投稿',
    desc: '投稿优质、安全、实用、易用的资源。'
  }
]
const validservices = services.map(item => item.name)
const serviceszt = ref(validservices.reduce((out, item) => {
  out[`${item}ktzt`] = false
  out[`${item}fjzt`] = false
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
  validservices.forEach(item => {
    serviceszt.value[`${item}ktzt`] = service.includes(item)
    if (permission[item] === false) {
      serviceszt.value[`${item}fjzt`] = true
    }
    if (typeof (permission[item]) == 'number' && Date.now() <= permission[item]) {
      serviceszt.value[`${item}fjzt`] = moment(permission[item]).format('YYYY-MM-DD HH:mm:ss')
    }
  })
}
getAccountInfo()
function use(service) {
  window.open('/product/' + service, '_blank')
}
async function open(service) {
  await callfunction({
    functionName: 'openService',
    data: {
      accessToken: accesstoken,
      service: service
    }
  })
  TinyModal.message({
    message: '开通成功',
    status: 'success'
  })
  getAccountInfo()
}
async function close(service) {
  await request({
    apiPath: '/account/closeService',
    body: {
      accessToken: accesstoken,
      service: service
    }
  })
  TinyModal.message({
    message: '取消开通成功',
    status: 'success'
  })
  getAccountInfo()
}
</script>

<template>
  <div class="cz">
    <div class="grid">
      <div v-for="item in services" class="kuang">
        <div class="cz">
          <div class="sp">
            <img class="image" :src="item.logo" loading="lazy" />
            <div class="bold-text">{{ item.title }}</div>
          </div>
          <div class="sp">
            <tiny-tag v-if="serviceszt[`${item.name}ktzt`] == false" type="danger">未开通</tiny-tag>
            <tiny-tag v-if="serviceszt[`${item.name}ktzt`] == true" type="success">已开通</tiny-tag>
            <tiny-tag v-if="serviceszt[`${item.name}fjzt`] === true" type="danger">永久封禁</tiny-tag>
            <tiny-tag v-if="typeof (serviceszt[`${item.name}fjzt`]) == 'string'" type="danger">封禁至 {{
              serviceszt[`${item.name}fjzt`] }}</tiny-tag>
          </div>
          <div>{{ item.desc }}</div>
          <tiny-alert v-if="serviceszt[`${item.name}fjzt`] != false" :closable="false"
            description="如需开通，请联系客服"></tiny-alert>
          <div class="sp">
            <tiny-button v-if="serviceszt[`${item.name}ktzt`] == true && serviceszt[`${item.name}fjzt`] == false"
              type="info" @click="use(item.name)">去使用</tiny-button>
            <tiny-button v-if="serviceszt[`${item.name}ktzt`] == false" type="success"
              :disabled="serviceszt[`${item.name}fjzt`]" @click="open(item.name)">开通</tiny-button>
            <tiny-button v-if="serviceszt[`${item.name}ktzt`] == true" type="danger"
              @click="close(item.name)">取消开通</tiny-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
}
</style>