<script setup>
document.title = '轩铭2512 - SSL 证书 - 订单详情'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import cookie from 'js-cookie'
import moment from 'moment-timezone'
import callfunction from '../../callfunction'
import request from '../../request'
const route = useRoute()
const id = route.query.id
const accesstoken = cookie.get('accessToken')
const data = ref({})
const updatedescdialog = ref(false)
const desc = ref('')
const updateautoneworderdialog = ref(false)
const autoneworder = ref('')
const revokecertificatedialog = ref(false)
const reason = ref('0')
async function get() {
  const res = await request({
    apiPath: '/ssl/getOrderInfo',
    body: {
      accessToken: accesstoken,
      id: id
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  let resdata = res.data
  resdata.ariEndDate = moment(resdata.ariEndDate).format('YYYY-MM-DD HH:mm:ss')
  resdata.ariStartDate = moment(resdata.ariStartDate).format('YYYY-MM-DD HH:mm:ss')
  resdata.certificateEndDate = moment(resdata.certificateEndDate).format('YYYY-MM-DD HH:mm:ss')
  resdata.certificateStartDate = moment(resdata.certificateStartDate).format('YYYY-MM-DD HH:mm:ss')
  resdata.createDate = moment(resdata.createDate).format('YYYY-MM-DD HH:mm:ss')
  resdata.orderEndDate = moment(resdata.orderEndDate).format('YYYY-MM-DD HH:mm:ss')
  data.value = resdata
  desc.value = resdata.desc
  autoneworder.value = resdata.autoNewOrder
}
get()
async function refresh() {
  const status = data.value.status
  if (status == 'pending' || status == 'ready' || status == 'processing' || status == 'valid') {
    await callfunction({
      functionName: 'refreshSslOrder',
      data: {
        accessToken: accesstoken,
        id: id
      }
    })
    TinyModal.message({
      message: '刷新成功',
      status: 'success'
    })
  }
  get()
}
function copy() {
  navigator.clipboard.writeText(data.value._id)
  TinyModal.message({
    message: '内容已复制',
    status: 'success'
  })
}
function download(url) {
  const link = document.createElement('a')
  link.href = url
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
function openUpdateDescDialog() {
  updatedescdialog.value = true
}
function closeUpdateDescDialog() {
  updatedescdialog.value = false
}
async function updateDesc() {
  await request({
    apiPath: '/ssl/updateOrder',
    body: {
      accessToken: accesstoken,
      id: id,
      desc: desc.value,
      autoNewOrder: autoneworder.value
    }
  })
  TinyModal.message({
    message: '修改成功',
    status: 'success'
  })
  closeUpdateDescDialog()
  get()
}
function openUpdateAutoNewOrderDialog() {
  updateautoneworderdialog.value = true
}
function closeUpdateAutoNewOrderDialog() {
  updateautoneworderdialog.value = false
}
async function updateAutoNewOrder() {
  await request({
    apiPath: '/ssl/updateOrder',
    body: {
      accessToken: accesstoken,
      id: id,
      desc: desc.value,
      autoNewOrder: autoneworder.value
    }
  })
  TinyModal.message({
    message: '修改成功',
    status: 'success'
  })
  closeUpdateAutoNewOrderDialog()
  get()
}
function openRevokeCertificateDialog() {
  revokecertificatedialog.value = true
}
function closeRevokeCertificateDialog() {
  revokecertificatedialog.value = false
  reason.value = '0'
}
async function revokeCertificate() {
  await callfunction({
    functionName: 'revokeSslCertificate',
    data: {
      accessToken: accesstoken,
      orderId: id,
      reason: Number(reason.value)
    }
  })
  TinyModal.message({
    message: '吊销成功',
    status: 'success'
  })
  closeRevokeCertificateDialog()
  get()
}
</script>

<template>
  <div class="cz">
    <tiny-breadcrumb>
      <tiny-breadcrumb-item :to="{ path: '/product/ssl/orderlist' }" label="订单管理"></tiny-breadcrumb-item>
      <tiny-breadcrumb-item :to="{ path: '/product/ssl/orderinfo' }" label="订单详情"></tiny-breadcrumb-item>
    </tiny-breadcrumb>
    <div><tiny-button type="info" @click="refresh">刷新</tiny-button></div>
    <div class="sp">
      <div class="bold-text">域名 / IP 地址</div>
      <tiny-tag v-for="item in data.domains" type="info">{{ item }}</tiny-tag>
    </div>
    <div class="sp">
      <div class="bold-text">备注</div>
      <div>{{ data.desc }}</div>
      <tiny-button v-if="data.status != 'invalid' && data.status != 'expired' && data.isAutoNewOrder === false"
        type="info" @click="openUpdateDescDialog">修改</tiny-button>
    </div>
    <div class="sp">
      <div class="bold-text">状态</div>
      <tiny-tag v-if="data.status == 'pending'" type="info">待授权</tiny-tag>
      <tiny-tag v-if="data.status == 'ready'" type="info">待提交</tiny-tag>
      <tiny-tag v-if="data.status == 'invalid'" type="danger">已失效</tiny-tag>
      <tiny-tag v-if="data.status == 'processing'" type="warning">签发中</tiny-tag>
      <tiny-tag v-if="data.status == 'valid'" type="success">已签发</tiny-tag>
      <tiny-tag v-if="data.status == 'expired'" type="warning">已过期</tiny-tag>
    </div>
    <div v-if="data.privateKey != ''" class="sp">
      <div class="bold-text">私钥</div>
      <tiny-button type="success" @click="download(data.privateKey)">下载</tiny-button>
      <div>下载链接有效期 5 分钟，刷新页面可获取新的下载链接</div>
    </div>
    <div v-if="data.certificate.length > 0" class="sp">
      <div class="bold-text">证书</div>
      <tiny-popconfirm title="提示" message="吊销后无法恢复，确定吊销？" type="warning" trigger="hover"
        @confirm="openRevokeCertificateDialog">
        <template #reference>
          <tiny-button type="danger">吊销</tiny-button>
        </template>
      </tiny-popconfirm>
      <div>下载链接有效期 5 分钟，刷新页面可获取新的下载链接</div>
    </div>
    <tiny-grid v-if="data.certificate.length > 0" :data="data.certificate">
      <tiny-grid-column field="chain" title="证书链" align="center"></tiny-grid-column>
      <tiny-grid-column title="操作" align="center">
        <template #default="{ row }">
          <tiny-button type="success" @click="download(row.value)">下载</tiny-button>
        </template>
      </tiny-grid-column>
    </tiny-grid>
    <tiny-alert v-if="data.certificate.length == 0 && (data.status == 'valid' || data.status == 'expired')" type="error"
      :closable="false" description="证书已吊销"></tiny-alert>
    <div v-if="data.certificate.length > 0" class="sp">
      <div class="bold-text">证书颁发时间</div>
      <div>{{ data.certificateStartDate }}</div>
    </div>
    <div v-if="data.certificate.length > 0" class="sp">
      <div class="bold-text">证书到期时间</div>
      <div>{{ data.certificateEndDate }}</div>
    </div>
    <div class="sp">
      <div class="bold-text">自动新增续期订单</div>
      <div v-if="data.autoNewOrder == 'ari'">CA 建议</div>
      <div v-if="data.autoNewOrder == 'nearexpire'">即将到期</div>
      <div v-if="data.autoNewOrder == 'close'">关闭</div>
      <tiny-button v-if="data.status != 'invalid' && data.status != 'expired' && data.isAutoNewOrder === false"
        type="info" @click="openUpdateAutoNewOrderDialog">修改</tiny-button>
    </div>
    <tiny-divider></tiny-divider>
    <div class="sp">
      <div class="bold-text">订单 ID</div>
      <div>{{ data._id }}</div>
      <tiny-button type="info" @click="copy">复制</tiny-button>
    </div>
    <div class="sp">
      <div class="bold-text">密钥类型</div>
      <div v-if="data.keyType == 'rsa'">RSA</div>
      <div v-if="data.keyType == 'ecdsa'">ECDSA</div>
    </div>
    <div v-if="data.keyType == 'rsa'" class="sp">
      <div class="bold-text">密钥位数</div>
      <div>{{ data.keySize }}</div>
    </div>
    <div v-if="data.keyType == 'ecdsa'" class="sp">
      <div class="bold-text">密钥曲线</div>
      <div>{{ data.keySize }}</div>
    </div>
    <div class="sp">
      <div class="bold-text">环境类型</div>
      <div v-if="data.environmentType == 'production'">正式</div>
      <div v-if="data.environmentType == 'staging'">测试</div>
    </div>
    <div class="sp">
      <div class="bold-text">证书类型</div>
      <div v-if="data.certificateType == 'classic'">经典</div>
      <div v-if="data.certificateType == 'shortlived'">短期</div>
      <div v-if="data.certificateType == 'tlsserver'">TLS 服务器</div>
    </div>
    <div class="sp">
      <div class="bold-text">订单创建时间</div>
      <div>{{ data.createDate }}</div>
    </div>
    <div class="sp">
      <div class="bold-text">订单截止时间</div>
      <div>{{ data.orderEndDate }}</div>
    </div>
    <div v-if="data.status == 'valid'" class="sp">
      <div class="bold-text">是否已自动新增续期订单</div>
      <div v-if="data.isAutoNewOrder == true">是</div>
      <div v-if="data.isAutoNewOrder == false">否</div>
    </div>
    <div v-if="data.status == 'valid'" class="sp">
      <div class="bold-text">CA 建议续期开始时间</div>
      <div>{{ data.ariStartDate }}</div>
    </div>
    <div v-if="data.status == 'valid'" class="sp">
      <div class="bold-text">CA 建议续期截止时间</div>
      <div>{{ data.ariEndDate }}</div>
    </div>
    <tiny-dialog-box class="dialog" :visible="updatedescdialog" title="修改备注" @close="closeUpdateDescDialog">
      <tiny-input v-model="desc" clearable maxlength="20" placeholder="请输入备注（可选）"></tiny-input>
      <template #footer>
        <tiny-button type="info" @click="updateDesc">保存</tiny-button>
      </template>
    </tiny-dialog-box>
    <tiny-dialog-box class="dialog" :visible="updateautoneworderdialog" title="修改自动新增续期订单设置"
      @close="closeUpdateAutoNewOrderDialog">
      <tiny-radio-group v-model="autoneworder">
        <tiny-radio label="ari">CA 建议</tiny-radio>
        <tiny-radio label="nearexpire">即将到期</tiny-radio>
        <tiny-radio label="close">关闭</tiny-radio>
      </tiny-radio-group>
      <template #footer>
        <tiny-button type="info" @click="updateAutoNewOrder">保存</tiny-button>
      </template>
    </tiny-dialog-box>
    <tiny-dialog-box class="dialog" :visible="revokecertificatedialog" title="选择吊销原因"
      @close="closeRevokeCertificateDialog">
      <tiny-radio-group v-model="reason">
        <tiny-radio label="0">不指定</tiny-radio>
        <tiny-radio label="1">私钥泄露</tiny-radio>
        <tiny-radio label="4">被新证书取代</tiny-radio>
        <tiny-radio label="5">不再使用</tiny-radio>
      </tiny-radio-group>
      <template #footer>
        <tiny-button type="danger" @click="revokeCertificate">吊销</tiny-button>
      </template>
    </tiny-dialog-box>
  </div>
</template>