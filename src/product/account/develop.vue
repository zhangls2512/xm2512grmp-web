<script setup>
document.title = '轩铭2512 - 统一账号 - 账号管理 - 开发管理'
import { ref } from 'vue'
import cookie from 'js-cookie'
import moment from 'moment-timezone'
import request from '../../request'
const accesstoken = cookie.get('accessToken')
const accesskeys = ref([])
const apis = ref([
  {
    product: '全部产品',
    name: 'product_getUserInfo',
    desc: '获取用户信息'
  },
  {
    product: '全部产品',
    name: 'product_setWebhookUrl',
    desc: '设置 Webhook 推送地址'
  },
  {
    product: '全部产品',
    name: 'product_updateNoticeSetting',
    desc: '修改通知设置'
  },
  {
    product: '统一账号',
    name: 'account_openService',
    desc: '开通产品/功能'
  },
  {
    product: '统一账号',
    name: 'account_closeService',
    desc: '取消开通产品/功能'
  },
  {
    product: '统一账号',
    name: 'account_getUserBanlogCount',
    desc: '获取违规记录总数'
  },
  {
    product: '统一账号',
    name: 'account_getBanlog',
    desc: '获取违规记录列表'
  },
  {
    product: '管理后台',
    name: 'admin_getUserCount',
    desc: '获取用户总数'
  },
  {
    product: '管理后台',
    name: 'admin_getUserList',
    desc: '获取用户列表'
  },
  {
    product: '管理后台',
    name: 'admin_searchUser',
    desc: '搜索单个用户'
  },
  {
    product: '管理后台',
    name: 'admin_updateUserPermission',
    desc: '修改用户权限'
  },
  {
    product: '管理后台',
    name: 'admin_newBanlog',
    desc: '新增违规记录'
  },
  {
    product: '管理后台',
    name: 'admin_getBanlogCount',
    desc: '获取违规记录总数'
  },
  {
    product: '管理后台',
    name: 'admin_getBanlogList',
    desc: '获取违规记录列表'
  },
  {
    product: '管理后台',
    name: 'admin_deleteBanlog',
    desc: '删除违规记录'
  },
  {
    product: '管理后台',
    name: 'admin_getProductBaList',
    desc: '获取产品备案列表'
  },
  {
    product: '管理后台',
    name: 'admin_newBaxk',
    desc: '新增备案/许可'
  },
  {
    product: '管理后台',
    name: 'admin_getBaxkCount',
    desc: '获取备案/许可总数'
  },
  {
    product: '管理后台',
    name: 'admin_getBaxkList',
    desc: '获取备案/许可列表'
  },
  {
    product: '管理后台',
    name: 'admin_updateBaxkDesc',
    desc: '修改备案/许可描述'
  },
  {
    product: '管理后台',
    name: 'admin_deleteBaxk',
    desc: '注销备案/许可'
  }
])
const filter = ref({
  multi: true,
  enumable: true
})
const selectconfig = {
  checkField: 'selected'
}
const newaccesskeydialog = ref(false)
const updateaccesskeydialog = ref(false)
const accesskeyname = ref('')
const accesskeyenddate = ref('')
const accesskeyforever = ref(false)
const accesskeyallowip = ref([])
const ip = ref('')
let accesskeyapi = []
const accesskeystatus = ref(false)
let accesskeyindex = 0
function formatEnddate(t) {
  const enddate = t.cellValue
  if (enddate == 0) {
    return '永久'
  } else {
    return moment(enddate).format('YYYY-MM-DD HH:mm:ss')
  }
}
async function getAccessKeys() {
  const res = await request({
    apiPath: '/account/getAccountInfo',
    body: {
      accessToken: accesstoken
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  accesskeys.value = res.data.accessKey
}
getAccessKeys()
function newAccessKeyOpen() {
  newaccesskeydialog.value = true
}
function newAccessKeyClose() {
  newaccesskeydialog.value = false
  accesskeyname.value = ''
  accesskeyenddate.value = ''
  accesskeyforever.value = false
  ip.value = ''
  accesskeyallowip.value = []
  accesskeyapi = []
  accesskeystatus.value = false
}
function addIp() {
  if (ip.value === '') {
    TinyModal.message({
      message: '请输入 CIDR 表达式',
      status: 'warning'
    })
    return
  }
  accesskeyallowip.value.push(ip.value)
}
function removeIp(index) {
  accesskeyallowip.value.splice(index, 1)
}
function chooseApi(t) {
  accesskeyapi = t.selection.map(item => item.name)
}
async function newAccessKey() {
  if (accesskeyname.value === '') {
    TinyModal.message({
      message: '请输入备注',
      status: 'warning'
    })
    return
  }
  if (accesskeyenddate.value === '' && !accesskeyforever.value) {
    TinyModal.message({
      message: '请选择到期时间',
      status: 'warning'
    })
    return
  }
  let enddate = 0
  if (!accesskeyforever.value) {
    enddate = accesskeyenddate.value.getTime()
  }
  const res = await request({
    apiPath: '/account/newAccessKey',
    body: {
      accessToken: accesstoken,
      name: accesskeyname.value,
      endDate: enddate,
      api: accesskeyapi,
      allowIp: accesskeyallowip.value,
      status: accesskeystatus.value
    }
  })
  newAccessKeyClose()
  TinyModal.alert({
    status: 'success',
    title: '新增成功',
    message: 'accessKey：' + res.accessKey + '（请妥善保存。为了保证账号安全，不支持重新查看）',
    events: {
      confirm() {
        getAccessKeys()
      }
    }
  })
}
async function updateAccessKeyStatus(index, wz) {
  await request({
    apiPath: '/account/updateAccessKeyStatus',
    body: {
      accessToken: accesstoken,
      index: index
    }
  })
  TinyModal.message({
    message: wz + '成功',
    status: 'success'
  })
  getAccessKeys()
}
async function updateAccessKeyOpen(row, index) {
  updateaccesskeydialog.value = true
  accesskeyindex = index
  accesskeyname.value = row.name
  if (row.endDate == 0) {
    accesskeyforever.value = true
  } else {
    accesskeyenddate.value = new Date(row.endDate)
  }
  accesskeyapi = row.api
  apis.value = apis.value.map(item => ({
    ...item,
    selected: row.api.includes(item.name)
  }))
  accesskeyallowip.value = row.allowIp
}
function updateAccessKeyClose() {
  updateaccesskeydialog.value = false
  accesskeyname.value = ''
  accesskeyenddate.value = ''
  accesskeyforever.value = false
  ip.value = ''
  accesskeyallowip.value = []
  accesskeyapi = []
}
async function updateAccessKey() {
  if (accesskeyname.value === '') {
    TinyModal.message({
      message: '请输入备注',
      status: 'warning'
    })
    return
  }
  if (accesskeyenddate.value === '' && !accesskeyforever.value) {
    TinyModal.message({
      message: '请选择到期时间',
      status: 'warning'
    })
    return
  }
  let enddate = 0
  if (!accesskeyforever.value) {
    enddate = accesskeyenddate.value.getTime()
  }
  await request({
    apiPath: '/account/updateAccessKeyInfo',
    body: {
      accessToken: accesstoken,
      index: accesskeyindex,
      name: accesskeyname.value,
      endDate: enddate,
      api: accesskeyapi,
      allowIp: accesskeyallowip.value
    }
  })
  updateAccessKeyClose()
  TinyModal.message({
    message: '保存成功',
    status: 'success'
  })
  getAccessKeys()
}
async function deleteAccessKey(index) {
  await request({
    apiPath: '/account/deleteAccessKey',
    body: {
      accessToken: accesstoken,
      index: index
    }
  })
  TinyModal.message({
    message: '删除成功',
    status: 'success'
  })
  getAccessKeys()
}
</script>

<template>
  <div>
    <div class="cz">
      <div class="large-bold-text">accessKey</div>
      <tiny-alert type="warning" :closable="false"
        description="accessKey 是调用 API 的凭证，请勿泄露给他人，防止账号被他人非法使用。为了保证账号安全，建议仅开启必要接口的权限、设置合理的到期时间和 IP 白名单、及时禁用或删除不再使用的 accessKey。"></tiny-alert>
      <div><tiny-button type="info" @click="newAccessKeyOpen">新增</tiny-button></div>
      <tiny-grid :data="accesskeys">
        <tiny-grid-column type="index" title="序号" align="center"></tiny-grid-column>
        <tiny-grid-column field="name" title="备注" align="center"></tiny-grid-column>
        <tiny-grid-column field="endDate" title="到期时间" align="center" :format-text="formatEnddate"
          sortable></tiny-grid-column>
        <tiny-grid-column field="api" title="API 白名单" align="center" show-overflow></tiny-grid-column>
        <tiny-grid-column field="allowIp" title="IP 白名单" align="center" show-overflow></tiny-grid-column>
        <tiny-grid-column field="status" title="启用" align="center" format-text="boole"></tiny-grid-column>
        <tiny-grid-column field="lastUsedDate" title="最近使用时间" align="center" format-text="longDateTime"
          sortable></tiny-grid-column>
        <tiny-grid-column title="操作" align="center">
          <template #default="{ row, $rowIndex }">
            <div class="sp">
              <tiny-button v-if="row.status == false" type="success"
                @click="updateAccessKeyStatus($rowIndex, '启用')">启用</tiny-button>
              <tiny-button v-if="row.status == true" type="danger"
                @click="updateAccessKeyStatus($rowIndex, '禁用')">禁用</tiny-button>
              <tiny-button type="info" @click="updateAccessKeyOpen(row, $rowIndex)">编辑</tiny-button>
              <tiny-popconfirm title="提示" message="删除后无法恢复，确定删除？" type="warning" trigger="hover"
                @confirm="deleteAccessKey($rowIndex)">
                <template #reference>
                  <tiny-button type="danger">删除</tiny-button>
                </template>
              </tiny-popconfirm>
            </div>
          </template>
        </tiny-grid-column>
      </tiny-grid>
    </div>
    <tiny-dialog-box class="dialog" :visible="newaccesskeydialog" title="新增 accessKey" @close="newAccessKeyClose">
      <div class="dialog-cz">
        <tiny-input v-model="accesskeyname" clearable minlength="1" maxlength="10" placeholder="请输入备注"></tiny-input>
        <div class="sp">
          <tiny-date-picker v-model="accesskeyenddate" type="datetime" align="center"
            placeholder="请选择到期时间"></tiny-date-picker>
          <div>永久</div>
          <tiny-switch v-model="accesskeyforever"></tiny-switch>
        </div>
        <div>请勾选允许调用的 API</div>
        <tiny-grid :data="apis" @select-change="chooseApi" @select-all="chooseApi">
          <tiny-grid-column type="selection"></tiny-grid-column>
          <tiny-grid-column field="product" title="产品" align="center" :filter="filter"></tiny-grid-column>
          <tiny-grid-column field="name" title="英文名" align="center"></tiny-grid-column>
          <tiny-grid-column field="desc" title="描述" align="center"></tiny-grid-column>
        </tiny-grid>
        <div class="sp">
          <tiny-input v-model="ip" clearable placeholder="请输入白名单 IP（CIDR 表达式）"></tiny-input>
          <tiny-button type="success" @click="addIp">新增</tiny-button>
        </div>
        <div v-for="(item, index) in accesskeyallowip" class="sp">
          <tiny-tag type="info">{{ item }}</tiny-tag>
          <tiny-button type="danger" @click="removeIp(index)">删除</tiny-button>
        </div>
        <div class="sp">
          <div>启用</div>
          <tiny-switch v-model="accesskeystatus"></tiny-switch>
        </div>
      </div>
      <template #footer>
        <tiny-button type="info" @click="newAccessKey">新增</tiny-button>
      </template>
    </tiny-dialog-box>
    <tiny-dialog-box class="dialog" :visible="updateaccesskeydialog" title="编辑 accessKey" @close="updateAccessKeyClose">
      <div class="dialog-cz">
        <tiny-input v-model="accesskeyname" clearable minlength="1" maxlength="10" placeholder="请输入备注"></tiny-input>
        <div class="sp">
          <tiny-date-picker v-model="accesskeyenddate" type="datetime" align="center"
            placeholder="请选择到期时间"></tiny-date-picker>
          <div>永久</div>
          <tiny-switch v-model="accesskeyforever"></tiny-switch>
        </div>
        <div>请勾选允许调用的 API</div>
        <tiny-grid :data="apis" :select-config="selectconfig" @select-change="chooseApi" @select-all="chooseApi">
          <tiny-grid-column type="selection"></tiny-grid-column>
          <tiny-grid-column field="product" title="产品" align="center" :filter="filter"></tiny-grid-column>
          <tiny-grid-column field="name" title="名称" align="center"></tiny-grid-column>
          <tiny-grid-column field="desc" title="描述" align="center"></tiny-grid-column>
        </tiny-grid>
        <div class="sp">
          <tiny-input v-model="ip" clearable placeholder="请输入白名单 IP（CIDR 表达式）"></tiny-input>
          <tiny-button type="success" @click="addIp">新增</tiny-button>
        </div>
        <div v-for="(item, index) in accesskeyallowip" class="sp">
          <tiny-tag type="info">{{ item }}</tiny-tag>
          <tiny-button type="danger" @click="removeIp(index)">删除</tiny-button>
        </div>
      </div>
      <template #footer>
        <tiny-button type="info" @click="updateAccessKey">保存</tiny-button>
      </template>
    </tiny-dialog-box>
  </div>
</template>