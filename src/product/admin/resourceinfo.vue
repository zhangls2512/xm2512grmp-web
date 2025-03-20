<script setup>
document.title = '轩铭2512 - 管理后台 - 资源管理 - 资源详情'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import moment from 'moment-timezone'
import cookie from 'js-cookie'
import request from '../../request'
const route = useRoute()
const id = route.query.id
const accesstoken = cookie.get('accessToken')
const data = ref({})
let date = ''
const releasestatus = ref('')
const releasebanreason = ref('')
const reviewstatus = ref('')
const reviewinvalidreason = ref('')
const disallowupdatereview = ref(false)
async function get() {
  const res = await request({
    apiPath: '/admin/getResourceInfo',
    body: {
      accessToken: accesstoken,
      id: id
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  let dataout = res.data
  dataout.createDate = moment(res.data.createDate).format('YYYY-MM-DD HH:mm:ss')
  disallowupdatereview.value = dataout.disallowUpdateReview
  date = res.data.submitReviewDate
  dataout.submitReviewDate = moment(res.data.submitReviewDate).format('YYYY-MM-DD HH:mm:ss')
  data.value = dataout
  if (dataout.releaseStatus == 'ban') {
    releasestatus.value = 'unban'
  } else {
    releasestatus.value = 'ban'
  }
  releasebanreason.value = dataout.releaseBanReason
  if (dataout.reviewStatus == 'valid') {
    reviewstatus.value = 'invalid'
  }
  if (dataout.reviewStatus == 'invalid') {
    reviewstatus.value = 'valid'
  }
  reviewinvalidreason.value = dataout.reviewInvalidReason
}
get()
function copy() {
  navigator.clipboard.writeText(data.value._id)
  TinyModal.message({
    message: '内容已复制',
    status: 'success'
  })
}
async function updateUvwr(wz) {
  await request({
    apiPath: '/admin/updateResourceUvwr',
    body: {
      accessToken: accesstoken,
      id: id
    }
  })
  TinyModal.message({
    message: wz + '成功',
    status: 'success'
  })
  get()
}
async function updateReleaseStatus() {
  if (releasestatus.value == 'ban' && !releasebanreason.value) {
    TinyModal.message({
      message: '请输入封禁原因',
      status: 'warning'
    })
    return
  }
  if (releasestatus.value == 'ban') {
    await request({
      apiPath: '/admin/banResource',
      body: {
        accessToken: accesstoken,
        id: id,
        reason: releasebanreason.value
      }
    })
    TinyModal.message({
      message: '封禁成功',
      status: 'success'
    })
    get()
  }
  if (releasestatus.value == 'unban') {
    await request({
      apiPath: '/admin/unbanResource',
      body: {
        accessToken: accesstoken,
        id: id
      }
    })
    TinyModal.message({
      message: '解封成功',
      status: 'success'
    })
    get()
  }
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
      id: id,
      status: reviewstatus.value,
      reason: reviewinvalidreason.value,
      disallowUpdateReview: disallowupdatereview.value,
      date: date
    }
  })
  TinyModal.message({
    message: '提交成功',
    status: 'success'
  })
  get()
}
</script>

