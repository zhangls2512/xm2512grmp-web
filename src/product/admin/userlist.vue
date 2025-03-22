<script setup>
document.title = '轩铭2512 - 管理后台 - 用户管理'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
const accesstoken = cookie.get('accessToken')
const data = ref([])
const currentpage = ref(1)
const pagesize = ref(10)
const total = ref(0)
const uid = ref('')
const dialog = ref(false)
const updateuid = ref('')
const account = ref(true)
const admin = ref(true)
const password = ref(true)
const resource = ref(true)
const resourcecreator = ref(true)
const smdztj = ref(true)
const ssl = ref(true)
const todo = ref(true)
const accountdate = ref('')
const admindate = ref('')
const passworddate = ref('')
const resourcedate = ref('')
const resourcecreatordate = ref('')
const smdztjdate = ref('')
const ssldate = ref('')
const tododate = ref('')
async function get() {
  const countres = await request({
    apiPath: '/admin/getUserCount',
    body: {
      accessToken: accesstoken
    }
  })
  total.value = countres.count
  const res = await request({
    apiPath: '/admin/getUserList',
    body: {
      accessToken: accesstoken,
      skip: (currentpage.value - 1) * pagesize.value,
      limit: pagesize.value
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  data.value = res.data
}
get()
async function currentpageChange(t) {
  currentpage.value = t
  get()
}
async function pagesizeChange(t) {
  pagesize.value = t
  get()
}
async function search() {
  if (uid.value === '') {
    TinyModal.message({
      message: '请输入 UID',
      status: 'warning'
    })
    return
  }
  const userres = await request({
    apiPath: '/admin/searchUser',
    body: {
      accessToken: accesstoken,
      uid: uid.value
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  data.value = userres.data
}
function openDialog(t) {
  dialog.value = true
  updateuid.value = t._id
  function getvalue(value) {
    if (value === true) {
      return 'true'
    }
    if (value === false) {
      return 'false'
    }
    if (typeof value == 'number') {
      return 'date'
    }
  }
  account.value = getvalue(t.permission.account)
  admin.value = getvalue(t.permission.admin)
  password.value = getvalue(t.permission.password)
  resource.value = getvalue(t.permission.resource)
  resourcecreator.value = getvalue(t.permission.resourcecreator)
  smdztj.value = getvalue(t.permission.smdztj)
  ssl.value = getvalue(t.permission.ssl)
  todo.value = getvalue(t.permission.todo)
  if (typeof (t.permission.account) == 'number') {
    accountdate.value = new Date(t.permission.account)
  }
  if (typeof (t.permission.admin) == 'number') {
    admindate.value = new Date(t.permission.admin)
  }
  if (typeof (t.permission.password) == 'number') {
    passworddate.value = new Date(t.permission.password)
  }
  if (typeof (t.permission.resource) == 'number') {
    resourcedate.value = new Date(t.permission.resource)
  }
  if (typeof (t.permission.resourcecreator) == 'number') {
    resourcecreatordate.value = new Date(t.permission.resourcecreator)
  }
  if (typeof (t.permission.smdztj) == 'number') {
    smdztjdate.value = new Date(t.permission.smdztj)
  }
  if (typeof (t.permission.ssl) == 'number') {
    ssldate.value = new Date(t.permission.ssl)
  }
  if (typeof (t.permission.account) == 'number') {
    tododate.value = new Date(t.permission.todo)
  }
}
function closeDialog() {
  dialog.value = false
  updateuid.value = ''
  account.value = true
  admin.value = true
  password.value = true
  resource.value = true
  resourcecreator.value = true
  smdztj.value = true
  ssl.value = true
  todo.value = true
  accountdate.value = ''
  admindate.value = ''
  passworddate.value = ''
  resourcedate.value = ''
  resourcecreatordate.value = ''
  smdztjdate.value = ''
  ssldate.value = ''
  tododate.value = ''
}
async function updateUserPermission() {
  let permission = {}
  function boolean(value) {
    if (value === 'true') {
      return true
    }
    if (value === 'false') {
      return false
    }
  }
  if (account.value === 'true' || account.value === 'false') {
    permission.account = boolean(account.value)
  } else {
    permission.account = accountdate.value.getTime()
  }
  if (admin.value === 'true' || admin.value === 'false') {
    permission.admin = boolean(admin.value)
  } else {
    permission.admin = admindate.value.getTime()
  }
  if (password.value === 'true' || password.value === 'false') {
    permission.password = boolean(password.value)
  } else {
    permission.password = passworddate.value.getTime()
  }
  if (resource.value === 'true' || resource.value === 'false') {
    permission.resource = boolean(resource.value)
  } else {
    permission.resource = resourcedate.value.getTime()
  }
  if (resourcecreator.value === 'true' || resourcecreator.value === 'false') {
    permission.resourcecreator = boolean(resourcecreator.value)
  } else {
    permission.resourcecreator = resourcecreatordate.value.getTime()
  }
  if (smdztj.value === 'true' || smdztj.value === 'false') {
    permission.smdztj = boolean(smdztj.value)
  } else {
    permission.smdztj = smdztjdate.value.getTime()
  }
  if (ssl.value === 'true' || ssl.value === 'false') {
    permission.ssl = boolean(ssl.value)
  } else {
    permission.ssl = ssldate.value.getTime()
  }
  if (todo.value === 'true' || todo.value === 'false') {
    permission.todo = boolean(todo.value)
  } else {
    permission.todo = tododate.value.getTime()
  }
  await request({
    apiPath: '/admin/updateUserPermission',
    body: {
      accessToken: accesstoken,
      uid: updateuid.value,
      permission: permission
    }
  })
  closeDialog()
  TinyModal.message({
    message: '修改成功',
    status: 'success'
  })
  get()
}
</script>

<template>
  <div class="cz">
    <div class="sp">
      <tiny-input v-model="uid" clearable placeholder="请输入 UID"></tiny-input>
      <tiny-button type="info" @click="search">搜索</tiny-button>
    </div>
    <tiny-grid :data="data">
      <tiny-grid-column field="_id" title="UID" align="center"></tiny-grid-column>
      <tiny-grid-column field="email" title="邮箱" align="center"></tiny-grid-column>
      <tiny-grid-column field="service" title="已开通产品/功能" align="center" show-overflow></tiny-grid-column>
      <tiny-grid-column title="操作" align="center">
        <template #default="{ row }">
          <tiny-button type="info" @click="openDialog(row)">修改权限</tiny-button>
        </template>
      </tiny-grid-column>
    </tiny-grid>
    <tiny-pager mode="number" :current-page="currentpage" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]"
      :total="total" @current-change="currentpageChange" @size-change="pagesizeChange"></tiny-pager>
    <tiny-dialog-box class="dialog" :visible="dialog" title="修改权限" @close="closeDialog">
      <div class="dialog-cz">
        <div class="sp">
          <div>统一账号</div>
          <tiny-radio-group v-model="account">
            <tiny-radio label="true">正常</tiny-radio>
            <tiny-radio label="false">永久封禁</tiny-radio>
            <tiny-radio label="date">封禁至</tiny-radio>
            <tiny-date-picker v-if="account == 'date'" v-model="accountdate" type="datetime"
              align="center"></tiny-date-picker>
          </tiny-radio-group>
        </div>
        <div class="sp">
          <div>管理后台</div>
          <tiny-radio-group v-model="admin">
            <tiny-radio label="true">正常</tiny-radio>
            <tiny-radio label="false">永久封禁</tiny-radio>
            <tiny-radio label="date">封禁至</tiny-radio>
            <tiny-date-picker v-if="admin == 'date'" v-model="admindate" type="datetime"
              align="center"></tiny-date-picker>
          </tiny-radio-group>
        </div>
        <div class="sp">
          <div>密码智能备忘录</div>
          <tiny-radio-group v-model="password">
            <tiny-radio label="true">正常</tiny-radio>
            <tiny-radio label="false">永久封禁</tiny-radio>
            <tiny-radio label="date">封禁至</tiny-radio>
            <tiny-date-picker v-if="password == 'date'" v-model="passworddate" type="datetime"
              align="center"></tiny-date-picker>
          </tiny-radio-group>
        </div>
        <div class="sp">
          <div>资源</div>
          <tiny-radio-group v-model="resource">
            <tiny-radio label="true">正常</tiny-radio>
            <tiny-radio label="false">永久封禁</tiny-radio>
            <tiny-radio label="date">封禁至</tiny-radio>
            <tiny-date-picker v-if="resource == 'date'" v-model="resourcedate" type="datetime"
              align="center"></tiny-date-picker>
          </tiny-radio-group>
        </div>
        <div class="sp">
          <div>资源投稿</div>
          <tiny-radio-group v-model="resourcecreator">
            <tiny-radio label="true">正常</tiny-radio>
            <tiny-radio label="false">永久封禁</tiny-radio>
            <tiny-radio label="date">封禁至</tiny-radio>
            <tiny-date-picker v-if="resourcecreator == 'date'" v-model="resourcecreatordate" type="datetime"
              align="center"></tiny-date-picker>
          </tiny-radio-group>
        </div>
        <div class="sp">
          <div>数码电子推荐</div>
          <tiny-radio-group v-model="smdztj">
            <tiny-radio label="true">正常</tiny-radio>
            <tiny-radio label="false">永久封禁</tiny-radio>
            <tiny-radio label="date">封禁至</tiny-radio>
            <tiny-date-picker v-if="smdztj == 'date'" v-model="smdztjdate" type="datetime"
              align="center"></tiny-date-picker>
          </tiny-radio-group>
        </div>
        <div class="sp">
          <div>SSL 证书</div>
          <tiny-radio-group v-model="ssl">
            <tiny-radio label="true">正常</tiny-radio>
            <tiny-radio label="false">永久封禁</tiny-radio>
            <tiny-radio label="date">封禁至</tiny-radio>
            <tiny-date-picker v-if="ssl == 'date'" v-model="ssldate" type="datetime" align="center"></tiny-date-picker>
          </tiny-radio-group>
        </div>
        <div class="sp">
          <div>智能待办</div>
          <tiny-radio-group v-model="todo">
            <tiny-radio label="true">正常</tiny-radio>
            <tiny-radio label="false">永久封禁</tiny-radio>
            <tiny-radio label="date">封禁至</tiny-radio>
            <tiny-date-picker v-if="todo == 'date'" v-model="tododate" type="datetime"
              align="center"></tiny-date-picker>
          </tiny-radio-group>
        </div>
      </div>
      <template #footer>
        <tiny-button type="info" @click="updateUserPermission">修改</tiny-button>
      </template>
    </tiny-dialog-box>
  </div>
</template>