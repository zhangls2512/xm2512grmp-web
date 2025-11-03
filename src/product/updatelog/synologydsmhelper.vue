<script setup>
document.title = '轩铭2512 - 更新日志 - 群晖 DSM 助手'
const data = [
  {
    versionNumber: '1.0.2.12',
    releaseDate: '2025-11-03',
    logs: [
      {
        type: 'U',
        content: '“文件”修改刷新动画显示位置'
      },
      {
        type: 'U',
        content: '电脑端部分组件鼠标悬浮在其上时其背景颜色会变化'
      },
      {
        type: 'F',
        content: '移动单个文件（夹）时错误执行了复制操作'
      },
      {
        type: 'F',
        content: '进入我的 - 设置 - 关于时可能会报错'
      },
      {
        type: 'F',
        content: '电脑端鼠标右键未弹出菜单'
      }
    ]
  },
  {
    versionNumber: '1.0.2.11',
    releaseDate: '2025-11-01',
    logs: [
      {
        type: 'U',
        content: '调试 - 设置 - 网络 新增 连接 DSM 时跳过 SSL 验证'
      },
      {
        type: 'F',
        content: '解析消息获取其时间时可能会报错'
      },
      {
        type: 'F',
        content: '无后缀名文件获取其对应类型的图标时会报错'
      }
    ]
  },
  {
    versionNumber: '1.0.2.10',
    releaseDate: '2025-10-31',
    logs: [
      {
        type: 'F',
        content: '横屏时底部导航栏页面无上间距'
      },
      {
        type: 'F',
        content: '“文件”多选界面未适配大字场景'
      }
    ]
  },
  {
    versionNumber: '1.0.2.9',
    releaseDate: '2025-10-30',
    logs: [
      {
        type: 'A',
        content: '文件支持多选批量复制、移动、删除'
      },
      {
        type: 'A',
        content: '我的 - 设置 - 关于 新增 资质证照'
      },
      {
        type: 'U',
        content: '“文件”支持侧滑返回上级文件夹'
      },
      {
        type: 'U',
        content: '显示方向跟随传感器旋转'
      }
    ]
  },
  {
    versionNumber: '1.0.2.8',
    releaseDate: '2025-10-22',
    logs: [
      {
        type: 'U',
        content: '“文件”顶部操作区不跟随页面滚动'
      },
      {
        type: 'U',
        content: '复制、移动文件时右上角叉、勾图标颜色分别改为红、绿'
      },
      {
        type: 'F',
        content: '“文件”刷新逻辑错误'
      },
      {
        type: 'F',
        content: '部分界面未适配大字场景'
      }
    ]
  },
  {
    versionNumber: '1.0.2.7',
    releaseDate: '2025-10-22',
    logs: [
      {
        type: 'A',
        content: '我的 - 设置 - 账号 新增 设备间同步'
      },
      {
        type: 'U',
        content: '适配大字场景'
      }
    ]
  },
  {
    versionNumber: '1.0.2.6',
    releaseDate: '2025-10-20',
    logs: [
      {
        type: 'U',
        content: '“文件”根据文件后缀名显示对应类型的图标'
      }
    ]
  },
  {
    versionNumber: '1.0.2.5',
    releaseDate: '2025-10-19',
    logs: [
      {
        type: 'A',
        content: '音视频文件预览方式调整为在线播放'
      }
    ]
  },
  {
    versionNumber: '1.0.2.4',
    releaseDate: '2025-10-16',
    logs: [
      {
        type: 'A',
        content: '支持复制、移动文件（夹）'
      },
      {
        type: 'U',
        content: '“文件”中“新建文件夹”按钮调整为圆形透明图标按钮'
      },
      {
        type: 'U',
        content: '新建文件夹、重命名文件（夹）成功时才刷新“文件”页面'
      },
      {
        type: 'U',
        content: '修改校验下载文件完整性的逻辑'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 通用 - 更多 - 流量下载提醒 调整为 流量使用提醒'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 更多 - 其他 - 清理数据 - 无用数据 调整为 临时文件、无用通用设置'
      },
      {
        type: 'U',
        content: '应用字体最大放大倍数调整为 1.75'
      },
      {
        type: 'F',
        content: '会话注销失败时错误删除了账号'
      }
    ]
  },
  {
    versionNumber: '1.0.2.3',
    releaseDate: '2025-10-14',
    logs: [
      {
        type: 'U',
        content: '修改校验下载文件完整性的逻辑'
      },
      {
        type: 'U',
        content: '未联网状态应用冷启动时不检查更新'
      },
      {
        type: 'F',
        content: '导入账号时可能会报错'
      },
      {
        type: 'F',
        content: '登录态自动续期触发时机错误'
      }
    ]
  },
  {
    versionNumber: '1.0.2.2',
    releaseDate: '2025-10-13',
    logs: [
      {
        type: 'A',
        content: '我的 - 设置 - 通用 - 更多 新增 流量下载提醒'
      },
      {
        type: 'U',
        content: '进入新建文件夹、重命名页面时输入框自动获焦'
      },
      {
        type: 'U',
        content: '支持应用在后台时下载文件'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 通用 - 更多 - 启动时检查更新选项“仅 WLAN 下”调整为“非流量下”'
      },
      {
        type: 'U',
        content: '应用字体最大放大倍数调整为 2'
      },
      {
        type: 'U',
        content: '功能下线：我的 - 设置 - 通用 - 界面 - 敏感页面禁止截、录屏（原因：系统默认在输入密码时开启禁止截、录屏）'
      },
      {
        type: 'U',
        content: '功能下线：车机（原因：本应用部分功能不支持在此类型设备上使用）'
      }
    ]
  },
  {
    versionNumber: '1.0.2.1',
    releaseDate: '2025-10-13',
    logs: [
      {
        type: 'A',
        content: '“文件”新增搜索框（非根目录时可见）、左上角返回上级目录按钮、下拉刷新'
      },
      {
        type: 'A',
        content: '清理数据 新增 无用数据'
      },
      {
        type: 'U',
        content: '支持预览文件的大小上限调整为 1 GB'
      },
      {
        type: 'U',
        content: '删除底部导航栏页面与底部导航栏之间的间距'
      },
      {
        type: 'U',
        content: '底部导航栏背景添加模糊效果'
      },
      {
        type: 'F',
        content: '深色模式下卡片背景颜色不正确'
      },
      {
        type: 'F',
        content: '预览临时文件存储目录错误'
      },
      {
        type: 'F',
        content: '文件下载成功时可能会报错'
      },
      {
        type: 'F',
        content: '根目录文件夹重命名成功后文件夹消失'
      },
      {
        type: 'F',
        content: '全局捕获到异常时可能会报错'
      }
    ]
  },
  {
    versionNumber: '1.0.2.0',
    releaseDate: '2025-10-11',
    logs: [
      {
        type: 'A',
        content: '新增“文件”'
      },
      {
        type: 'A',
        content: '设置 新增 账号，支持导入（本地无账号时可见）、导出本地账号数据'
      },
      {
        type: 'U',
        content: '消息 新增 清除全部'
      },
      {
        type: 'U',
        content: '功能下线：“消息”分页加载（原因：默认即获取全部，无需分页加载）'
      },
      {
        type: 'U',
        content: '功能下线：底部导航栏（Tab 组件）背后变模糊并叠加在上方页面之上（原因：可能遮挡上方页面底部的内容）'
      },
      {
        type: 'U',
        content: '功能下线：部分已知错误码显示用户友好化的错误信息（原因：不同 API 可能返回值相同但问题原因不同的错误码，导致显示的错误信息可能与实际问题原因不符）'
      }
    ]
  },
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