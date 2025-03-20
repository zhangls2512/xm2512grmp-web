<script setup>
document.title = '轩铭2512 - 更新日志 - 管理后台'
const data = [
  {
    versionNumber: '1.2.3',
    releaseDate: '2025-03-20',
    logs: [
      {
        type: 'U',
        content: '优化了一些页面的细节体验'
      }
    ]
  },
  {
    versionNumber: '1.2.2',
    releaseDate: '2025-03-20',
    logs: [
      {
        type: 'U',
        content: '备案许可管理支持点击复制备案/许可号'
      },
      {
        type: 'U',
        content: '资源审核页面地址、地址标签、标签、更多信息支持拖拽排序'
      }
    ]
  },
  {
    versionNumber: '1.2.1',
    releaseDate: '2025-03-19',
    logs: [
      {
        type: 'U',
        content: '资源管理 - 资源审核 新增 进度、预览（修改）'
      }
    ]
  },
  {
    versionNumber: '1.2.0',
    releaseDate: '2025-03-18',
    logs: [
      {
        type: 'A',
        content: '支持管理产品 资源'
      }
    ]
  },
  {
    versionNumber: '1.1.0',
    releaseDate: '2025-03-06',
    logs: [
      {
        type: 'A',
        content: '支持管理产品 SSL 证书'
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