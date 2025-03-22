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
const auudialog = ref(false)
const uvwrdialog = ref(false)
const auu = ref([])
const auuuser = ref('')
const uvwr = ref('')
const reviewstatus = ref('')
const reviewinvalidreason = ref('')
const disallowupdate = ref(false)
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
  disallowupdate.value = dataout.disallowUpdate
  date = res.data.submitReviewDate
  dataout.submitReviewDate = moment(res.data.submitReviewDate).format('YYYY-MM-DD HH:mm:ss')
  data.value = dataout
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
function add() {
  if (!auuuser.value) {
    TinyModal.message({
      message: '请输入 UID',
      status: 'warning'
    })
    return
  }
  auu.value.push(auuuser.value)
  auuuser.value = ''
}
function remove(index) {
  auu.value.splice(index, 1)
}
function updateAuuOpen() {
  auudialog.value = true
  auu.value = [...data.value.allowUpdateUser]
}
function updateAuuClose() {
  auudialog.value = false
  auu.value = []
}
async function updateAuu() {
  await request({
    apiPath: '/admin/updateResourceAuu',
    body: {
      accessToken: accesstoken,
      id: id,
      allowUpdateUser: auu.value
    }
  })
  updateAuuClose()
  TinyModal.message({
    message: '修改成功',
    status: 'success'
  })
  get()
}
function updateUvwrOpen() {
  uvwrdialog.value = true
  uvwr.value = data.value.updateVersionWithoutReview
}
function updateUvwrClose() {
  uvwrdialog.value = false
  uvwr.value = ''
}
async function updateUvwr() {
  await request({
    apiPath: '/admin/updateResourceUvwr',
    body: {
      accessToken: accesstoken,
      id: id,
      updateVersionWithoutReview: uvwr.value
    }
  })
  updateUvwrClose()
  TinyModal.message({
    message: '修改成功',
    status: 'success'
  })
  get()
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
      disallowUpdate: disallowupdate.value,
      date: date,
      name: data.value.reviewInfo.name,
      desc: data.value.reviewInfo.desc,
      version: data.value.reviewInfo.version,
      location: data.value.reviewInfo.location,
      tag: data.value.reviewInfo.tag,
      info: data.value.reviewInfo.info
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
        <div class="bold-text">可修改用户</div>
        <div v-if="data.allowUpdateUser.length == 0 && data.uid == ''">全部</div>
        <div v-if="data.uid != ''">{{ data.uid }}</div>
        <tiny-button v-if="data.uid == ''" type="info" @click="updateAuuOpen">修改</tiny-button>
      </div>
      <div v-for="(item, index) in data.allowUpdateUser" v-if="data.allowUpdateUser.length > 0 && data.uid == ''"
        class="sp">
        <div>{{ index + 1 }}.</div>
        <div>{{ item }}</div>
      </div>
      <div class="sp">
        <div class="bold-text">免审更新版本号</div>
        <div v-if="data.updateVersionWithoutReview == ''">未设置</div>
        <div v-if="data.updateVersionWithoutReview != ''">{{ data.updateVersionWithoutReview }}</div>
        <tiny-button type="info" @click="updateUvwrOpen">修改</tiny-button>
      </div>
      <tiny-divider></tiny-divider>
      <div class="large-bold-text">线上版本信息</div>
      <div class="sp">
        <div class="bold-text">状态</div>
        <tiny-tag v-if="data.releaseStatus == 'release'" type="success">已上架</tiny-tag>
        <tiny-tag v-if="data.releaseStatus == 'unrelease'" type="info">未上架</tiny-tag>
      </div>
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
        <tiny-tag v-for="item in item.tag" :type="item.type">{{ item.value }}</tiny-tag>
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
      <tiny-alert v-if="data.disallowUpdate == true" type="error" :closable="false"
        description="禁止修改、提交审核"></tiny-alert>
      <div class="sp">
        <div class="bold-text">状态</div>
        <tiny-tag v-if="data.reviewStatus == 'pending'" type="info">待提交审核</tiny-tag>
        <tiny-tag v-if="data.reviewStatus == 'processing'" type="warning">审核中</tiny-tag>
        <tiny-tag v-if="data.reviewStatus == 'invalid'" type="danger">审核不通过</tiny-tag>
      </div>
      <tiny-alert v-if="data.reviewInvalidReason != ''" type="error" size="large" :closable="false" title="不通过原因"
        :description="data.reviewInvalidReason"></tiny-alert>
      <tiny-radio-group v-if="data.reviewStatus != 'pending'" v-model="reviewstatus">
        <tiny-radio label="valid"
          :disabled="data.reviewStatus != 'processing' && data.reviewStatus != 'invalid'">通过</tiny-radio>
        <tiny-radio label="invalid">不通过</tiny-radio>
      </tiny-radio-group>
      <tiny-input v-if="reviewstatus == 'invalid'" v-model="reviewinvalidreason" type="textarea" autosize clearable
        show-word-limit maxlength="500" placeholder="请输入不通过原因"></tiny-input>
      <div v-if="reviewstatus == 'invalid'" class="sp">
        <div class="bold-text">禁止修改、提交审核</div>
        <tiny-switch v-model="disallowupdate"></tiny-switch>
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
        <tiny-tag v-for="item in item.tag" :type="item.type">{{ item.value }}</tiny-tag>
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
    <tiny-dialog-box class="dialog" :visible="auudialog" title="可修改用户设置" @close="updateAuuClose">
      <div class="dialog-cz">
        <div class="sp">
          <tiny-input v-model="auuuser" clearable placeholder="请输入 UID"></tiny-input>
          <tiny-button type="success" @click="add">添加</tiny-button>
        </div>
        <div v-for="(item, index) in auu" class="sp">
          <tiny-tag type="info">{{ item }}</tiny-tag>
          <tiny-button type="danger" @click="remove(index)">删除</tiny-button>
        </div>
      </div>
      <template #footer>
        <tiny-button type="info" @click="updateAuu">保存</tiny-button>
      </template>
    </tiny-dialog-box>
    <tiny-dialog-box class="dialog" :visible="uvwrdialog" title="免审更新版本号设置" @close="updateUvwrClose">
      <tiny-input v-model="uvwr" clearable placeholder="请输入 UID"></tiny-input>
      <template #footer>
        <tiny-button type="info" @click="updateUvwr">保存</tiny-button>
      </template>
    </tiny-dialog-box>
  </div>
</template>