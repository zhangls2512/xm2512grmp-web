<script setup>
document.title = '轩铭2512 - 更新日志 - 个人名片（网页）'
const data = [
  {
    versionNumber: '1.0.2',
    releaseDate: '2025-09-15',
    logs: [
      {
        type: 'U',
        content: '技能证书 新增 轩铭密码智能备忘录APP——计算机软件著作权登记证书'
      }
    ]
  },
  {
    versionNumber: '1.0.1',
    releaseDate: '2025-06-09',
    logs: [
      {
        type: 'U',
        content: '更新 个人简介'
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