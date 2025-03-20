<script setup>
document.title = '轩铭2512 - 资源投稿 - 资源详情'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import moment from 'moment-timezone'
import cookie from 'js-cookie'
import request from '../../request'
const route = useRoute()
const id = route.query.id
const accesstoken = cookie.get('accessToken')
const data = ref({})
async function get() {
  const res = await request({
    apiPath: '/resourcecreator/getResourceInfo',
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
  dataout.submitReviewDate = moment(res.data.submitReviewDate).format('YYYY-MM-DD HH:mm:ss')
  data.value = dataout
}
get()
function copy() {
  navigator.clipboard.writeText(data.value._id)
  TinyModal.message({
    message: '内容已复制',
    status: 'success'
  })
}
</script>

<template>
  <div class="cz">
    <tiny-breadcrumb>
      <tiny-breadcrumb-item :to="{ path: '/product/resourcecreator/resourcelist' }" label="资源管理"></tiny-breadcrumb-item>
      <tiny-breadcrumb-item :to="{ path: '/product/resourcecreator/resourceinfo' }" label="资源详情"></tiny-breadcrumb-item>
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
      </div>
      <tiny-alert v-if="data.updateVersionWithoutReview == false" :closable="false"
        description="如需使用爬虫等技术实时更新版本号，可联系客服申请开通免审更新版本号功能。"></tiny-alert>
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
        description="禁止修改，如有疑问请联系客服"></tiny-alert>
      <div class="sp">
        <div class="bold-text">状态</div>
        <tiny-tag v-if="data.reviewStatus == 'pending'" type="info">待提交审核</tiny-tag>
        <tiny-tag v-if="data.reviewStatus == 'processing'" type="warning">审核中</tiny-tag>
        <tiny-tag v-if="data.reviewStatus == 'valid'" type="success">审核通过</tiny-tag>
        <tiny-tag v-if="data.reviewStatus == 'invalid'" type="danger">审核不通过</tiny-tag>
      </div>
      <div v-if="data.reviewStatus == 'invalid'" class="bold-text">不通过原因</div>
      <div v-if="data.reviewStatus == 'invalid'">{{ data.reviewInvalidReason }}</div>
      <div class="sp">
        <div class="bold-text">允许审核人员修改信息</div>
        <div v-if="data.allowReviewerUpdate == true">是</div>
        <div v-if="data.allowReviewerUpdate == false">否</div>
      </div>
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