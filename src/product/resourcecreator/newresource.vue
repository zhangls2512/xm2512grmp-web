<script setup>
document.title = '轩铭2512 - 资源投稿 - 新增资源（完整）'
import { ref } from 'vue'
import cookie from 'js-cookie'
import sortable from 'sortablejs'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const name = ref('')
const desc = ref('')
const version = ref('')
const location = ref([])
const locationname = ref('')
const locationtype = ref('text')
const locationvalue = ref('')
const locationtag = ref([])
const locationtagtype = ref('')
const locationtagvalue = ref('')
const frequentlocationtag = ref([
  {
    type: 'success',
    value: '国内访问快'
  },
  {
    type: 'info',
    value: '国内访问适中'
  },
  {
    type: 'warning',
    value: '国内访问慢'
  },
  {
    type: 'danger',
    value: '国内无法访问'
  },
  {
    type: 'success',
    value: '国内下载快'
  },
  {
    type: 'info',
    value: '国内下载适中'
  },
  {
    type: 'warning',
    value: '国内下载慢'
  },
  {
    type: 'danger',
    value: '国内无法下载'
  },
  {
    type: 'success',
    value: '官方'
  },
  {
    type: 'info',
    value: '镜像'
  },
  {
    type: 'success',
    value: '更新及时'
  },
  {
    type: 'info',
    value: '更新较及时'
  }
])
const tag = ref([])
const tagtype = ref('')
const tagvalue = ref('')
const frequenttag = ref([
  {
    type: '',
    value: '电脑软件'
  },
  {
    type: 'success',
    value: '官网'
  },
  {
    type: 'info',
    value: '实用工具'
  },
  {
    type: 'success',
    value: '免费'
  },
  {
    type: 'warning',
    value: '部分付费'
  },
  {
    type: 'warning',
    value: '少量付费'
  },
  {
    type: '',
    value: '下载'
  }
])
const info = ref([])
const infoname = ref('')
const infotype = ref('text')
const infovalue = ref('')
const infocolor = ref('simple')
const submitreview = ref(false)
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
function addFrequentLocationTag(index) {
  locationtag.value.push(frequentlocationtag.value[index])
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
function addFrequentTag(index) {
  tag.value.push(frequenttag.value[index])
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
async function newResource() {
  if (!name.value) {
    TinyModal.message({
      message: '请输入名称',
      status: 'warning'
    })
    return
  }
  if (location.value.length == 0) {
    TinyModal.message({
      message: '请添加地址',
      status: 'warning'
    })
    return
  }
  const res = await request({
    apiPath: '/resourcecreator/newResource',
    body: {
      accessToken: accesstoken,
      name: name.value,
      desc: desc.value,
      version: version.value,
      location: location.value,
      tag: tag.value,
      info: info.value
    }
  })
  TinyModal.message({
    message: '新增成功',
    status: 'success'
  })
  if (submitreview.value) {
    await request({
      apiPath: '/resourcecreator/submitReviewResource',
      body: {
        accessToken: accesstoken,
        id: res.id
      }
    })
    TinyModal.message({
      message: '提交审核成功',
      status: 'success'
    })
  }
  router.push('/product/resourcecreator/resourcelist')
}
</script>

<template>
  <div class="cz">
    <tiny-breadcrumb>
      <tiny-breadcrumb-item :to="{ path: '/product/resourcecreator/resourcelist' }" label="资源管理"></tiny-breadcrumb-item>
      <tiny-breadcrumb-item :to="{ path: '/product/resourcecreator/newresource' }"
        label="新增资源（完整）"></tiny-breadcrumb-item>
    </tiny-breadcrumb>
    <tiny-alert :closable="false">
      <template #description>
        <div>建议阅读<a href="https://docs.qq.com/doc/p/9cdd406b1baf3818877edcaf02f7317adcb793ee"
            target="_blank">《审核标准》</a>并按照其中的要求、说明填写信息，谢谢。</div>
      </template>
    </tiny-alert>
    <tiny-form>
      <tiny-form-item label="名称">
        <tiny-input v-model="name" clearable show-word-limit maxlength="30" placeholder="请输入名称"></tiny-input>
      </tiny-form-item>
      <tiny-form-item label="简介">
        <tiny-input v-model="desc" type="textarea" autosize clearable show-word-limit maxlength="500"
          placeholder="请输入简介（可选）"></tiny-input>
      </tiny-form-item>
      <tiny-form-item label="版本号">
        <tiny-input v-model="version" clearable show-word-limit maxlength="30" placeholder="请输入版本号（可选）"></tiny-input>
      </tiny-form-item>
      <tiny-form-item label="地址">
        <div class="cz">
          <tiny-input v-model="locationname" clearable show-word-limit maxlength="30"
            placeholder="请输入名称（可选）"></tiny-input>
          <tiny-base-select v-model="locationtype">
            <tiny-option v-for="item in typeas" :value="item.value" :label="item.label"></tiny-option>
          </tiny-base-select>
          <tiny-input v-model="locationvalue" type="textarea" autosize clearable show-word-limit maxlength="500"
            placeholder="请输入地址"></tiny-input>
          <div class="sp">
            <tiny-base-select v-model="locationtagtype">
              <tiny-option v-for="item in typebs" :value="item.value" :label="item.label"></tiny-option>
            </tiny-base-select>
            <tiny-input v-model="locationtagvalue" clearable show-word-limit maxlength="30"
              placeholder="请输入内容"></tiny-input>
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
          <div class="sp">
            <div class="bold-text">常用</div>
            <tiny-tag type="info">持续更新中</tiny-tag>
          </div>
          <div class="cz">
            <div v-for="(item, index) in frequentlocationtag" class="sp">
              <tiny-tag :type="item.type">{{ item.value }}</tiny-tag>
              <tiny-button type="success" @click="addFrequentLocationTag(index)">添加</tiny-button>
            </div>
          </div>
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
            <tiny-input v-model="tagvalue" clearable show-word-limit maxlength="30" placeholder="请输入内容"></tiny-input>
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
          <div class="sp">
            <div class="bold-text">常用</div>
            <tiny-tag type="info">持续更新中</tiny-tag>
          </div>
          <div class="cz">
            <div v-for="(item, index) in frequenttag" class="sp">
              <tiny-tag :type="item.type">{{ item.value }}</tiny-tag>
              <tiny-button type="success" @click="addFrequentTag(index)">添加</tiny-button>
            </div>
          </div>
        </div>
      </tiny-form-item>
      <tiny-form-item label="更多信息">
        <div class="cz">
          <tiny-base-select v-model="infocolor">
            <tiny-option v-for="item in typecs" :value="item.value" :label="item.label"></tiny-option>
          </tiny-base-select>
          <tiny-input v-model="infoname" clearable show-word-limit maxlength="30" placeholder="请输入名称（可选）"></tiny-input>
          <tiny-base-select v-model="infotype">
            <tiny-option v-for="item in typeas" :value="item.value" :label="item.label"></tiny-option>
          </tiny-base-select>
          <tiny-input v-model="infovalue" type="textarea" autosize clearable show-word-limit maxlength="500"
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
      <tiny-form-item label="提交审核">
        <tiny-switch v-model="submitreview"></tiny-switch>
      </tiny-form-item>
      <tiny-form-item>
        <tiny-button type="success" @click="newResource">新增</tiny-button>
      </tiny-form-item>
    </tiny-form>
  </div>
</template>