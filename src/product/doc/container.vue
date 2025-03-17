<script setup>
document.title = '轩铭2512 - 文档中心'
import router from '../../router'
const endyear = new Date().getFullYear()
const tabs = [
  {
    id: 'baxk',
    label: '备案许可'
  },
  {
    id: 'resource',
    label: '资源'
  },
  {
    id: 'ssl',
    label: 'SSL 证书'
  }
]
const tabClick = (data) => {
  router.push('/product/doc/' + data.id)
}
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="sp">
        <img class="tx" src="/logo.jpg" loading="lazy" />
        <div class="header-title">文档中心</div>
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