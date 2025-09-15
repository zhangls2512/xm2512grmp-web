<script setup>
document.title = '轩铭2512 - SSL 证书'
const endyear = new Date().getFullYear()
import icon from '@opentiny/vue-icon'
import cookie from 'js-cookie'
import router from '../../router'
const tabs = [
  {
    id: 'limit',
    label: '额度信息',
    customIcon: icon.IconTotal()
  },
  {
    id: 'acmeaccount',
    label: 'ACME 账户管理',
    customIcon: icon.IconUser()
  },
  {
    id: 'orderlist',
    label: '订单管理',
    customIcon: icon.IconCheckedTrue()
  },
  {
    id: 'dnstask',
    label: 'DNS 自动配置任务管理',
    customIcon: icon.IconEditorList()
  },
  {
    id: 'templatelist',
    label: '模板管理',
    customIcon: icon.IconText()
  },
  {
    id: 'notice',
    label: '通知管理',
    customIcon: icon.IconPublicNotice()
  },
  {
    id: 'setting',
    label: '功能设置',
    customIcon: icon.IconSetting()
  },
  {
    id: 'logout',
    label: '退出登录',
    customIcon: icon.IconGoBack()
  }
]
if (!cookie.get('accessToken')) {
  router.push('/product/account/login?product=ssl')
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
          router.push('/product/account/login?product=ssl')
          TinyModal.message({
            message: '已退出登录',
            status: 'success'
          })
        }
      }
    })
  } else {
    if (data.id) {
      router.push('/product/ssl/' + data.id)
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="sp">
        <img class="tx" src="/logossl.png" loading="lazy"></img>
        <div class="header-title">SSL 证书</div>
      </div>
    </div>
    <div class="main">
      <tiny-tree-menu :data="tabs" :show-filter="false" @node-click="tabClick"></tiny-tree-menu>
      <router-view class="tab-container"></router-view>
    </div>
    <div class="empty"></div>
    <div class="footer">
      <div class="cz">
        <div class="footer-text">Copyright © {{ endyear }} Zhang Xuanming. All Rights Reserved. 张轩铭 版权所有</div>
        <div class="sp">
          <a class="footer-text" href="/product/baxk/jqcx?baxknumber=轩铭2512品备6号-W" target="_blank">轩铭2512品备6号-W</a>
          <tiny-divider direction="vertical"></tiny-divider>
          <div class="footer-text">敏感信息收集处理服务许可号：<a href="/product/baxk/jqcx?baxknumber=轩铭2512许6号-1M"
              target="_blank">轩铭2512许6号-1M</a></div>
          <tiny-divider direction="vertical"></tiny-divider>
          <div class="footer-text">Version 1.0.6</div>
          <tiny-divider direction="vertical"></tiny-divider>
          <router-link class="footer-text" to="/product/doc/ssl" target="_blank">文档中心</router-link>
          <tiny-divider direction="vertical"></tiny-divider>
          <router-link class="footer-text" to="/product/updatelog/sslweb" target="_blank">更新日志</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 0;
  width: 100%;
}
</style>