<script setup>
document.title = '轩铭2512 - 更新日志 - SSL 证书（网页）'
const data = [
  {
    versionNumber: '1.0.1',
    releaseDate: '2025-03-07',
    logs: [
      {
        type: 'U',
        content: '订单支持设置备注'
      },
      {
        type: 'U',
        content: '优化 通知管理页面接收状态显示'
      }
    ]
  },
  {
    versionNumber: '1.0.0',
    releaseDate: '2025-03-06',
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
          <div class="text">{{ item.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>