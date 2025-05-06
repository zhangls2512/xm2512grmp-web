<script setup>
document.title = '轩铭2512 - 更新日志 - SSL 证书（微信小程序）'
const data = [
  {
    versionNumber: '2.0.7',
    releaseDate: '2025-05-06',
    logs: [
      {
        type: 'F',
        content: '修复了一些已知的问题'
      }
    ]
  },
  {
    versionNumber: '2.0.6',
    releaseDate: '2025-04-27',
    logs: [
      {
        type: 'F',
        content: '修复了一些已知的问题'
      }
    ]
  },
  {
    versionNumber: '2.0.5',
    releaseDate: '2025-04-27',
    logs: [
      {
        type: 'U',
        content: '证书类型支持选择 TLS 服务器'
      }
    ]
  },
  {
    versionNumber: '2.0.4',
    releaseDate: '2025-04-22',
    logs: [
      {
        type: 'U',
        content: '优化了一些页面的细节体验'
      }
    ]
  },
  {
    versionNumber: '2.0.3',
    releaseDate: '2025-04-10',
    logs: [
      {
        type: 'F',
        content: '修复了一些已知的问题'
      }
    ]
  },
  {
    versionNumber: '2.0.2',
    releaseDate: '2025-03-20',
    logs: [
      {
        type: 'U',
        content: '优化了一些页面的细节体验'
      }
    ]
  },
  {
    versionNumber: '2.0.1',
    releaseDate: '2025-03-18',
    logs: [
      {
        type: 'F',
        content: '修复了一些已知的问题'
      }
    ]
  },
  {
    versionNumber: '2.0.0',
    releaseDate: '2025-03-13',
    logs: [
      {
        type: 'A',
        content: '更新了若干功能'
      },
      {
        type: 'U',
        content: '优化了一些页面的细节体验'
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