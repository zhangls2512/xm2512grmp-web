<script setup>
document.title = '轩铭2512 - 更新日志 - WebDAV 助手'
const data = [
  {
    versionNumber: '1.0.0.2',
    releaseDate: '2026-02-15',
    logs: [
      {
        type: 'F',
        content: '长按（鼠标右键）删除单个文件或目录成功后未刷新“文件”页面'
      },
      {
        type: 'F',
        content: '我的 - 设置 - 通用 - 通用 - 更多 - 应用启动后拉起切换账号弹窗未生效'
      }
    ]
  },
  {
    versionNumber: '1.0.0.1',
    releaseDate: '2026-02-14',
    logs: [
      {
        type: 'A',
        content: '调试 - 设置 - 基础 - 自动上传故障日志类型 新增 音频卡顿'
      },
      {
        type: 'U',
        content: '自动上传故障日志类型默认值调整为“js 运行异常、崩溃”（默认关闭日志不详细的类型，降低因故障日志自动上传导致操作被中断的概率）'
      },
      {
        type: 'U',
        content: '应用启动时自动清理无用数据，同时下线我的 - 设置 - 更多 - 其他 - 清理数据 - 无用数据'
      }
    ]
  },
  {
    versionNumber: '1.0.0.0',
    releaseDate: '2026-02-11',
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