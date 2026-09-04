<script setup>
document.title = '轩铭2512 - 更新日志 - 智能待办'
const data = [
  {
    versionNumber: '1.1.1.1',
    releaseDate: '2026-08-11',
    logs: [
      {
        type: 'A',
        content: '我的 - 设置 - 数据 - 设备间同步 - 系统日历 - 手动同步支持选择同步到其它系统日历'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 通用 - 通用 - 应用 新增 图标模式'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 通用 - 通用 - 功能 - 自定义重复周期 新增 导入、支持导出'
      },
      {
        type: 'A',
        content: '调试 - 设置 - 基础 - 自动上传故障日志类型 新增 应用冻屏告警'
      },
      {
        type: 'A',
        content: '调试 - 设置 - 基础 - 转储虚拟机原始堆快照 新增 进程'
      },
      {
        type: 'A',
        content: '调试 - 设置 - 网络 新增 低电量时进入低功耗模式'
      },
      {
        type: 'U',
        content: '单击（鼠标左键）查看待办详情'
      },
      {
        type: 'U',
        content: '开启应用级沉浸光感'
      },
      {
        type: 'U',
        content: '图标按钮鼠标悬浮在其上时显示功能提示悬浮气泡（仅电脑端可用）'
      },
      {
        type: 'U',
        content: '功能下线：我的 - 设置 - 数据 - 设备间同步 - 暂停自动同步'
      },
      {
        type: 'U',
        content: '功能下线：我的 - 设置 - 数据 - 备份与恢复 - 暂停自动同步'
      },
      {
        type: 'U',
        content: '功能下线：调试 - 设置 - 基础 - 电池电量低'
      }
    ]
  },
  {
    versionNumber: '1.1.1.0',
    releaseDate: '2026-06-07',
    logs: [
      {
        type: 'A',
        content: '团队待办已可用'
      }
    ]
  },
  {
    versionNumber: '1.1.0.0',
    releaseDate: '2026-05-31',
    logs: [
      {
        type: 'A',
        content: '我的 新增 团队'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 通用 - 通用 - 应用 新增 状态栏内容（仅电脑端可用）'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 通用 - 通用 - 功能 新增 推荐待办显示已完成待办'
      },
      {
        type: 'A',
        content: '小艺智能体已可用（待办 - 右上角小艺智能体图标按钮）'
      }
    ]
  },
  {
    versionNumber: '1.0.0.2',
    releaseDate: '2026-05-29',
    logs: [
      {
        type: 'U',
        content: '推荐待办、待办列表在不同响应式断点下显示不同列数'
      }
    ]
  },
  {
    versionNumber: '1.0.0.1',
    releaseDate: '2026-05-25',
    logs: [
      {
        type: 'A',
        content: '我的 - 设置 - 云备份 新增 自动导入（登录轩铭 2512 统一账号时可见）'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 通用 - 通用 - 界面 - 深色模式 新增 跟随环境光（仅搭载环境光传感器的设备可用）'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 通用 - 通用 - 功能 新增 桌面应用图标角标显示可完成待办数量'
      },
      {
        type: 'A',
        content: '调试 - 设置 - 基础 新增 提示系统进行 GC、转储当前线程虚拟机原始堆快照'
      },
      {
        type: 'A',
        content: '“推荐待办”卡片新增 2*2 规格，可在设备待机屏保界面上显示'
      },
      {
        type: 'U',
        content: '“待办”支持鼠标框选多选、已过结束时间待办的内容显示为红色'
      },
      {
        type: 'U',
        content: '部分场景适配键盘快捷键'
      },
      {
        type: 'U',
        content: '卡片开启模糊背板'
      },
      {
        type: 'F',
        content: 'CalDAV 备份多个待办时可能失败'
      }
    ]
  },
  {
    versionNumber: '1.0.0.0',
    releaseDate: '2026-05-18',
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