<script setup>
document.title = '轩铭2512 - 更新日志 - 资源投稿'
const data = [
  {
    versionNumber: '1.0.5',
    releaseDate: '2025-03-21',
    logs: [
      {
        type: 'U',
        content: '优化了一些页面的细节体验'
      }
    ]
  },
  {
    versionNumber: '1.0.4',
    releaseDate: '2025-03-20',
    logs: [
      {
        type: 'U',
        content: '优化了一些页面的细节体验'
      }
    ]
  },
  {
    versionNumber: '1.0.3',
    releaseDate: '2025-03-20',
    logs: [
      {
        type: 'U',
        content: '新增资源、修改资源审核版本页面地址、地址标签、标签、更多信息支持拖拽排序'
      }
    ]
  },
  {
    versionNumber: '1.0.2',
    releaseDate: '2025-03-19',
    logs: [
      {
        type: 'U',
        content: '新增资源、修改资源审核版本 新增 允许审核人员修改信息、直接提交审核'
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