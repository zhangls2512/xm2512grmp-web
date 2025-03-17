<script setup>
document.title = '轩铭2512 - 资源投稿'
const endyear = new Date().getFullYear()
import icon from '@opentiny/vue-icon'
import cookie from 'js-cookie'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const tabs = [
  {
    id: 'resourcelist',
    label: '资源管理',
    customIcon: icon.IconApp()
  },
  {
    id: 'notice',
    label: '通知管理',
    customIcon: icon.IconPublicNotice()
  },
  {
    id: 'logout',
    label: '退出登录',
    customIcon: icon.IconGoBack()
  }
]
async function getAccountInfo() {
  const res = await request({
    apiPath: '/account/getAccountInfo',
    body: {
      accessToken: accesstoken
    }
  })
  const expires = new Date(res.data.endDate)
  cookie.set('accessToken', accesstoken, { expires: expires, secure: true, sameSite: 'strict' })
  cookie.set('email', cookie.get('email'), { expires: expires, secure: true, sameSite: 'strict' })
}
if (!cookie.get('accessToken')) {
  router.push('/product/account/login?product=resourcecreator')
} else {
  getAccountInfo()
}
const tabClick = (data) => {
  if (data.id == 'logout') {
    TinyModal.confirm({
      status: 'info',
      title: '提示',
      message: '确定退出登录？',
      events: {
        confirm() {
          cookie.remove('accessToken')
          cookie.remove('email')
          router.push('/product/account/login?product=resourcecreator')
          TinyModal.message({
            message: '已退出登录',
            status: 'success'
          })
        }
      }
    })
  } else {
    if (data.id) {
      router.push('/product/resourcecreator/' + data.id)
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="sp">
        <img class="tx" src="/logo.jpg" loading="lazy" />
        <div class="header-title">资源投稿</div>
      </div>
    </div>
    <div class="main">
      <tiny-tree-menu :data="tabs" :show-filter="false" @node-click="tabClick"></tiny-tree-menu>
      <router-view class="tab-container"></router-view>
    </div>
    <div class="empty"></div>
    <div class="footer">
      <div class="footer-text">Copyright © {{ endyear }} Zhang Xuanming. All Rights Reserved. 张轩铭 版权所有</div>
    </div>
  </div>
</template>