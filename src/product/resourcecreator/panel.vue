<script setup>
document.title = '轩铭2512 - 资源投稿'
const endyear = new Date().getFullYear()
import icon from '@opentiny/vue-icon'
import cookie from 'js-cookie'
import router from '../../router'
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
if (!cookie.get('accessToken')) {
  router.push('/product/account/login?product=resourcecreator')
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
        <img class="tx" src="/logo.jpg" loading="lazy"></img>
        <div class="header-title">资源投稿</div>
      </div>
    </div>
    <div class="main">
      <tiny-tree-menu :data="tabs" :show-filter="false" @node-click="tabClick"></tiny-tree-menu>
      <router-view class="tab-container"></router-view>
    </div>
    <div class="empty"></div>
    <div class="footer">
      <div class="cz">
        <div class="sp">
          <a class="footer-text" href="tel:18846496985">联系手机：18846496985</a>
          <tiny-divider direction="vertical"></tiny-divider>
          <a class="footer-text" href="mailto:2300990296@qq.com">联系邮箱：2300990296@qq.com</a>
          <tiny-divider direction="vertical"></tiny-divider>
          <div class="footer-text">联系微信：gerenyinsi_z07x17m</div>
        </div>
        <div class="footer-text">Copyright © {{ endyear }} Zhang Xuanming. All Rights Reserved. 张轩铭 版权所有</div>
        <div class="sp">
          <a class="footer-text" href="/product/baxk/jqcx?baxknumber=轩铭2512品备10号-W" target="_blank">轩铭2512品备10号-W</a>
          <tiny-divider direction="vertical"></tiny-divider>
          <div class="footer-text">Version 1.0.8</div>
          <tiny-divider direction="vertical"></tiny-divider>
          <router-link class="footer-text" to="/product/doc/resourcecreator" target="_blank">文档中心</router-link>
          <tiny-divider direction="vertical"></tiny-divider>
          <router-link class="footer-text" to="/product/updatelog/resourcecreator" target="_blank">更新日志</router-link>
        </div>
      </div>
    </div>
  </div>
</template>