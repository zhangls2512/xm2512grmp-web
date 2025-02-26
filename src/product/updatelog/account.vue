<script setup>
document.title = '轩铭2512 - 更新日志 - 统一账号'
const data = [
  {
    versionNumber: '1.0.1',
    releaseDate: '2025-02-26',
    logs: [
      {
        type: 'U',
        content: '通知管理页面新增 邮箱'
      },
      {
        type: 'U',
        content: '调整全屏加载动画背景透明度'
      },
      {
        type: 'F',
        content: '注册账号页面无法输入验证码'
      },
      {
        type: 'F',
        content: '登录日志页面顶部提示文字中文与数字之间无空格'
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
          <div class="text">{{ index + 1 }}.</div>
          <tiny-tag v-if="item.type == 'A'" type="success">A</tiny-tag>
          <tiny-tag v-if="item.type == 'U'" type="info">U</tiny-tag>
          <tiny-tag v-if="item.type == 'F'" color="grey">F</tiny-tag>
          <div class="text">{{ item.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>