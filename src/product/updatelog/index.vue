<script setup>
document.title = '轩铭2512 - 更新日志 - 官网'
const data = [
  {
    versionNumber: '1.0.11',
    releaseDate: '2025-05-06',
    logs: [
      {
        type: 'U',
        content: '产品 新增 密码智能备忘录（邀请测试）'
      }
    ]
  },
  {
    versionNumber: '1.0.10',
    releaseDate: '2025-05-05',
    logs: [
      {
        type: 'U',
        content: '媒体 新增 抖音'
      },
      {
        type: 'U',
        content: '修订成员'
      }
    ]
  },
  {
    versionNumber: '1.0.9',
    releaseDate: '2025-03-22',
    logs: [
      {
        type: 'U',
        content: '修订一些成员的岗位'
      }
    ]
  },
  {
    versionNumber: '1.0.8',
    releaseDate: '2025-03-21',
    logs: [
      {
        type: 'U',
        content: '更新日志 新增 个人名片（微信小程序）'
      }
    ]
  },
  {
    versionNumber: '1.0.7',
    releaseDate: '2025-03-20',
    logs: [
      {
        type: 'U',
        content: '首页 - 成员 新增 于梓浩、郭怡航'
      }
    ]
  },
  {
    versionNumber: '1.0.6',
    releaseDate: '2025-03-19',
    logs: [
      {
        type: 'U',
        content: '首页 - 产品 新增 资源投稿'
      },
      {
        type: 'U',
        content: '文档中心 新增 资源投稿'
      },
      {
        type: 'U',
        content: '更新日志 新增 资源投稿'
      }
    ]
  },
  {
    versionNumber: '1.0.5',
    releaseDate: '2025-03-18',
    logs: [
      {
        type: 'U',
        content: '首页 - 产品 新增 资源'
      },
      {
        type: 'U',
        content: '文档中心 新增 资源'
      },
      {
        type: 'U',
        content: '更新日志 新增 资源、SSL 证书（微信小程序）'
      }
    ]
  },
  {
    versionNumber: '1.0.4',
    releaseDate: '2025-03-09',
    logs: [
      {
        type: 'U',
        content: '更新 nodejs-acmeclient 产品 logo'
      }
    ]
  },
  {
    versionNumber: '1.0.3',
    releaseDate: '2025-03-09',
    logs: [
      {
        type: 'U',
        content: '更新日志 新增 图片处理'
      }
    ]
  },
  {
    versionNumber: '1.0.2',
    releaseDate: '2025-03-07',
    logs: [
      {
        type: 'U',
        content: '首页 - 产品 新增 统一账号、管理后台'
      }
    ]
  },
  {
    versionNumber: '1.0.1',
    releaseDate: '2025-03-06',
    logs: [
      {
        type: 'U',
        content: '首页 - 产品 - SSL 证书 新增 网页'
      },
      {
        type: 'U',
        content: '文档中心 新增 SSL 证书'
      },
      {
        type: 'U',
        content: '更新日志 新增 SSL 证书（网页）'
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