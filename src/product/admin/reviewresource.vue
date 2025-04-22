<script setup>
document.title = '轩铭2512 - 管理后台 - 资源审核'
import { ref } from 'vue'
import moment from 'moment-timezone'
import cookie from 'js-cookie'
import sortable from 'sortablejs'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
let date = ''
const total = ref(0)
const count = ref(0)
const percent = ref(0)
const aftersubmit = ref('getnext')
const type = ref('sorted')
const mode = ref('preview')
const reviewstatus = ref('valid')
const release = ref(true)
const reviewinvalidreason = ref('')
const disallowupdate = ref(false)
const id = ref('')
const releasestatus = ref('')
const submitreviewdate = ref(0)
const name = ref('')
const desc = ref('')
const version = ref('')
const location = ref([])
const tag = ref([])
const info = ref([])
const locationname = ref('')
const locationtype = ref('text')
const locationvalue = ref('')
const locationtag = ref([])
const locationtagtype = ref('')
const locationtagvalue = ref('')
const tagtype = ref('')
const tagvalue = ref('')
const infoname = ref('')
const infotype = ref('text')
const infovalue = ref('')
const infocolor = ref('simple')
const dropconfig = ref({
  plugin: sortable,
  row: true,
  rowHandle: 'index',
  column: false
})
const typeas = ref([
  {
    value: 'text',
    label: '文本'
  },
  {
    value: 'url',
    label: '链接'
  }
])
const typebs = ref([
  {
    value: '',
    label: '白'
  },
  {
    value: 'info',
    label: '蓝'
  },
  {
    value: 'success',
    label: '绿'
  },
  {
    value: 'warning',
    label: '橙'
  },
  {
    value: 'danger',
    label: '红'
  }
])
const typecs = ref([
  {
    value: 'simple',
    label: '白'
  },
  {
    value: 'info',
    label: '蓝'
  },
  {
    value: 'success',
    label: '绿'
  },
  {
    value: 'warning',
    label: '橙'
  },
  {
    value: 'error',
    label: '红'
  }
])
async function get() {
  id.value = ''
  mode.value = 'preview'
  reviewstatus.value = 'valid'
  release.value = true
  reviewinvalidreason.value = ''
  disallowupdate.value = false
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
  if (res.data) {
    id.value = dataout._id
    releasestatus.value = dataout.releaseStatus
    date = res.data.submitReviewDate
    submitreviewdate.value = moment(res.data.submitReviewDate).format('YYYY-MM-DD HH:mm:ss')
    name.value = dataout.reviewInfo.name
    desc.value = dataout.reviewInfo.desc
    version.value = dataout.reviewInfo.version
    location.value = dataout.reviewInfo.location
    tag.value = dataout.reviewInfo.tag
    info.value = dataout.reviewInfo.info
  } else {
    TinyModal.message({
      message: '无待审任务',
      status: 'info'
    })
  }
  const countres = await request({
    apiPath: '/admin/getProcessingReviewResourceCount',
    body: {
      accessToken: accesstoken
    }
  })
  count.value = total.value - countres.count
  percent.value = ((count.value / total.value) * 100).toFixed(0)
}
async function getTotal() {
  const totalres = await request({
    apiPath: '/admin/getProcessingReviewResourceCount',
    body: {
      accessToken: accesstoken
    }
  })
  total.value = totalres.count
}
get()
getTotal()
function addLocationTag() {
  if (!locationtagvalue.value) {
    TinyModal.message({
      message: '请输入内容',
      status: 'warning'
    })
    return
  }
  locationtag.value.push({
    type: locationtagtype.value,
    value: locationtagvalue.value
  })
  locationtagtype.value = ''
  locationtagvalue.value = ''
}
function removeLocationTag(index) {
  locationtag.value.splice(index, 1)
}
function addLocation() {
  if (!locationvalue.value) {
    TinyModal.message({
      message: '请输入地址',
      status: 'warning'
    })
    return
  }
  location.value.push({
    name: locationname.value,
    type: locationtype.value,
    value: locationvalue.value,
    tag: locationtag.value
  })
  locationname.value = ''
  locationtype.value = 'text'
  locationvalue.value = ''
  locationtag.value = []
}
function removeLocation(index) {
  location.value.splice(index, 1)
}
function addTag() {
  if (!tagvalue.value) {
    TinyModal.message({
      message: '请输入内容',
      status: 'warning'
    })
    return
  }
  tag.value.push({
    type: tagtype.value,
    value: tagvalue.value
  })
  tagtype.value = ''
  tagvalue.value = ''
}
function removeTag(index) {
  tag.value.splice(index, 1)
}
function addInfo() {
  if (!infovalue.value) {
    TinyModal.message({
      message: '请输入内容',
      status: 'warning'
    })
    return
  }
  info.value.push({
    name: infoname.value,
    type: infotype.value,
    value: infovalue.value,
    color: infocolor.value
  })
  infoname.value = ''
  infotype.value = 'text'
  infovalue.value = ''
  infocolor.value = 'simple'
}
function removeInfo(index) {
  info.value.splice(index, 1)
}
function copy() {
  navigator.clipboard.writeText(id.value)
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
      id: id.value,
      status: reviewstatus.value,
      reason: reviewinvalidreason.value,
      disallowUpdate: disallowupdate.value,
      date: date,
      name: name.value,
      desc: desc.value,
      version: version.value,
      location: location.value,
      tag: tag.value,
      info: info.value
    }
  })
  TinyModal.message({
    message: '提交成功',
    status: 'success'
  })
  if (release.value && releasestatus.value == 'unrelease' && reviewstatus.value == 'valid') {
    await request({
      apiPath: '/admin/releaseResource',
      body: {
        accessToken: accesstoken,
        id: id.value
      }
    })
    TinyModal.message({
      message: '上架成功',
      status: 'success'
    })
  }
  if (aftersubmit.value == 'getnext') {
    get()
  }
  if (aftersubmit.value == 'exit') {
    router.push('/product/admin/resourcelist')
  }
}
</script>

