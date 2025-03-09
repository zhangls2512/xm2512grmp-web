<script setup>
document.title = '轩铭2512 - 更新日志 - 媒体处理'
const data = [
  {
    versionNumber: '1.0.2',
    releaseDate: '2025-03-09',
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
          <div class="text">{{ item.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>