<script setup>
document.title = '轩铭2512 - 更新日志'
import router from '../../router'
const endyear = new Date().getFullYear()
const tabs = [
  {
    id: 'index',
    label: '官网'
  },
  {
    id: 'account',
    label: '统一账号'
  },
  {
    id: 'admin',
    label: '管理后台'
  },
  {
    id: 'baxk',
    label: '备案许可'
  },
  {
    id: 'grmpweb',
    label: '轩铭2512个人名片（网页）'
  },
  {
    id: 'sslweb',
    label: 'SSL 证书（网页）'
  }
]
const tabClick = (data) => {
  router.push('/product/updatelog/' + data.id)
}
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="sp">
        <img class="tx" src="/logo.jpg" loading="lazy" />
        <div class="header-title">更新日志</div>
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