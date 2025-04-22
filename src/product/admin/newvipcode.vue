<script setup>
document.title = '轩铭2512 - 管理后台 - 新增产品会员兑换码'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const product = ref('password')
const products = ref([
  {
    value: 'password',
    label: '密码智能备忘录'
  }
])
const duration = ref('')
const permissiontype = ref('uid')
const permission = ref('')
const enddate = ref('')
const enddateforever = ref('false')
async function newVipcode() {
  if (duration.value === '') {
    TinyModal.message({
      message: '请输入时长',
      status: 'warning'
    })
    return
  }
  const durationout = Number(duration.value)
  if (!Number.isInteger(durationout) || durationout < 0) {
    TinyModal.message({
      message: '请输入有效的时长',
      status: 'warning'
    })
    return
  }
  if (permission.value === '') {
    TinyModal.message({
      message: '请输入权限',
      status: 'warning'
    })
    return
  }
  let permissionout = permission.value
  if (permissiontype.value === 'maxcount') {
    permissionout = Number(permissionout)
    if (!Number.isInteger(permissionout) || permissionout <= 0) {
      TinyModal.message({
        message: '请输入有效的权限',
        status: 'warning'
      })
      return
    }
  }
  let enddateout = enddate.value
  if (enddateforever.value == 'true') {
    enddateout = 0
  }
  if (enddateforever.value == 'false' && enddate.value === '') {
    TinyModal.message({
      message: '请选择截止时间',
      status: 'warning'
    })
    return
  }
  if (enddateforever.value == 'false' && enddate.value) {
    enddateout = enddateout.getTime()
  }
  await request({
    apiPath: '/admin/newVipcode',
    body: {
      accessToken: accesstoken,
      product: product.value,
      permission: permissionout,
      duration: durationout,
      endDate: enddateout
    }
  })
  TinyModal.message({
    message: '新增成功',
    status: 'success'
  })
  router.push('/product/admin/vipcodelist')
}
</script>

<template>
  <div class="cz">
    <tiny-breadcrumb>
      <tiny-breadcrumb-item :to="{ path: '/product/admin/vipcodelist' }" label="兑换码"></tiny-breadcrumb-item>
      <tiny-breadcrumb-item :to="{ path: '/product/admin/newvipcode' }" label="新增兑换码"></tiny-breadcrumb-item>
    </tiny-breadcrumb>
    <tiny-form>
      <tiny-form-item label="产品">
        <tiny-base-select v-model="product">
          <tiny-option v-for="item in products" :value="item.value" :label="item.label"></tiny-option>
        </tiny-base-select>
      </tiny-form-item>
      <tiny-form-item label="时长">
        <tiny-input v-model="duration" type="number" clearable placeholder="请输入时长，单位：天，终身输入 0"></tiny-input>
      </tiny-form-item>
      <tiny-form-item label="权限类型">
        <tiny-radio-group v-model="permissiontype">
          <tiny-radio label="uid">指定用户</tiny-radio>
          <tiny-radio label="maxcount">最大次数</tiny-radio>
        </tiny-radio-group>
      </tiny-form-item>
      <tiny-form-item label="权限">
        <tiny-input v-model="permission" clearable placeholder="请输入权限"></tiny-input>
      </tiny-form-item>
      <tiny-form-item label="截止时间">
        <tiny-radio-group v-model="enddateforever">
          <tiny-radio label="false">
            <tiny-date-picker v-model="enddate" type="datetime" align="center" placeholder="请选择时间"></tiny-date-picker>
          </tiny-radio>
          <tiny-radio label="true">永久</tiny-radio>
        </tiny-radio-group>
      </tiny-form-item>
      <tiny-form-item>
        <tiny-button type="success" @click="newVipcode">新增</tiny-button>
      </tiny-form-item>
    </tiny-form>
  </div>
</template>