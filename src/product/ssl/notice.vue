<script setup>
document.title = '轩铭2512 - SSL 证书 - 通知管理'
import { ref } from 'vue'
import cookie from 'js-cookie'
import validator from 'validator'
import request from '../../request'
const accesstoken = cookie.get('accessToken')
const webhookurl = ref('')
const webhooktoken = ref('')
const webhookdialog = ref(false)
const url = ref('')
const noticeszt = ref({})
const notices = ref([
  {
    name: '额度变更',
    emailname: 'ssl_email_limitchange',
    webhookname: 'ssl_webhook_limitchange'
  },
  {
    name: '额度耗尽',
    emailname: 'ssl_email_limitempty',
    webhookname: 'ssl_webhook_limitempty'
  },
  {
    name: '自动新增续期订单结果',
    emailname: 'ssl_email_autoneworderresult',
    webhookname: 'ssl_webhook_autoneworderresult'
  },
  {
    name: '自动提交订单结果',
    emailname: 'ssl_email_autosubmitorderresult',
    webhookname: 'ssl_webhook_autosubmitorderresult'
  },
  {
    name: '订单状态变更',
    emailname: 'ssl_email_orderstatuschange',
    webhookname: 'ssl_webhook_orderstatuschange'
  },
  {
    name: 'DNS 自动配置任务状态变更',
    emailname: 'ssl_email_autodnstaskstatuschange',
    webhookname: 'ssl_webhook_autodnstaskstatuschange'
  },
  {
    name: '订单即将到期',
    emailname: 'ssl_email_ordernearexpire',
    webhookname: 'ssl_webhook_ordernearexpire'
  },
  {
    name: '证书即将到期',
    emailname: 'ssl_email_certificatenearexpire',
    webhookname: 'ssl_webhook_certificatenearexpire'
  }
])
async function getUserInfo() {
  const res = await request({
    apiPath: '/product/getUserInfo',
    body: {
      accessToken: accesstoken,
      product: 'ssl'
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  webhookurl.value = res.data.webhookUrl
  webhooktoken.value = res.data.webhookToken
  url.value = res.data.webhookUrl
  const noticesetting = res.data.noticeSetting
  const noticenames = [
    'ssl_email_limitchange',
    'ssl_webhook_limitchange',
    'ssl_email_limitempty',
    'ssl_webhook_limitempty',
    'ssl_email_autoneworderresult',
    'ssl_webhook_autoneworderresult',
    'ssl_email_autosubmitorderresult',
    'ssl_webhook_autosubmitorderresult',
    'ssl_email_orderstatuschange',
    'ssl_webhook_orderstatuschange',
    'ssl_email_autodnstaskstatuschange',
    'ssl_webhook_autodnstaskstatuschange',
    'ssl_email_ordernearexpire',
    'ssl_webhook_ordernearexpire',
    'ssl_email_certificatenearexpire',
    'ssl_webhook_certificatenearexpire'
  ]
  noticenames.forEach(item => {
    if (noticesetting.includes(item)) {
      noticeszt.value[item] = true
    } else {
      noticeszt.value[item] = false
    }
  })
}
getUserInfo()
function copy() {
  navigator.clipboard.writeText(webhooktoken.value)
  TinyModal.message({
    message: '内容已复制',
    status: 'success'
  })
}
function openWebhookDialog() {
  webhookdialog.value = true
}
function closeWebhookDialog() {
  webhookdialog.value = false
  url.value = ''
}
async function setWebhookUrl() {
  if (!validator.isURL(url.value, {
    protocols: ['https'],
    require_protocol: true
  })) {
    TinyModal.message({
      message: '请输入有效的 Webhook 推送地址',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/product/setWebhookUrl',
    body: {
      accessToken: accesstoken,
      product: 'ssl',
      webhookUrl: url.value
    }
  })
  closeWebhookDialog()
  TinyModal.message({
    message: '设置成功',
    status: 'success'
  })
  getUserInfo()
}
async function change(noticename, zt) {
  let wz = '开启'
  if (zt == false) {
    wz = '关闭'
  }
  await request({
    apiPath: '/product/updateNoticeSetting',
    body: {
      accessToken: accesstoken,
      noticeName: noticename
    }
  })
  TinyModal.message({
    message: wz + '成功',
    status: 'success'
  })
  getUserInfo()
}
</script>

<template>
  <div>
    <div class="cz">
      <tiny-alert :closable="false"
        description="邮箱发件人：zhangls2512@vip.qq.com；Webhook 请求 IP：81.68.129.229。建议添加白名单防止通知推送被拦截。"></tiny-alert>
      <div class="large-bold-text">邮箱</div>
      <tiny-alert :closable="false" description="默认将账号注册邮箱用作通知推送的收件箱，目前不支持修改。"></tiny-alert>
      <div class="large-bold-text">Webhook</div>
      <tiny-alert :closable="false"
        description="设置后，服务器会向地址发送 HTTP POST 请求推送通知，请求体为 JSON 对象，含有 noticeName 和其他字段，其他字段因通知类型不同有差异。"></tiny-alert>
      <div class="sp">
        <div>推送地址：<span v-if="!webhookurl">未设置</span><span v-if="webhookurl">{{ webhookurl }}</span>
        </div>
        <tiny-button type="info" @click="openWebhookDialog">设置</tiny-button>
      </div>
      <div class="large-bold-text">接收状态</div>
      <div class="sp">
        <div class="item">
          <div class="bold-text">名称</div>
        </div>
        <div class="item">
          <div class="bold-text">邮箱</div>
        </div>
        <div class="item">
          <div class="bold-text">Webhook</div>
        </div>
      </div>
      <div v-for="item in notices" class="sp">
        <div class="item">{{ item.name }}</div>
        <div class="item">
          <tiny-switch v-model="noticeszt[item.emailname]" @change="(zt) => change(item.emailname, zt)"></tiny-switch>
        </div>
        <div class="item">
          <tiny-switch v-model="noticeszt[item.webhookname]"
            @change="(zt) => change(item.webhookname, zt)"></tiny-switch>
        </div>
      </div>
    </div>
    <tiny-dialog-box class="dialog" :visible="webhookdialog" title="设置 Webhook 推送地址" @close="closeWebhookDialog">
      <div class="dialog-cz">
        <div class="sp">
          <div>webhookToken：{{ webhooktoken }}</div>
          <tiny-button type="info" @click="copy">复制</tiny-button>
        </div>
        <tiny-input v-model="url" type="url" clearable placeholder="请输入 Webhook 推送地址（仅支持 HTTPS）"></tiny-input>
        <div>提示：</div>
        <div>1. 让 Webhook 推送地址/xm2512webhooktoken/ssl 返回 webhookToken。</div>
        <div>2. 点击“设置”按钮向服务器发送设置请求。</div>
        <div>3. 服务器收到设置请求后会向输入的 Webhook 推送地址/xm2512webhooktoken/ssl 发送 HTTP GET 请求，检查响应体是否是正确的 webhookToken。</div>
        <div>4. 如输入的 Webhook 推送地址限制入站 IP ，须放行验证服务器 IP：81.68.129.229，以免因验证请求被阻止导致验证失败。</div>
        <div>5. 服务器发送验证请求后等待 5 秒，如果未收到响应即验证失败。请保证输入的 Webhook 推送地址网络通畅，以免因验证请求超时导致验证失败。</div>
      </div>
      <template #footer>
        <tiny-button type="info" @click="setWebhookUrl">设置</tiny-button>
      </template>
    </tiny-dialog-box>
  </div>
</template>

<style scoped>
.item {
  text-align: center;
  width: 33%;
}
</style>