<script setup>
document.title = '轩铭2512 - 更新日志 - 群晖 DSM 助手'
const data = [
  {
    versionNumber: '1.0.1.3',
    releaseDate: '2025-10-10',
    logs: [
      {
        type: 'U',
        content: '支持使用 QuickConnect ID 登录'
      },
      {
        type: 'U',
        content: '请求 DSM 失败弹窗文本改为“DSM 请求失败，错误码：xxx”（以前为“请求失败 / 发生错误，错误码：xxx”）'
      }
    ]
  },
  {
    versionNumber: '1.0.1.2',
    releaseDate: '2025-10-09',
    logs: [
      {
        type: 'U',
        content: '新密码账号登录成功时自动删除旧密码账号'
      },
      {
        type: 'U',
        content: '退出登录时支持选择是否注销会话'
      },
      {
        type: 'U',
        content: '部分已知错误码显示用户友好化的错误信息'
      },
      {
        type: 'U',
        content: '自动上传故障日志类型默认值调整为“js 运行异常、应用崩溃、应用冻屏、应用查杀、资源泄漏、地址越界”（默认关闭与性能相关的类型，降低因故障日志自动上传导致操作被中断的概率）'
      }
    ]
  },
  {
    versionNumber: '1.0.1.1',
    releaseDate: '2025-10-07',
    logs: [
      {
        type: 'U',
        content: '支持登录开启 MFA 二次验证的账号'
      },
      {
        type: 'F',
        content: '手动关闭通知权限后，应用冷启动时会报错'
      }
    ]
  },
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