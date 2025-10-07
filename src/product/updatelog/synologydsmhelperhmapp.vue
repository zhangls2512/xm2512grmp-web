<script setup>
document.title = '轩铭2512 - 更新日志 - 群晖 DSM 助手'
const data = [
  {
    versionNumber: '1.0.1.0',
    releaseDate: '2025-10-07',
    logs: [
      {
        type: 'A',
        content: '“卡片”右上角新增“消息”'
      },
      {
        type: 'U',
        content: '调整卡片中文本行间距，布局更紧凑'
      },
      {
        type: 'U',
        content: '清理数据 - 设置 新增 卡片'
      },
      {
        type: 'U',
        content: 'Webview 组件滚动不与父组件联动'
      },
      {
        type: 'F',
        content: '接续过程中版本号校验逻辑错误'
      }
    ]
  },
  {
    versionNumber: '1.0.0.0',
    releaseDate: '2025-10-06',
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