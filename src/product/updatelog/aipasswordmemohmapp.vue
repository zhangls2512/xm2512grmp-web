<script setup>
document.title = '轩铭2512 - 更新日志 - 密码智能备忘录'
const data = [
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