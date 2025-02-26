<script setup>
document.title = '轩铭2512 - 管理后台 - 通知管理'
import { ref } from 'vue'
import cookie from 'js-cookie'
import validator from 'validator'
import request from '../../request'
const accesstoken = cookie.get('accessToken')
const webhookurl = ref('')
const webhooktoken = ref('')
const webhookdialog = ref(false)
const url = ref('')
async function getUserInfo() {
  const res = await request({
    apiPath: '/product/getUserInfo',
    body: {
      accessToken: accesstoken,
      product: 'admin'
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  webhookurl.value = res.data.webhookUrl
  webhooktoken.value = res.data.webhookToken
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
      product: 'admin',
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
</script>

<template>
  <div>
    <div class="cz">
      <tiny-alert :closable="false"
        description="邮箱发件人：zhangls2512@vip.qq.com；Webhook 请求 IP：81.68.129.229。建议添加白名单防止通知被拦截。"></tiny-alert>
      <div class="large-bold-text">Webhook</div>
      <tiny-alert :closable="false"
        description="设置后，服务器会向地址发送 HTTP POST 请求推送通知，请求体为 JSON 对象，含有 noticeName 和其他字段，其他字段因通知类型不同有差异。"></tiny-alert>
      <div class="sp">
        <div class="text">地址：<span v-if="!webhookurl">未设置</span><span v-if="webhookurl">{{ webhookurl }}</span>
        </div>
        <tiny-button type="info" @click="openWebhookDialog">设置</tiny-button>
      </div>
    </div>
    <tiny-dialog-box class="dialog" :visible="webhookdialog" title="设置 Webhook 推送地址" @close="closeWebhookDialog">
      <div class="dialog-cz">
        <div class="sp">
          <div class="text">webhookToken：{{ webhooktoken }}</div>
          <tiny-button type="info" @click="copy">复制</tiny-button>
        </div>
        <tiny-input v-model="url" clearable placeholder="请输入 Webhook 推送地址（仅支持 HTTPS ）"></tiny-input>
        <div class="text">提示：</div>
        <div class="text">1. 在输入的 Webhook 推送地址目录下新建一个名为 admin 的文件夹，在其中放置一个名为 xm2512webhooktoken.txt 、内容为 webhookToken 的
          TXT 文本文件。</div>
        <div class="text">2. 点击“设置”按钮向服务器发送设置请求。</div>
        <div class="text">3. 服务器收到设置请求后会向输入的 Webhook 推送地址/admin/xm2512webhooktoken.txt 发送 HTTP GET 请求，检查响应体是否是正确的
          webhookToken。</div>
        <div class="text">4. 如输入的 Webhook 推送地址限制入站 IP ，须放行验证服务器 IP：81.68.129.229，以免因验证请求被阻止导致验证失败。</div>
        <div class="text">5. 服务器发送验证请求后等待 20 秒，如果未收到响应即验证失败。请保证输入的 Webhook 推送地址网络通畅，以免因验证请求超时导致验证失败。</div>
      </div>
      <template #footer>
        <tiny-button type="info" @click="setWebhookUrl">设置</tiny-button>
      </template>
    </tiny-dialog-box>
  </div>
</template>