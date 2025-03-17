<script setup>
document.title = '轩铭2512 - 管理后台 - 资源管理 - 资源审核'
import { ref } from 'vue'
import moment from 'moment-timezone'
import cookie from 'js-cookie'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const data = ref({})
const reviewstatus = ref('valid')
const reviewinvalidreason = ref('')
let date = ''
const aftersubmit = ref('getnext')
const type = ref('sorted')
async function getInfo() {
  const res = await request({
    apiPath: '/admin/getProcessingReviewResource',
    body: {
      accessToken: accesstoken,
      type: type.value
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  let dataout = res.data
  date = res.data.submitReviewDate
  dataout.submitReviewDate = moment(res.data.submitReviewDate).format('YYYY-MM-DD HH:mm:ss')
  data.value = dataout
}
getInfo()
function copy() {
  navigator.clipboard.writeText(data.value._id)
  TinyModal.message({
    message: '内容已复制',
    status: 'success'
  })
}
async function updateReviewResult() {
  if (reviewstatus.value == 'invalid' && !reviewinvalidreason.value) {
    TinyModal.message({
      message: '请输入不通过原因',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/admin/updateResourceReviewResult',
    body: {
      accessToken: accesstoken,
      id: data.value._id,
      status: reviewstatus.value,
      reason: reviewinvalidreason.value,
      date: date
    }
  })
  TinyModal.message({
    message: '提交成功',
    status: 'success'
  })
  if (aftersubmit.value == 'getnext') {
    getInfo()
  }
  if (aftersubmit.value == 'exit') {
    router.push('/product/admin/resourcelist')
  }
}
</script>

<template>
  <div class="cz">
    <div class="sp">
      <div class="bold-text">名称</div>
      <div>{{ data.reviewInfo.name }}</div>
    </div>
    <div class="bold-text">简介</div>
    <div class="text">{{ data.reviewInfo.desc }}</div>
    <div class="sp">
      <div class="bold-text">版本号</div>
      <div>{{ data.reviewInfo.version }}</div>
    </div>
    <div class="bold-text">地址</div>
    <div v-for="item in data.reviewInfo.location" class="sp">
      <div>
        <span v-if="item.name != ''">{{ item.name }}：</span>
        <span v-if="item.type == 'text'">{{ item.value }}</span>
        <a v-if="item.type == 'url'" :href="item.value" target="_blank">{{ item.value }}</a>
      </div>
      <div class="sp">
        <tiny-tag v-for="item in item.tag" :type="item.type">{{ item.value }}</tiny-tag>
      </div>
    </div>
    <div class="sp">
      <div class="bold-text">标签</div>
      <tiny-tag v-for="item in data.reviewInfo.tag" :type="item.type">{{ item.value }}</tiny-tag>
    </div>
    <div class="bold-text">更多信息</div>
    <tiny-alert v-for="item in data.reviewInfo.info" :closable="false" :type="item.color">
      <template #description>
        <span v-if="item.name != ''">{{ item.name }}：</span>
        <span v-if="item.type == 'text'">{{ item.value }}</span>
        <a v-if="item.type == 'url'" :href="item.value" target="_blank">{{ item.value }}</a>
      </template>
    </tiny-alert>
    <tiny-divider></tiny-divider>
    <div class="large-bold-text">更多信息</div>
    <div class="sp">
      <div class="bold-text">ID</div>
      <div>{{ data._id }}</div>
      <tiny-button type="info" @click="copy">复制</tiny-button>
    </div>
    <div class="sp">
      <div class="bold-text">提交审核时间</div>
      <div>{{ data.submitReviewDate }}</div>
    </div>
    <tiny-divider></tiny-divider>
    <div class="sp">
      <div>提交后</div>
      <tiny-radio-group v-model="aftersubmit">
        <tiny-radio label="getnext">审核下一个</tiny-radio>
        <tiny-radio label="exit">退出</tiny-radio>
      </tiny-radio-group>
    </div>
    <div class="sp">
      <div>获取方式</div>
      <tiny-radio-group v-model="type">
        <tiny-radio label="sorted">提交审核时间从早到晚</tiny-radio>
        <tiny-radio label="random">随机</tiny-radio>
      </tiny-radio-group>
    </div>
    <tiny-button v-if="type == 'sorted'" type="info" @click="getInfo">刷新</tiny-button>
    <tiny-button v-if="type == 'random'" type="info" @click="getInfo">换一个</tiny-button>
    <tiny-divider></tiny-divider>
    <tiny-radio-group v-model="reviewstatus">
      <tiny-radio label="valid"
        :disabled="data.reviewStatus != 'processing' && data.reviewStatus != 'invalid'">通过</tiny-radio>
      <tiny-radio label="invalid" :disabled="data.releaseStatus == 'pending'">不通过</tiny-radio>
    </tiny-radio-group>
    <tiny-input v-if="reviewstatus == 'invalid'" v-model="reviewinvalidreason" type="textarea" autosize clearable
      placeholder="请输入不通过原因"></tiny-input>
    <tiny-button type="info" @click="updateReviewResult">提交</tiny-button>
  </div>
</template>