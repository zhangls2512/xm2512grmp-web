<script setup>
document.title = '轩铭2512 - 管理后台 - 备案许可管理'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const data = ref([])
const products = ref([])
const currentpage = ref(1)
const pagesize = ref(10)
const total = ref(0)
const productnumber = ref('')
const maintype = ref('')
const dialog = ref(false)
const id = ref('')
const desc = ref('')
const maintypes = ref([
  {
    value: '',
    label: '全部'
  },
  {
    value: '0',
    label: '许可'
  },
  {
    value: '1',
    label: '产品备案'
  },
  {
    value: '2',
    label: '特殊场景适配备案'
  },
  {
    value: '3',
    label: '隐私安全备案'
  },
  {
    value: '4',
    label: '算法备案'
  }
])
async function get() {
  const countres = await request({
    apiPath: '/admin/getBaxkCount',
    body: {
      accessToken: accesstoken,
      productNumber: productnumber.value,
      mainType: maintype.value
    }
  })
  total.value = countres.count
  const res = await request({
    apiPath: '/admin/getBaxkList',
    body: {
      accessToken: accesstoken,
      productNumber: productnumber.value,
      mainType: maintype.value,
      skip: (currentpage.value - 1) * pagesize.value,
      limit: pagesize.value
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  const maintypemap = {
    '0': '许可',
    '1': '产品备案',
    '2': '特殊场景适配备案',
    '3': '隐私安全备案',
    '4': '算法备案'
  }
  const specificmap = {
    '0': {
      '0': '成人信息服务',
      '1': '敏感信息收集处理服务'
    },
    '1': {
      '0': '网页',
      '1': '微信小程序',
      '2': '鸿蒙原生应用',
      '3': '鸿蒙元服务'
    },
    '2': {
      '0': '适老化',
      '1': '未成年',
      '2': '无障碍',
      '3': '大小屏',
      '4': '特殊网络环境',
      '5': '深色模式',
      '6': '多语言'
    },
    '3': {
      '0': '-'
    },
    '4': {
      '0': '个性化推送类',
      '1': '排序精选类',
      '2': '检索过滤类',
      '3': '调度决策类',
      '4': '生成合成类'
    }
  }
  data.value = res.data.map(item => ({
    ...item,
    mainType: maintypemap[item.mainType],
    specificType: specificmap[item.mainType][item.specificType]
  }))
}
async function getProducts() {
  const res = await request({
    apiPath: '/admin/getProductBaList',
    body: {
      accessToken: accesstoken
    }
  })
  products.value = res.data.map(item => ({
    value: item.productNumber,
    label: item.productName
  }))
  products.value.unshift({
    value: '',
    label: '全部'
  })
}
get()
getProducts()
function currentpageChange(t) {
  currentpage.value = t
  get()
}
function pagesizeChange(t) {
  pagesize.value = t
  get()
}
function newBaxk() {
  router.push('/product/admin/newbaxk')
}
function copy(value) {
  navigator.clipboard.writeText(value)
  TinyModal.message({
    message: '内容已复制',
    status: 'success'
  })
}
function openDialog(row) {
  dialog.value = true
  id.value = row._id
  desc.value = row.desc
}
function closeDialog() {
  dialog.value = false
  id.value = ''
  desc.value = ''
}
async function updateBaxkDesc() {
  if (desc.value === '') {
    TinyModal.message({
      message: '请输入描述',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/admin/updateBaxkDesc',
    body: {
      accessToken: accesstoken,
      id: id.value,
      desc: desc.value
    }
  })
  TinyModal.message({
    message: '修改成功',
    status: 'success'
  })
  closeDialog()
  get()
}
async function deleteBaxk(t) {
  await request({
    apiPath: '/admin/deleteBaxk',
    body: {
      accessToken: accesstoken,
      id: t
    }
  })
  TinyMessage({
    message: '注销成功',
    status: 'success'
  })
  get()
}
</script>

<template>
  <div class="cz">
    <div><tiny-button type="success" @click="newBaxk">新增</tiny-button></div>
    <div class="sp">
      <tiny-base-select v-model="maintype">
        <tiny-option v-for="item in maintypes" :label="item.label" :value="item.value"></tiny-option>
      </tiny-base-select>
      <tiny-base-select v-model="productnumber">
        <tiny-option v-for="item in products" :label="item.label" :value="item.value"></tiny-option>
      </tiny-base-select>
      <tiny-button type="info" @click="get">搜索</tiny-button>
    </div>
    <tiny-grid :data="data">
      <tiny-grid-column field="productNumber" title="产品号" align="center"></tiny-grid-column>
      <tiny-grid-column field="mainType" title="类型" align="center"></tiny-grid-column>
      <tiny-grid-column field="productName" title="产品名称" align="center"></tiny-grid-column>
      <tiny-grid-column field="specificType" title="具体类型" align="center"></tiny-grid-column>
      <tiny-grid-column field="desc" title="描述" align="center" show-overflow></tiny-grid-column>
      <tiny-grid-column title="备案/许可号" align="center" format-text="longDateTime">
        <template #default="{ row }">
          <tiny-tooltip content="点击复制" placement="top">
            <div style="cursor: pointer" @click="copy(row.baxkNumber)">{{ row.baxkNumber }}</div>
          </tiny-tooltip>
        </template>
      </tiny-grid-column>
      <tiny-grid-column field="date" title="更新时间" align="center" format-text="longDateTime"></tiny-grid-column>
      <tiny-grid-column title="操作" align="center">
        <template #default="{ row }">
          <div class="czsp">
            <tiny-button type="info" @click="openDialog(row)">修改描述</tiny-button>
            <tiny-popconfirm title="提示" message="注销后无法恢复，确定注销？" type="warning" trigger="hover"
              @confirm="deleteBaxk(row._id)">
              <template #reference>
                <tiny-button type="danger">注销</tiny-button>
              </template>
            </tiny-popconfirm>
          </div>
        </template>
      </tiny-grid-column>
    </tiny-grid>
    <tiny-pager mode="number" :current-page="currentpage" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]"
      :total="total" @current-change="currentpageChange" @size-change="pagesizeChange"></tiny-pager>
    <tiny-dialog-box class="dialog" :visible="dialog" title="修改描述" @close="closeDialog">
      <tiny-input v-model="desc" type="textarea" autosize placeholder="请输入描述"></tiny-input>
      <template #footer>
        <tiny-button type="info" @click="updateBaxkDesc">修改</tiny-button>
      </template>
    </tiny-dialog-box>
  </div>
</template>