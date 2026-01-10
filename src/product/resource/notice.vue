<script setup>
document.title = '轩铭2512 - 资源 - 通知管理'
import { ref } from 'vue'
import cookie from 'js-cookie'
import validator from 'validator'
import request from '../../request'
const accesstoken = cookie.get('accessToken')
const webhookurl = ref('')
const webhooktoken = ref('')
const webhookdialog = ref(false)
const url = ref('')
const emailversionupdate = ref(false)
const webhookversionupdate = ref(false)
async function getUserInfo() {
  const res = await request({
    apiPath: '/product/getUserInfo',
    body: {
      accessToken: accesstoken,
      product: 'resource'
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
  if (noticesetting.includes('resource_email_versionupdate')) {
    emailversionupdate.value = true
  }
  if (noticesetting.includes('resource_webhook_versionupdate')) {
    webhookversionupdate.value = true
  }
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
      product: 'resource',
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
async function changeEmailVersionUpdate(zt) {
  let wz = '开启'
  if (zt == false) {
    wz = '关闭'
  }
  await request({
    apiPath: '/product/updateNoticeSetting',
    body: {
      accessToken: accesstoken,
      noticeName: 'resource_email_versionupdate'
    }
  })
  TinyModal.message({
    message: wz + '成功',
    status: 'success'
  })
  getUserInfo()
}
async function changeWebhookVersionUpdate(zt) {
  let wz = '开启'
  if (zt == false) {
    wz = '关闭'
  }
  await request({
    apiPath: '/product/updateNoticeSetting',
    body: {
      accessToken: accesstoken,
      noticeName: 'resource_webhook_versionupdate'
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
        description="设置后，服务器会向地址发送 HTTP POST 请求推送通知，请求体为 JSON 对象，含有 data、timeStamp 和 signature 三个键。data 键值为 string 类型，反序列化后的 JSON 对象含有 noticeName 键和其他键，其他键由通知类型决定；timeStamp 键值为 number 类型，用于请求防重放、验签；signature 键值为 string 类型，用于验签。下载下方证书使用其中的公钥验签（具体步骤可参考下方文档），以验证请求是否来源于轩铭 2512 服务器。"></tiny-alert>
      <div class="sp">
        <a href="https://www.zhangls2512.cn/xm2512_root_ca_2025.cer" download>下载证书</a>
        <a href="https://docs.qq.com/doc/p/df778231415ac18a60f0aaf5f27a03b26bdf3778" target="_blank">公钥验签具体步骤参考</a>
      </div>
      <div class="sp">
        <div>推送地址：<span v-if="!webhookurl">未设置</span><span v-if="webhookurl">{{ webhookurl }}</span></div>
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
      <div class="sp">
        <div class="item">资源版本更新</div>
        <div class="item">
          <tiny-switch v-model="emailversionupdate" @change="changeEmailVersionUpdate"></tiny-switch>
        </div>
        <div class="item">
          <tiny-switch v-model="webhookversionupdate" @change="changeWebhookVersionUpdate"></tiny-switch>
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
        <div>1. 让 Webhook 推送地址/xm2512webhooktoken/resource 返回 webhookToken。</div>
        <div>2. 点击“设置”按钮向服务器发送设置请求。</div>
        <div>3. 服务器收到设置请求后会向输入的 Webhook 推送地址/xm2512webhooktoken/resource 发送 HTTP GET 请求，检查响应体是否是正确的 webhookToken。</div>
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