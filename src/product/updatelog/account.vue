<script setup>
document.title = '轩铭2512 - 更新日志 - 统一账号'
const data = [
  {
    versionNumber: '1.0.12',
    releaseDate: '2026-01-11',
    logs: [
      {
        type: 'U',
        content: '登录方式 新增 扫描二维码'
      }
    ]
  },
  {
    versionNumber: '1.0.11',
    releaseDate: '2025-09-24',
    logs: [
      {
        type: 'U',
        content: '登录 新增 通行密钥登录'
      },
      {
        type: 'U',
        content: '账号管理 - 基本信息 新增 通行密钥'
      }
    ]
  },
  {
    versionNumber: '1.0.10',
    releaseDate: '2025-05-05',
    logs: [
      {
        type: 'U',
        content: '账号管理 - 基本信息支持一键复制 MFA 密钥'
      }
    ]
  },
  {
    versionNumber: '1.0.9',
    releaseDate: '2025-04-19',
    logs: [
      {
        type: 'U',
        content: '产品管理 新增 密码智能备忘录'
      }
    ]
  },
  {
    versionNumber: '1.0.8',
    releaseDate: '2025-03-19',
    logs: [
      {
        type: 'U',
        content: '产品管理 新增 资源投稿'
      }
    ]
  },
  {
    versionNumber: '1.0.7',
    releaseDate: '2025-03-18',
    logs: [
      {
        type: 'U',
        content: '注册账号 新增 密码'
      }
    ]
  },
  {
    versionNumber: '1.0.6',
    releaseDate: '2025-03-18',
    logs: [
      {
        type: 'U',
        content: '产品管理 新增 资源'
      }
    ]
  },
  {
    versionNumber: '1.0.5',
    releaseDate: '2025-03-09',
    logs: [
      {
        type: 'U',
        content: '账号管理 - 基本信息 新增 外部账号'
      }
    ]
  },
  {
    versionNumber: '1.0.4',
    releaseDate: '2025-03-08',
    logs: [
      {
        type: 'U',
        content: '部分文本输入框显示已输入字数、最大可输入字数'
      }
    ]
  },
  {
    versionNumber: '1.0.3',
    releaseDate: '2025-03-07',
    logs: [
      {
        type: 'U',
        content: '“产品管理”页面已开通的产品 新增 去使用'
      }
    ]
  },
  {
    versionNumber: '1.0.2',
    releaseDate: '2025-03-06',
    logs: [
      {
        type: 'U',
        content: '产品管理 新增 SSL 证书'
      }
    ]
  },
  {
    versionNumber: '1.0.1',
    releaseDate: '2025-02-26',
    logs: [
      {
        type: 'U',
        content: '通知管理 新增 邮箱'
      },
      {
        type: 'F',
        content: '“注册账号”页面无法输入验证码'
      }
    ]
  },
  {
    versionNumber: '1.0.0',
    releaseDate: '2025-02-26',
    logs: [
      {
        type: 'A',
        content: '第一版本'
      }
    ]
  }
]
</script>

<template>
  <div class="cz">
    <div v-for="item in data" class="cz">
      <div class="large-bold-text">Version {{ item.versionNumber }}（发布日期：{{ item.releaseDate }}）</div>
      <div v-for="(item, index) in item.logs" class="cz">
        <div class="sp">
          <div>{{ index + 1 }}.</div>
          <tiny-tag v-if="item.type == 'A'" type="success">A</tiny-tag>
          <tiny-tag v-if="item.type == 'U'" type="info">U</tiny-tag>
          <tiny-tag v-if="item.type == 'F'" color="grey">F</tiny-tag>
          <div>{{ item.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>