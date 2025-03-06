<script setup>
document.title = '轩铭2512 - SSL 证书 - 修改模板'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import cookie from 'js-cookie'
import validator from 'validator'
import request from '../../request'
import router from '../../router'
const route = useRoute()
const id = route.query.id
const accesstoken = cookie.get('accessToken')
const domains = ref([])
const domain = ref('')
const desc = ref('')
async function getInfo() {
  const res = await request({
    apiPath: '/ssl/getTemplateInfo',
    body: {
      accessToken: accesstoken,
      id: id
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  domains.value = res.data.domains
  desc.value = res.data.desc
}
getInfo()
function add() {
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
async function updateTemplate() {
  if (domains.value.length == 0) {
    TinyModal.message({
      message: '请添加域名 / IP 地址',
      status: 'warning'
    })
    return
  }
  if (desc.value.length > 20) {
    TinyModal.message({
      message: '描述长度不能超过 20 个字符',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/ssl/updateTemplate',
    body: {
      accessToken: accesstoken,
      id: id,
      domains: domains.value,
      desc: desc.value
    }
  })
  TinyModal.message({
    message: '修改成功',
    status: 'success'
  })
  router.push('/product/ssl/templatelist')
}
</script>

<template>
  <div class="cz">
    <tiny-breadcrumb>
      <tiny-breadcrumb-item :to="{ path: '/product/ssl/templatelist' }" label="模板管理"></tiny-breadcrumb-item>
      <tiny-breadcrumb-item :to="{ path: '/product/ssl/updatetemplate' }" label="修改模板"></tiny-breadcrumb-item>
    </tiny-breadcrumb>
    <tiny-form>
      <tiny-form-item label="域名">
        <div class="cz">
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
      <tiny-form-item label="描述">
        <tiny-input v-model="desc" clearable maxlength="20" placeholder="请输入描述（可选）"></tiny-input>
      </tiny-form-item>
      <tiny-form-item>
        <tiny-button type="info" @click="updateTemplate">修改</tiny-button>
      </tiny-form-item>
    </tiny-form>
  </div>
</template>