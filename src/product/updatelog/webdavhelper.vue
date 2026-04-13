<script setup>
document.title = '轩铭2512 - 更新日志 - WebDAV 助手'
const data = [
  {
    versionNumber: '1.0.1.1',
    releaseDate: '2026-04-13',
    logs: [
      {
        type: 'F',
        content: '上传、下载文件时可能会报错'
      }
    ]
  },
  {
    versionNumber: '1.0.1.0',
    releaseDate: '2026-04-08',
    logs: [
      {
        type: 'A',
        content: '我的 - 设置 - 通用 - 通用 新增 性能 - 刷新最佳地址、最佳地址'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 通用 - 通用 - 更多 - 应用启动后拉起切换账号弹窗 调整为 应用启动后显示账号列表'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 更多 - 其他 - 清理数据 - 设置 新增 高级，支持按键粒度清理'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 关于 新增 邀请测试'
      },
      {
        type: 'A',
        content: "调试 - 设置 新增 隐藏功能 - 鸿蒙应用搜索、Let's Encrypt RSS"
      },
      {
        type: 'A',
        content: '调试 - 设置 - 基础 - 自动上传故障日志类型 新增 ArkWeb 抛滑丢帧'
      },
      {
        type: 'U',
        content: '持久化用户首选项存储模式调整为 GSKV（以前为 XML），提升读写性能'
      },
      {
        type: 'U',
        content: '底部导航栏（HdsTabs 组件）适配 API23 悬浮样式、沉浸光感视效'
      },
      {
        type: 'U',
        content: '电脑端左侧导航栏调整为侧边栏（HdsSideMenu 组件）'
      },
      {
        type: 'U',
        content: 'HdsNavigation、HdsNavDestination 组件标题栏适配 API23 沉浸光感视效'
      },
      {
        type: 'U',
        content: '功能下线：显示方向跟随传感器旋转'
      }
    ]
  },
  {
    versionNumber: '1.0.0.3',
    releaseDate: '2026-02-23',
    logs: [
      {
        type: 'U',
        content: '桌面、锁屏卡片中显示快捷入口名称'
      }
    ]
  },
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