<template>
  <div class="cz">
    <tiny-breadcrumb>
      <tiny-breadcrumb-item :to="{ path: '/product/admin/resourcelist' }" label="资源管理"></tiny-breadcrumb-item>
      <tiny-breadcrumb-item :to="{ path: '/product/admin/resourceinfo' }" label="资源详情"></tiny-breadcrumb-item>
    </tiny-breadcrumb>
    <div class="cz">
      <div class="large-bold-text">基本信息</div>
      <div class="sp">
        <div class="bold-text">ID</div>
        <div>{{ data._id }}</div>
        <tiny-button type="info" @click="copy">复制</tiny-button>
      </div>
      <div class="sp">
        <div class="bold-text">创建时间</div>
        <div>{{ data.createDate }}</div>
      </div>
      <div class="sp">
        <div class="bold-text">免审更新版本号</div>
        <div v-if="data.updateVersionWithoutReview == true">是</div>
        <div v-if="data.updateVersionWithoutReview == false">否</div>
        <tiny-button v-if="data.updateVersionWithoutReview == false" type="success"
          @click="updateUvwr('开启')">开启</tiny-button>
        <tiny-button v-if="data.updateVersionWithoutReview == true" type="danger"
          @click="updateUvwr('关闭')">关闭</tiny-button>
      </div>
      <tiny-divider></tiny-divider>
      <div class="large-bold-text">线上版本信息</div>
      <div class="sp">
        <div class="bold-text">状态</div>
        <tiny-tag v-if="data.releaseStatus == 'release'" type="success">已上架</tiny-tag>
        <tiny-tag v-if="data.releaseStatus == 'unrelease'" type="info">未上架</tiny-tag>
        <tiny-tag v-if="data.releaseStatus == 'ban'" type="danger">已封禁</tiny-tag>
      </div>
      <div v-if="data.releaseStatus == 'ban'" class="bold-text">封禁原因</div>
      <div v-if="data.releaseStatus == 'ban'">{{ data.releaseBanReason }}</div>
      <tiny-radio-group v-model="releasestatus">
        <tiny-radio label="ban">封禁</tiny-radio>
        <tiny-radio label="unban" :disabled="data.releaseStatus != 'ban'">解封</tiny-radio>
      </tiny-radio-group>
      <tiny-input v-if="releasestatus == 'ban'" v-model="releasebanreason" type="textarea" autosize clearable
        placeholder="请输入封禁原因"></tiny-input>
      <tiny-button type="info" @click="updateReleaseStatus">提交</tiny-button>
      <div class="sp">
        <div class="bold-text">名称</div>
        <div>{{ data.name }}</div>
      </div>
      <div class="bold-text">简介</div>
      <div>{{ data.desc }}</div>
      <div class="sp">
        <div class="bold-text">版本号</div>
        <div>{{ data.version }}</div>
      </div>
      <div class="bold-text">地址</div>
      <div v-for="(item, index) in data.location" class="sp">
        <div>{{ index + 1 }}.</div>
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
        <tiny-tag v-for="item in data.tag" :type="item.type">{{ item.value }}</tiny-tag>
      </div>
      <div class="bold-text">更多信息</div>
      <tiny-alert v-for="item in data.info" :closable="false" :type="item.color">
        <template #description>
          <span v-if="item.name != ''">{{ item.name }}：</span>
          <span v-if="item.type == 'text'">{{ item.value }}</span>
          <a v-if="item.type == 'url'" :href="item.value" target="_blank">{{ item.value }}</a>
        </template>
      </tiny-alert>
      <tiny-divider></tiny-divider>
      <div class="large-bold-text">审核版本信息</div>
      <tiny-alert v-if="data.disallowUpdateReview == true" type="error" :closable="false"
        description="禁止修改"></tiny-alert>
      <div class="sp">
        <div class="bold-text">状态</div>
        <tiny-tag v-if="data.reviewStatus == 'pending'" type="info">待提交审核</tiny-tag>
        <tiny-tag v-if="data.reviewStatus == 'processing'" type="warning">审核中</tiny-tag>
        <tiny-tag v-if="data.reviewStatus == 'valid'" type="success">审核通过</tiny-tag>
        <tiny-tag v-if="data.reviewStatus == 'invalid'" type="danger">审核不通过</tiny-tag>
      </div>
      <div v-if="data.reviewStatus == 'invalid'" class="bold-text">不通过原因</div>
      <div v-if="data.reviewStatus == 'invalid'">{{ data.reviewInvalidReason }}</div>
      <tiny-radio-group v-if="data.reviewStatus != 'pending'" v-model="reviewstatus">
        <tiny-radio label="valid"
          :disabled="data.reviewStatus != 'processing' && data.reviewStatus != 'invalid'">通过</tiny-radio>
        <tiny-radio label="invalid">不通过</tiny-radio>
      </tiny-radio-group>
      <tiny-input v-if="reviewstatus == 'invalid'" v-model="reviewinvalidreason" type="textarea" autosize clearable
        placeholder="请输入不通过原因"></tiny-input>
      <div v-if="reviewstatus == 'invalid'" class="sp">
        <div class="bold-text">禁止修改审核版本</div>
        <tiny-switch v-model="disallowupdatereview"></tiny-switch>
      </div>
      <tiny-button v-if="data.reviewStatus != 'pending'" type="info" @click="updateReviewResult">提交</tiny-button>
      <div v-if="data.reviewStatus != 'pending'" class="sp">
        <div class="bold-text">提交审核时间</div>
        <div>{{ data.submitReviewDate }}</div>
      </div>
      <div class="sp">
        <div class="bold-text">名称</div>
        <div>{{ data.reviewInfo.name }}</div>
      </div>
      <div class="bold-text">简介</div>
      <div>{{ data.reviewInfo.desc }}</div>
      <div class="sp">
        <div class="bold-text">版本号</div>
        <div>{{ data.reviewInfo.version }}</div>
      </div>
      <div class="bold-text">地址</div>
      <div v-for="(item, index) in data.reviewInfo.location" class="sp">
        <div>{{ index + 1 }}.</div>
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
    </div>
  </div>
</template>