<script setup>
document.title = '轩铭2512 - 更新日志 - 密码智能备忘录'
const data = [
  {
    versionNumber: '1.1.2.0',
    releaseDate: '2025-05-16',
    logs: [
      {
        type: 'A',
        content: '新增静态快捷方式（长按桌面应用图标）：新增密码、搜索密码'
      },
      {
        type: 'A',
        content: '电脑端支持右键 txt 文件导入数据（此功能目前无法使用，为能力预埋）'
      },
      {
        type: 'F',
        content: 'WLAN 断开时调试页面不显示应用安装、缓存、其他文件存储空间信息'
      }
    ]
  },
  {
    versionNumber: '1.1.1.0',
    releaseDate: '2025-05-15',
    logs: [
      {
        type: 'A',
        content: '我的 新增 密码随机生成'
      },
      {
        type: 'U',
        content: '权限管理页面中的“系统设置”文本支持点击跳转系统设置应用权限管理页面'
      },
      {
        type: 'F',
        content: '登录、应用服务模式页面查看的隐私政策可能不是最新版本'
      }
    ]
  },
  {
    versionNumber: '1.1.0.0',
    releaseDate: '2025-05-15',
    logs: [
      {
        type: 'A',
        content: '新增 AI 助手'
      },
      {
        type: 'A',
        content: '支持付费开通会员'
      },
      {
        type: 'U',
        content: '修改登录到期时间相关逻辑'
      },
      {
        type: 'U',
        content: '登录弹窗删除冗余取消禁止截、录屏逻辑'
      },
      {
        type: 'F',
        content: '设置、会员中心页面刷新会员状态逻辑不完善'
      },
      {
        type: 'F',
        content: '会员开通记录页面加载动画位置错误'
      }
    ]
  },
  {
    versionNumber: '1.0.2.1',
    releaseDate: '2025-05-12',
    logs: [
      {
        type: 'F',
        content: '用其他应用打开文件管理、微信等第三方应用中的 txt 文件时“选择打开方式”弹窗中无本应用'
      }
    ]
  },
  {
    versionNumber: '1.0.2.0',
    releaseDate: '2025-05-10',
    logs: [
      {
        type: 'A',
        content: '支持打开文件管理、微信等第三方应用中的 txt 文件用于导入数据'
      },
      {
        type: 'U',
        content: '我的 - 密码安全检查 - 重复按使用账号数从大到小排序、不显示使用账号数为 1 的'
      },
      {
        type: 'F',
        content: '设置页面未登录账号时上间距不正确'
      }
    ]
  },
  {
    versionNumber: '1.0.1.1',
    releaseDate: '2025-05-10',
    logs: [
      {
        type: 'U',
        content: '修改部分页面上间距'
      },
      {
        type: 'U',
        content: '修改页面间通信实现方式'
      },
      {
        type: 'F',
        content: '底部导航栏页面非首次进入时未刷新'
      }
    ]
  },
  {
    versionNumber: '1.0.1.0',
    releaseDate: '2025-05-09',
    logs: [
      {
        type: 'A',
        content: '我的 新增 密码安全检查'
      },
      {
        type: 'A',
        content: '支持创建应用分身（最多 5 个）'
      },
      {
        type: 'U',
        content: '修改底部导航栏实现方式'
      },
      {
        type: 'U',
        content: '修改部分场景禁止截、录屏时机'
      },
      {
        type: 'U',
        content: '提升数据库查询性能'
      },
      {
        type: 'U',
        content: '调试页面删减部分信息'
      },
      {
        type: 'U',
        content: '删除冗余图标资源文件，减小包体积'
      },
      {
        type: 'U',
        content: '仅信任系统预置的 CA 证书，不信任用户安装的 CA 证书，提高安全性'
      }
    ]
  },
  {
    versionNumber: '1.0.0.1',
    releaseDate: '2025-05-08',
    logs: [
      {
        type: 'U',
        content: '筛选密码弹窗推荐标签与已添加标签间添加分隔线'
      },
      {
        type: 'U',
        content: '优化兑换码获取方式文本'
      },
      {
        type: 'U',
        content: '优化设备间同步数据状态弹窗文本'
      },
      {
        type: 'U',
        content: '我的 - 设置 - 已收集个人信息清单 - 故障日志 - 信息内容点击即可跳转故障日志页面'
      },
      {
        type: 'U',
        content: '修改查看用户协议的逻辑'
      },
      {
        type: 'U',
        content: '修改公安备案注册时间'
      },
      {
        type: 'U',
        content: '修改启动时检查更新判断是否在 WLAN 下的逻辑'
      },
      {
        type: 'F',
        content: '绑定华为账号页面“华为账号登录”按钮上方间距不正确'
      },
      {
        type: 'F',
        content: '兑换码获取方式文本行间距不正确'
      },
      {
        type: 'F',
        content: '导入自定义密钥成功后密钥页面未自动刷新'
      },
      {
        type: 'F',
        content: '查看的隐私政策可能不是最新版本'
      },
      {
        type: 'F',
        content: '有新版本时点击却再次检查更新'
      }
    ]
  },
  {
    versionNumber: '1.0.0.0',
    releaseDate: '2025-05-07',
    logs: [
      {
        type: 'A',
        content: '第一版本（邀请测试）'
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