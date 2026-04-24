<script setup>
document.title = '轩铭2512 - 更新日志 - Home Assistant 助手'
const data = [
  {
    versionNumber: '1.0.0.5',
    releaseDate: '2026-04-24',
    logs: [
      {
        type: 'U',
        content: '平板端支持使用碰一碰、隔空传送功能'
      }
    ]
  },
  {
    versionNumber: '1.0.0.4',
    releaseDate: '2026-04-20',
    logs: [
      {
        type: 'A',
        content: '我的 - 设置 - 更多 - 其他 - 清理数据 - 缓存 新增 实体图标'
      },
      {
        type: 'U',
        content: '优化首页 - 状态显示效果'
      }
    ]
  },
  {
    versionNumber: '1.0.0.3',
    releaseDate: '2026-04-19',
    logs: [
      {
        type: 'A',
        content: '首页 - 状态 新增 删除'
      },
      {
        type: 'U',
        content: '服务调用成功后自动刷新首页'
      }
    ]
  },
  {
    versionNumber: '1.0.0.2',
    releaseDate: '2026-04-18',
    logs: [
      {
        type: 'A',
        content: '我的 - 设置 - 更多 - 其他 - 清理数据 - 日志 新增 HTTP 请求 Home Assistant 服务器失败'
      },
      {
        type: 'A',
        content: '调试 - 设置 - 基础 新增 保存 HTTP 请求 Home Assistant 服务器失败日志'
      },
      {
        type: 'U',
        content: '优化首页 - 状态显示效果'
      }
    ]
  },
  {
    versionNumber: '1.0.0.1',
    releaseDate: '2026-04-18',
    logs: [
      {
        type: 'U',
        content: '首页 - 服务 - 调用支持输入类型新增 entity、config_entry、theme、object、statistic、state、conversation_agent、media、area、duration、color_rgb、color_temp'
      }
    ]
  },
  {
    versionNumber: '1.0.0.0',
    releaseDate: '2026-04-16',
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