<template>
  <div class="cz">
    <tiny-progress :percentage="percent"></tiny-progress>
    <div class="sp">
      <div class="bold-text">进度</div>
      <div>{{ count }} / {{ total }}</div>
    </div>
    <div class="sp">
      <div class="bold-text">提交后</div>
      <tiny-radio-group v-model="aftersubmit">
        <tiny-radio label="getnext">审核下一个</tiny-radio>
        <tiny-radio label="exit">退出</tiny-radio>
      </tiny-radio-group>
    </div>
    <div class="sp">
      <div class="bold-text">获取方式</div>
      <tiny-radio-group v-model="type">
        <tiny-radio label="sorted">提交审核时间从早到晚</tiny-radio>
        <tiny-radio label="random">随机</tiny-radio>
      </tiny-radio-group>
    </div>
    <tiny-alert :closable="false" description="多人同时审核时请选择“随机”。"></tiny-alert>
    <div>
      <tiny-button v-if="type == 'sorted'" type="info" @click="get">刷新</tiny-button>
      <tiny-button v-if="type == 'random'" type="info" @click="get">换一个</tiny-button>
    </div>
    <tiny-divider></tiny-divider>
    <div v-if="id != ''" class="cz">
      <div class="sp">
        <div class="bold-text">显示模式</div>
        <tiny-radio-group v-model="mode">
          <tiny-radio label="preview">预览</tiny-radio>
          <tiny-radio label="update">修改</tiny-radio>
        </tiny-radio-group>
      </div>
      <div v-if="mode == 'preview'" class="cz">
        <div class="sp">
          <div class="bold-text">名称</div>
          <div>{{ name }}</div>
        </div>
        <div class="bold-text">简介</div>
        <div>{{ desc }}</div>
        <div class="sp">
          <div class="bold-text">版本号</div>
          <div>{{ version }}</div>
        </div>
        <div class="bold-text">地址</div>
        <div v-for="(item, index) in location" class="sp">
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
          <tiny-tag v-for="item in tag" :type="item.type">{{ item.value }}</tiny-tag>
        </div>
        <div class="bold-text">更多信息</div>
        <tiny-alert v-for="item in info" :closable="false" :type="item.color">
          <template #description>
            <span v-if="item.name != ''">{{ item.name }}：</span>
            <span v-if="item.type == 'text'">{{ item.value }}</span>
            <a v-if="item.type == 'url'" :href="item.value" target="_blank">{{ item.value }}</a>
          </template>
        </tiny-alert>
      </div>
      <div v-if="mode == 'update'">
        <tiny-form>
          <tiny-form-item label="名称">
            <tiny-input v-model="name" clearable maxlength="30" placeholder="请输入名称"></tiny-input>
          </tiny-form-item>
          <tiny-form-item label="简介">
            <tiny-input v-model="desc" type="textarea" autosize show-word-limit maxlength="500"
              placeholder="请输入简介（可选）"></tiny-input>
          </tiny-form-item>
          <tiny-form-item label="版本号">
            <tiny-input v-model="version" clearable maxlength="30" placeholder="请输入版本号（可选）"></tiny-input>
          </tiny-form-item>
          <tiny-form-item label="地址">
            <div class="cz">
              <tiny-input v-model="locationname" clearable maxlength="30" placeholder="请输入名称（可选）"></tiny-input>
              <tiny-base-select v-model="locationtype">
                <tiny-option v-for="item in typeas" :value="item.value" :label="item.label"></tiny-option>
              </tiny-base-select>
              <tiny-input v-model="locationvalue" type="textarea" autosize show-word-limit maxlength="500"
                placeholder="请输入地址"></tiny-input>
              <div class="sp">
                <tiny-base-select v-model="locationtagtype">
                  <tiny-option v-for="item in typebs" :value="item.value" :label="item.label"></tiny-option>
                </tiny-base-select>
                <tiny-input v-model="locationtagvalue" clearable maxlength="30" placeholder="请输入内容"></tiny-input>
                <tiny-button type="success" @click="addLocationTag">添加标签</tiny-button>
              </div>
              <tiny-grid :data="locationtag" :drop-config="dropconfig" row-key>
                <tiny-grid-column type="index" title="序号" align="center"></tiny-grid-column>
                <tiny-grid-column title="标签" align="center">
                  <template #default="{ row }">
                    <tiny-tag :type="row.type">{{ row.value }}</tiny-tag>
                  </template>
                </tiny-grid-column>
                <tiny-grid-column title="操作" align="center">
                  <template #default="{ $rowIndex }">
                    <tiny-button type="danger" @click="removeLocationTag($rowIndex)">删除</tiny-button>
                  </template>
                </tiny-grid-column>
              </tiny-grid>
              <tiny-button type="success" @click="addLocation">添加</tiny-button>
              <tiny-grid :data="location" :drop-config="dropconfig" row-key>
                <tiny-grid-column type="index" title="序号" align="center"></tiny-grid-column>
                <tiny-grid-column title="地址" align="center">
                  <template #default="{ row }">
                    <div class="sp">
                      <div>
                        <span v-if="row.name != ''">{{ row.name }}：</span>
                        <span v-if="row.type == 'text'">{{ row.value }}</span>
                        <a v-if="row.type == 'url'" :href="row.value" target="_blank">{{ row.value }}</a>
                      </div>
                      <div class="sp">
                        <tiny-tag v-for="item in row.tag" :type="item.type">{{ item.value }}</tiny-tag>
                      </div>
                    </div>
                  </template>
                </tiny-grid-column>
                <tiny-grid-column title="操作" align="center">
                  <template #default="{ $rowIndex }">
                    <tiny-button type="danger" @click="removeLocation($rowIndex)">删除</tiny-button>
                  </template>
                </tiny-grid-column>
              </tiny-grid>
            </div>
          </tiny-form-item>
          <tiny-form-item label="标签">
            <div class="cz">
              <div class="sp">
                <tiny-base-select v-model="tagtype">
                  <tiny-option v-for="item in typebs" :value="item.value" :label="item.label"></tiny-option>
                </tiny-base-select>
                <tiny-input v-model="tagvalue" clearable maxlength="30" placeholder="请输入内容"></tiny-input>
                <tiny-button type="success" @click="addTag">添加</tiny-button>
              </div>
              <tiny-grid :data="tag" :drop-config="dropconfig" row-key>
                <tiny-grid-column type="index" title="序号" align="center"></tiny-grid-column>
                <tiny-grid-column title="标签" align="center">
                  <template #default="{ row }">
                    <tiny-tag :type="row.type">{{ row.value }}</tiny-tag>
                  </template>
                </tiny-grid-column>
                <tiny-grid-column title="操作" align="center">
                  <template #default="{ $rowIndex }">
                    <tiny-button type="danger" @click="removeTag($rowIndex)">删除</tiny-button>
                  </template>
                </tiny-grid-column>
              </tiny-grid>
            </div>
          </tiny-form-item>
          <tiny-form-item label="更多信息">
            <div class="cz">
              <tiny-base-select v-model="infocolor">
                <tiny-option v-for="item in typecs" :value="item.value" :label="item.label"></tiny-option>
              </tiny-base-select>
              <tiny-input v-model="infoname" clearable maxlength="30" placeholder="请输入名称（可选）"></tiny-input>
              <tiny-base-select v-model="infotype">
                <tiny-option v-for="item in typeas" :value="item.value" :label="item.label"></tiny-option>
              </tiny-base-select>
              <tiny-input v-model="infovalue" type="textarea" autosize show-word-limit maxlength="500"
                placeholder="请输入内容"></tiny-input>
              <tiny-button type="success" @click="addInfo">添加</tiny-button>
              <tiny-grid :data="info" :drop-config="dropconfig" row-key>
                <tiny-grid-column type="index" title="序号" align="center"></tiny-grid-column>
                <tiny-grid-column title="更多信息" align="center">
                  <template #default="{ row }">
                    <tiny-alert :closable="false" :type="row.color">
                      <template #description>
                        <span v-if="row.name != ''">{{ row.name }}：</span>
                        <span v-if="row.type == 'text'">{{ row.value }}</span>
                        <a v-if="row.type == 'url'" :href="row.value" target="_blank">{{ row.value }}</a>
                      </template>
                    </tiny-alert>
                  </template>
                </tiny-grid-column>
                <tiny-grid-column title="操作" align="center">
                  <template #default="{ $rowIndex }">
                    <tiny-button type="danger" @click="removeInfo($rowIndex)">删除</tiny-button>
                  </template>
                </tiny-grid-column>
              </tiny-grid>
            </div>
          </tiny-form-item>
        </tiny-form>
      </div>
      <div class="sp">
        <div class="bold-text">ID</div>
        <div>{{ id }}</div>
        <tiny-button type="info" @click="copy">复制</tiny-button>
      </div>
      <div class="sp">
        <div class="bold-text">提交审核时间</div>
        <div>{{ submitreviewdate }}</div>
      </div>
      <tiny-divider></tiny-divider>
      <tiny-radio-group v-model="reviewstatus">
        <tiny-radio label="valid">通过</tiny-radio>
        <tiny-radio label="invalid">不通过</tiny-radio>
      </tiny-radio-group>
      <div v-if="releasestatus == 'unrelease' && reviewstatus == 'valid'" class="sp">
        <div class="bold-text">上架</div>
        <tiny-switch v-model="release"></tiny-switch>
      </div>
      <tiny-input v-if="reviewstatus == 'invalid'" v-model="reviewinvalidreason" type="textarea" autosize
        show-word-limit maxlength="500" placeholder="请输入不通过原因"></tiny-input>
      <div v-if="reviewstatus == 'invalid'" class="sp">
        <div class="bold-text">禁止修改、提交审核</div>
        <tiny-switch v-model="disallowupdate"></tiny-switch>
      </div>
      <tiny-button type="info" @click="updateReviewResult">提交</tiny-button>
    </div>
  </div>
</template>