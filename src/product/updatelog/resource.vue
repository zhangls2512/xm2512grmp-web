<script setup>
document.title = '轩铭2512 - 更新日志 - 资源'
const data = [
  {
    versionNumber: '1.0.4',
    releaseDate: '2025-03-22',
    logs: [
      {
        type: 'U',
        content: '支持修改资源详情'
      }
    ]
  },
  {
    versionNumber: '1.0.3',
    releaseDate: '2025-03-21',
    logs: [
      {
        type: 'U',
        content: '支持点击复制文本类型地址内容、更多信息内容'
      }
    ]
  },
  {
    versionNumber: '1.0.2',
    releaseDate: '2025-03-19',
    logs: [
      {
        type: 'U',
        content: '优化了一些页面的细节体验'
      },
      {
        type: 'U',
        content: '首页 下线 我要投稿'
      },
      {
        type: 'U',
        content: '个人中心 下线 功能管理'
      }
    ]
  },
  {
    versionNumber: '1.0.1',
    releaseDate: '2025-03-18',
    logs: [
      {
        type: 'U',
        content: '优化了一些页面的细节体验'
      },
      {
        type: 'F',
        content: '修复了一些已知的问题'
      }
    ]
  },
  {
    versionNumber: '1.0.0',
    releaseDate: '2025-03-18',
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