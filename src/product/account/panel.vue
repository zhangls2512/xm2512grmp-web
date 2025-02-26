<script setup>
document.title = '轩铭2512 - 统一账号'
import icon from '@opentiny/vue-icon'
import cookie from 'js-cookie'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const tabs = [
  {
    id: '',
    label: '账号管理',
    customIcon: icon.IconUser(),
    children: [
      {
        id: 'info',
        label: '基本信息'
      },
      {
        id: 'loginlog',
        label: '登录日志'
      },
      {
        id: 'develop',
        label: '开发管理'
      }
    ]
  },
  {
    id: 'product',
    label: '产品管理',
    customIcon: icon.IconApp()
  },
  {
    id: 'notice',
    label: '通知管理',
    customIcon: icon.IconPublicNotice()
  },
  {
    id: 'banlog',
    label: '违规记录',
    customIcon: icon.IconWarning()
  },
  {
    id: 'loginout',
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
  router.push('/product/account/login')
} else {
  getAccountInfo()
}
const tabClick = (data) => {
  if (data.id == 'loginout') {
    TinyModal.confirm({
      status: 'info',
      title: '提示',
      message: '确定退出登录？',
      events: {
        confirm() {
          cookie.remove('accessToken')
          cookie.remove('email')
          router.push('/product/account/login')
          TinyModal.message({
            message: '已退出登录',
            status: 'success'
          })
        }
      }
    })
  } else {
    if (data.id) {
      router.push('/product/account/' + data.id)
    }
  }
}
</script>

<template>
  <div class="main">
    <tiny-tree-menu :data="tabs" :show-filter="false" @node-click="tabClick"></tiny-tree-menu>
    <router-view class="tab-container"></router-view>
  </div>
  <div class="empty"></div>
</template>