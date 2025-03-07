<script setup>
document.title = '轩铭2512 - 更新日志 - 管理后台'
const data = [
  {
    versionNumber: '1.1.0',
    releaseDate: '2025-03-06',
    logs: [
      {
        type: 'A',
        content: '支持管理产品 SSL 证书'
      },
      {
        type: 'F',
        content: '用户管理 - 修改权限成功后列表未刷新'
      },
      {
        type: 'F',
        content: '用户管理 - 搜索 UID 成功后未弹窗'
      }
    ]
  },
  {
    versionNumber: '1.0.1',
    releaseDate: '2025-02-26',
    logs: [
      {
        type: 'U',
        content: '通知管理页面新增 邮箱'
      },
      {
        type: 'F',
        content: '新增备案许可页面类型选择“产品备案”时显示“具体类型”非“运行平台”'
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
          <div class="text">{{ item.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>