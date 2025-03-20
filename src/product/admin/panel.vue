<script setup>
document.title = '轩铭2512 - 管理后台'
const endyear = new Date().getFullYear()
import icon from '@opentiny/vue-icon'
import cookie from 'js-cookie'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const tabs = [
  {
    id: 'userlist',
    label: '用户管理',
    customIcon: icon.IconGroup()
  },
  {
    id: 'banloglist',
    label: '违规记录管理',
    customIcon: icon.IconWarning()
  },
  {
    id: 'baxklist',
    label: '备案许可管理',
    customIcon: icon.IconCheckedTrue()
  },
  {
    id: '',
    label: '资源管理',
    customIcon: icon.IconApp(),
    children: [
      {
        id: 'resourcelist',
        label: '资源管理',
        customIcon: icon.IconApp()
      },
      {
        id: 'reviewresource',
        label: '资源审核',
        customIcon: icon.IconEyeopen()
      }
    ]
  },
  {
    id: '',
    label: 'SSL 证书管理',
    customIcon: icon.IconCheckedTrue(),
    children: [
      {
        id: 'ssluserlist',
        label: '用户管理',
        customIcon: icon.IconGroup()
      },
      {
        id: 'ssllimitchangelist',
        label: '额度管理',
        customIcon: icon.IconTotal()
      }
    ]
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
  router.push('/product/account/login?product=admin')
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
          router.push('/product/account/login?product=admin')
          TinyModal.message({
            message: '已退出登录',
            status: 'success'
          })
        }
      }
    })
  } else {
    if (data.id) {
      router.push('/product/admin/' + data.id)
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="sp">
        <img class="tx" src="/logo.jpg" loading="lazy" />
        <div class="header-title">管理后台</div>
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
          <a class="footer-text" href="/product/baxk/jqcx?baxknumber=轩铭2512品备3号-W" target="_blank">轩铭2512品备3号-W</a>
          <tiny-divider direction="vertical"></tiny-divider>
          <div class="footer-text">Version 1.2.2</div>
          <tiny-divider direction="vertical"></tiny-divider>
          <router-link class="footer-text" to="/product/updatelog/admin" target="_blank">更新日志</router-link>
        </div>
      </div>
    </div>
  </div>
</template>