<script setup>
document.title = '轩铭2512 - 更新日志 - SSL 证书（网页）'
const data = [
  {
    versionNumber: '1.0.7',
    releaseDate: '2025-11-27',
    logs: [
      {
        type: 'U',
        content: '“订单详情”页面支持删除私钥'
      }
    ]
  },
  {
    versionNumber: '1.0.6',
    releaseDate: '2025-09-15',
    logs: [
      {
        type: 'U',
        content: '证书类型支持选择短期、TLS 客户端'
      }
    ]
  },
  {
    versionNumber: '1.0.5',
    releaseDate: '2025-04-26',
    logs: [
      {
        type: 'U',
        content: '证书类型支持选择 TLS 服务器'
      }
    ]
  },
  {
    versionNumber: '1.0.4',
    releaseDate: '2025-03-08',
    logs: [
      {
        type: 'U',
        content: '部分文本输入框显示已输入字数、最大可输入字数'
      }
    ]
  },
  {
    versionNumber: '1.0.3',
    releaseDate: '2025-03-08',
    logs: [
      {
        type: 'F',
        content: '修复“新增订单”页面“存入模板”开关关闭时仍存入模板'
      }
    ]
  },
  {
    versionNumber: '1.0.2',
    releaseDate: '2025-03-07',
    logs: [
      {
        type: 'U',
        content: '“订单详情”页面支持复制订单 ID'
      }
    ]
  },
  {
    versionNumber: '1.0.1',
    releaseDate: '2025-03-07',
    logs: [
      {
        type: 'U',
        content: '订单支持设置备注'
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
          <div>{{ item.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>