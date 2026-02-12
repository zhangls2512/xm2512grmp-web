<script setup>
document.title = '轩铭2512 - 更新日志 - 个人名片（微信小程序）'
const data = [
  {
    versionNumber: '1.0.11',
    releaseDate: '2026-02-12',
    logs: [
      {
        type: 'U',
        content: '技能证书 新增 腾讯技术菁英班结课证书'
      },
      {
        type: 'U',
        content: '开发产品 新增 WebDAV 助手'
      }
    ]
  },
  {
    versionNumber: '1.0.10',
    releaseDate: '2026-01-21',
    logs: [
      {
        type: 'U',
        content: '优化了一些页面的细节体验'
      }
    ]
  },
  {
    versionNumber: '1.0.9',
    releaseDate: '2026-01-17',
    logs: [
      {
        type: 'U',
        content: '优化了一些页面的细节体验'
      }
    ]
  },
  {
    versionNumber: '1.0.8',
    releaseDate: '2025-12-31',
    logs: [
      {
        type: 'U',
        content: '优化了一些页面的细节体验'
      }
    ]
  },
  {
    versionNumber: '1.0.7',
    releaseDate: '2025-10-29',
    logs: [
      {
        type: 'U',
        content: '开发产品 新增 SynDSM 助手'
      },
      {
        type: 'F',
        content: '修复了一些已知的问题'
      }
    ]
  },
  {
    versionNumber: '1.0.6',
    releaseDate: '2025-09-07',
    logs: [
      {
        type: 'U',
        content: '获取客服帮助 新增 公众号会话'
      }
    ]
  },
  {
    versionNumber: '1.0.5',
    releaseDate: '2025-08-12',
    logs: [
      {
        type: 'U',
        content: '技能证书 新增 轩铭密码智能备忘录APP——计算机软件著作权登记证书'
      },
      {
        type: 'F',
        content: '修复了一些已知的问题'
      }
    ]
  },
  {
    versionNumber: '1.0.4',
    releaseDate: '2025-07-07',
    logs: [
      {
        type: 'F',
        content: '修复了一些已知的问题'
      }
    ]
  },
  {
    versionNumber: '1.0.3',
    releaseDate: '2025-06-09',
    logs: [
      {
        type: 'F',
        content: '修复了一些已知的问题'
      }
    ]
  },
  {
    versionNumber: '1.0.2',
    releaseDate: '2025-06-07',
    logs: [
      {
        type: 'F',
        content: '修复了一些已知的问题'
      }
    ]
  },
  {
    versionNumber: '1.0.1',
    releaseDate: '2025-06-06',
    logs: [
      {
        type: 'F',
        content: '修复了一些已知的问题'
      }
    ]
  },
  {
    versionNumber: '1.0.0',
    releaseDate: '2025-03-21',
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