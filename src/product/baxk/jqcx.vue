<script setup>
document.title = '轩铭2512 - 备案许可'
const endyear = new Date().getFullYear()
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import moment from 'moment-timezone'
import request from '../../request'
const route = useRoute()
const baxknumber = ref('')
const visible = ref(false)
const info = ref({})
if (typeof (route.query.baxknumber) == 'string') {
  baxknumber.value = route.query.baxknumber
}
async function getInfo() {
  visible.value = false
  if (baxknumber.value === '') {
    TinyModal.message({
      message: '请输入备案/许可号',
      status: 'warning'
    })
    return
  }
  const res = await request({
    apiPath: '/baxk/getBaxkInfo',
    body: {
      baxkNumber: baxknumber.value
    }
  })
  TinyModal.message({
    message: '查询成功',
    status: 'success'
  })
  let data = res.data
  const maintypemap = {
    '0': '许可',
    '1': '产品备案',
    '2': '特殊场景适配备案',
    '3': '隐私安全备案',
    '4': '算法备案'
  }
  const specificmap = {
    '0': {
      '0': '成人信息服务',
      '1': '敏感信息收集处理服务'
    },
    '1': {
      '0': '网页',
      '1': '微信小程序',
      '2': '鸿蒙原生应用',
      '3': '鸿蒙元服务'
    },
    '2': {
      '0': '适老化',
      '1': '未成年',
      '2': '无障碍',
      '3': '大小屏',
      '4': '特殊网络环境',
      '5': '深色模式',
      '6': '多语言'
    },
    '4': {
      '0': '个性化推送类',
      '1': '排序精选类',
      '2': '检索过滤类',
      '3': '调度决策类',
      '4': '生成合成类'
    }
  }
  data.specificType = specificmap[res.data.mainType][res.data.specificType]
  data.mainType = maintypemap[res.data.mainType]
  data.date = moment(res.data.date).format('YYYY-MM-DD HH:mm:ss')
  info.value = data
  visible.value = true
}
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="sp">
        <img class="tx" src="/logo.jpg" loading="lazy" />
        <div class="header-title">备案许可</div>
      </div>
    </div>
    <div class="main">
      <div class="cz">
        <div class="sp">
          <tiny-input v-model="baxknumber" clearable placeholder="请输入备案/许可号"></tiny-input>
          <tiny-button type="info" @click="getInfo">查询</tiny-button>
        </div>
        <div v-if="visible == true">
          <div class="cz">
            <div class="bold-text">为了保护网络信息安全，保障公民、法人和其他组织的合法权益，维护国家安全和社会公共利益，轩铭2512将备案/许可信息公布如下：</div>
            <div class="grid">
              <div class="grid-item-left">产品号</div>
              <div class="grid-item-right">{{ info.productNumber }}</div>
              <div class="grid-item-left">类型</div>
              <div class="grid-item-right">{{ info.mainType }}</div>
              <div v-if="info.mainType == '产品备案'" class="grid-item-left">产品名称</div>
              <div v-if="info.mainType == '产品备案'" class="grid-item-right">{{ info.productName }}</div>
              <div v-if="info.mainType != '隐私安全备案' && info.mainType != '产品备案'" class="grid-item-left">具体类型</div>
              <div v-if="info.mainType != '隐私安全备案' && info.mainType == '产品备案'" class="grid-item-left">运行平台</div>
              <div v-if="info.mainType != '隐私安全备案'" class="grid-item-right">{{ info.specificType }}</div>
              <div class="grid-item-left">描述</div>
              <div class="grid-item-right">{{ info.desc }}</div>
              <div class="grid-item-left">备案/许可号</div>
              <div class="grid-item-right">{{ info.baxkNumber }}</div>
              <div class="grid-item-left">更新时间</div>
              <div class="grid-item-right">{{ info.date }}</div>
            </div>
            <tiny-alert :closable="false" description="您如果发现该备案/许可信息与实际情况不符或涉嫌违反国家法律、法规，可联系客服举报。"></tiny-alert>
          </div>
        </div>
      </div>
    </div>
    <div class="empty"></div>
    <div class="footer">
      <div class="cz">
        <div class="sp">
          <a class="footer-text" href="mailto:2300990296@qq.com">联系邮箱：2300990296@qq.com</a>
          <tiny-divider direction="vertical"></tiny-divider>
          <div class="footer-text">联系微信：gerenyinsi_z07x17m</div>
          <tiny-divider direction="vertical"></tiny-divider>
          <a class="footer-text"
            href="https://chatbot.weixin.qq.com/webapp/5e2JglFAERGl06z0FkTK6eWL6D1Oa5?robotName=轩铭2512产品客服"
            target="_blank">在线客服</a>
          <tiny-divider direction="vertical"></tiny-divider>
          <a class="footer-text" href="https://pd.qq.com/s/cnx7f1zdm" target="_blank">腾讯频道</a>
        </div>
        <div class="footer-text">Copyright © {{ endyear }} Zhang Xuanming. All Rights Reserved. 张轩铭 版权所有</div>
        <div class="sp">
          <a class="footer-text" href="/product/baxk/jqcx?baxknumber=轩铭2512品备4号-W" target="_blank">轩铭2512品备4号-W</a>
          <tiny-divider direction="vertical"></tiny-divider>
          <div class="footer-text">Version 1.0.0</div>
          <tiny-divider direction="vertical"></tiny-divider>
          <router-link class="footer-text" to="/product/doc/baxk" target="_blank">文档中心</router-link>
          <tiny-divider direction="vertical"></tiny-divider>
          <router-link class="footer-text" to="/product/updatelog/baxk" target="_blank">更新日志</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 0;
  width: 100%;
}

.main {
  justify-content: center;
}

.grid {
  grid-template-columns: auto auto;
}

.grid-item-left {
  font-weight: bold;
  text-align: right;
}

.grid-item-right {
  text-align: left;
}

.bold-text {
  color: red;
}
</style>