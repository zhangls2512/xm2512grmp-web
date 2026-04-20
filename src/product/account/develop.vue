<script setup>
document.title = '轩铭2512 - 统一账号 - 账号管理 - 开发管理'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
import time from '../../time'
const accesstoken = cookie.get('accessToken')
const accesskeys = ref([])
const newaccesskeydialog = ref(false)
const updateaccesskeydialog = ref(false)
let accesskeyindex = 0
const accesskeyname = ref('')
const accesskeyenddate = ref('')
const accesskeyforever = ref(false)
let accesskeyallowapi = []
const accesskeyallowip = ref([])
const ip = ref('')
const accesskeystatus = ref(false)
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
    product: '全部产品',
    name: 'product_useVipcode',
    desc: '使用会员兑换码'
  },
  {
    product: '全部产品',
    name: 'product_getViplogCount',
    desc: '获取会员开通记录总数'
  },
  {
    product: '全部产品',
    name: 'product_getViplogList',
    desc: '获取会员开通记录列表'
  },
  {
    product: '全部产品',
    name: 'product_useInvitationcode',
    desc: '使用邀请码'
  },
  {
    product: '全部产品',
    name: 'product_getInviteUserCount',
    desc: '获取邀请新用户总数'
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
    name: 'account_getBanlogCount',
    desc: '获取违规记录总数'
  },
  {
    product: '统一账号',
    name: 'account_getBanlogList',
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
  },
  {
    product: '管理后台',
    name: 'admin_newVipcode',
    desc: '新增会员兑换码'
  },
  {
    product: '管理后台',
    name: 'admin_getVipcodeCount',
    desc: '获取会员兑换码总数'
  },
  {
    product: '管理后台',
    name: 'admin_getVipcodeList',
    desc: '获取会员兑换码列表'
  },
  {
    product: '管理后台',
    name: 'admin_deleteVipcode',
    desc: '删除会员兑换码'
  },
  {
    product: '管理后台',
    name: 'admin_getViplogCount',
    desc: '获取会员开通记录总数'
  },
  {
    product: '管理后台',
    name: 'admin_getViplogList',
    desc: '获取会员开通记录列表'
  },
  {
    product: '管理后台',
    name: 'admin_getPushCount',
    desc: '获取推送位总数'
  },
  {
    product: '管理后台',
    name: 'admin_getPushList',
    desc: '获取推送位列表'
  },
  {
    product: '管理后台',
    name: 'admin_sendPush',
    desc: '新增推送'
  },
  {
    product: '管理后台',
    name: 'admin_getPushlogCount',
    desc: '获取推送日志总数'
  },
  {
    product: '管理后台',
    name: 'admin_getPushlogList',
    desc: '获取推送日志列表'
  },
  {
    product: '管理后台',
    name: 'admin_revokePush',
    desc: '撤回推送'
  },
  {
    product: '管理后台',
    name: 'admin_deletePushlog',
    desc: '删除推送日志'
  },
  {
    product: '管理后台',
    name: 'admin_getResourceCount',
    desc: '获取资源总数'
  },
  {
    product: '管理后台',
    name: 'admin_getResourceList',
    desc: '获取资源列表'
  },
  {
    product: '管理后台',
    name: 'admin_getResourceInfo',
    desc: '获取资源信息'
  },
  {
    product: '管理后台',
    name: 'admin_releaseResource',
    desc: '上架资源'
  },
  {
    product: '管理后台',
    name: 'admin_unreleaseResource',
    desc: '下架资源'
  },
  {
    product: '管理后台',
    name: 'admin_updateResource',
    desc: '修改资源信息'
  },
  {
    product: '管理后台',
    name: 'admin_updateResourceAuu',
    desc: '修改资源可修改用户设置'
  },
  {
    product: '管理后台',
    name: 'admin_updateResourceUvwr',
    desc: '修改资源免审更新版本号设置'
  },
  {
    product: '管理后台',
    name: 'admin_deleteResource',
    desc: '删除资源'
  },
  {
    product: '管理后台',
    name: 'admin_getProcessingReviewResource',
    desc: '获取待审资源'
  },
  {
    product: '管理后台',
    name: 'admin_getProcessingReviewResourceCount',
    desc: '获取待审资源总数'
  },
  {
    product: '管理后台',
    name: 'admin_updateResourceReviewResult',
    desc: '修改资源审核版本审核结果'
  },
  {
    product: '管理后台',
    name: 'admin_reReviewResource',
    desc: '重新审核资源'
  },
  {
    product: '管理后台',
    name: 'admin_getSslUserCount',
    desc: '获取 SSL 证书用户总数'
  },
  {
    product: '管理后台',
    name: 'admin_getSslUserList',
    desc: '获取 SSL 证书用户列表'
  },
  {
    product: '管理后台',
    name: 'admin_searchSslUser',
    desc: '搜索单个 SSL 证书用户'
  },
  {
    product: '管理后台',
    name: 'admin_newSslLimitChange',
    desc: '新增 SSL 证书额度变更'
  },
  {
    product: '管理后台',
    name: 'admin_getSslLimitChangeCount',
    desc: '获取 SSL 证书额度变更总数'
  },
  {
    product: '管理后台',
    name: 'admin_getSslLimitChangeList',
    desc: '获取 SSL 证书额度变更列表'
  },
  {
    product: '管理后台',
    name: 'admin_getPasswordUserCount',
    desc: '获取密码智能备忘录用户总数'
  },
  {
    product: '管理后台',
    name: 'admin_getPasswordUserList',
    desc: '获取密码智能备忘录用户列表'
  },
  {
    product: '管理后台',
    name: 'admin_searchPasswordUser',
    desc: '搜索单个密码智能备忘录用户'
  },
  {
    product: '资源',
    name: 'resource_getRandomResourceList',
    desc: '随机获取资源列表'
  },
  {
    product: '资源',
    name: 'resource_newAddResource',
    desc: '添加资源到我的资源'
  },
  {
    product: '资源',
    name: 'resource_getAddResourceCount',
    desc: '获取我的资源总数'
  },
  {
    product: '资源',
    name: 'resource_getAddResourceList',
    desc: '获取我的资源列表'
  },
  {
    product: '资源',
    name: 'resource_updateAddResource',
    desc: '修改我的资源'
  },
  {
    product: '资源',
    name: 'resource_syncAddResourceInfo',
    desc: '同步我的资源信息'
  },
  {
    product: '资源',
    name: 'resource_deleteAddResource',
    desc: '删除我的资源'
  },
  {
    product: '资源',
    name: 'resource_checkResource',
    desc: '检查资源是否添加、有权修改'
  },
  {
    product: '资源',
    name: 'resource_updateUserSetting',
    desc: '修改用户功能设置'
  },
  {
    product: '资源投稿',
    name: 'resourcecreator_aiGenerateResourceInfo',
    desc: 'AI 生成资源简介、标签'
  },
  {
    product: '资源投稿',
    name: 'resourcecreator_newResource',
    desc: '新增资源'
  },
  {
    product: '资源投稿',
    name: 'resourcecreator_getResourceCount',
    desc: '获取资源总数'
  },
  {
    product: '资源投稿',
    name: 'resourcecreator_getResourceList',
    desc: '获取资源列表'
  },
  {
    product: '资源投稿',
    name: 'resourcecreator_getResourceInfo',
    desc: '获取资源信息'
  },
  {
    product: '资源投稿',
    name: 'resourcecreator_updateResourceVersion',
    desc: '更新资源版本号'
  },
  {
    product: '资源投稿',
    name: 'resourcecreator_submitReviewResource',
    desc: '提交资源审核'
  },
  {
    product: '资源投稿',
    name: 'resourcecreator_unsubmitReviewResource',
    desc: '撤回资源审核'
  },
  {
    product: '资源投稿',
    name: 'resourcecreator_updateReviewResource',
    desc: '修改资源审核版本信息'
  },
  {
    product: '资源投稿',
    name: 'resourcecreator_deleteResource',
    desc: '删除资源'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_getLimitChangeCount',
    desc: '获取额度变更总数'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_getLimitChangeList',
    desc: '获取额度变更列表'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_getAcmeAccountInfo',
    desc: '获取 ACME 账户信息'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_deactivateAcmeAccount',
    desc: '停用 ACME 账户'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_newAcmeAccount',
    desc: '创建 ACME 账户'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_newOrder',
    desc: '新增订单'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_getOrderCount',
    desc: '获取订单总数'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_getOrderList',
    desc: '获取订单列表'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_getOrderInfo',
    desc: '获取订单信息'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_getOrderAuthorization',
    desc: '获取订单授权'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_refreshOrder',
    desc: '刷新订单'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_submitOrder',
    desc: '提交订单'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_updateOrder',
    desc: '修改订单'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_deleteOrder',
    desc: '删除订单'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_deleteUselessStatusOrder',
    desc: '清理无用状态订单'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_deactivateAuthorization',
    desc: '停用授权'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_respondChallenge',
    desc: '提交挑战验证'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_deleteOrderPrivateKey',
    desc: '删除订单私钥'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_revokeCertificate',
    desc: '吊销证书'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_getDnsTaskCount',
    desc: '获取 DNS 自动配置任务总数'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_getDnsTaskList',
    desc: '获取 DNS 自动配置任务列表'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_endDnsTask',
    desc: '结束 DNS 自动配置任务'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_deleteDnsTask',
    desc: '删除 DNS 自动配置任务'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_deleteEndStatusDnsTask',
    desc: '清理结束状态 DNS 自动配置任务'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_newTemplate',
    desc: '新增模板'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_getTemplateList',
    desc: '获取模板列表'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_getTemplateInfo',
    desc: '获取模板信息'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_updateTemplate',
    desc: '修改模板'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_deleteTemplate',
    desc: '删除模板'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_updateUserSetting',
    desc: '修改用户功能设置'
  },
  {
    product: 'SSL 证书',
    name: 'ssl_updateUserDns',
    desc: '修改用户 DNS 设置'
  },
  {
    product: '密码智能备忘录',
    name: 'password_setBackup',
    desc: '设置备份'
  },
  {
    product: '密码智能备忘录',
    name: 'password_getBackupCount',
    desc: '获取备份总数'
  },
  {
    product: '密码智能备忘录',
    name: 'password_getBackupList',
    desc: '获取备份列表'
  },
  {
    product: '密码智能备忘录',
    name: 'password_deleteBackup',
    desc: '删除备份'
  },
  {
    product: '密码智能备忘录',
    name: 'password_clearBackup',
    desc: '清空备份'
  }
])
const filter = ref({
  multi: true,
  enumable: true
})
const selectconfig = {
  checkField: 'selected'
}
function formatEnddate(t) {
  const enddate = t.cellValue
  if (enddate == 0) {
    return '永久'
  }
  return time(enddate)
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
  accesskeyallowapi = []
  ip.value = ''
  accesskeyallowip.value = []
  accesskeystatus.value = false
}
function chooseApi(t) {
  accesskeyallowapi = t.selection.map(item => item.name)
}
function add() {
  if (!ip.value) {
    TinyModal.message({
      message: '请输入 CIDR 表达式',
      status: 'warning'
    })
    return
  }
  accesskeyallowip.value.push(ip.value)
  ip.value = ''
}
function remove(index) {
  accesskeyallowip.value.splice(index, 1)
}
async function newAccessKey() {
  if (!accesskeyname.value) {
    TinyModal.message({
      message: '请输入备注',
      status: 'warning'
    })
    return
  }
  if (!accesskeyenddate.value && !accesskeyforever.value) {
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
      allowApi: accesskeyallowapi,
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
  accesskeyallowapi = row.allowApi
  apis.value = apis.value.map(item => ({
    ...item,
    selected: row.allowApi.includes(item.name)
  }))
  accesskeyallowip.value = [...row.allowIp]
}
function updateAccessKeyClose() {
  updateaccesskeydialog.value = false
  accesskeyindex = 0
  accesskeyname.value = ''
  accesskeyenddate.value = ''
  accesskeyforever.value = false
  accesskeyallowapi = []
  ip.value = ''
  accesskeyallowip.value = []
}
async function updateAccessKey() {
  if (!accesskeyname.value) {
    TinyModal.message({
      message: '请输入备注',
      status: 'warning'
    })
    return
  }
  if (!accesskeyenddate.value && !accesskeyforever.value) {
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
      allowApi: accesskeyallowapi,
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
        description="accessKey 是调用 API 的凭证，请勿泄露给他人，防止账号被他人非法使用。为了保证账号安全，建议仅开启必要 API 的权限、设置合理的到期时间和 IP 白名单、及时禁用或删除不再使用的 accessKey。"></tiny-alert>
      <div v-if="accesskeys.length < 10"><tiny-button type="success" @click="newAccessKeyOpen">新增</tiny-button></div>
      <tiny-grid :data="accesskeys">
        <tiny-grid-column type="index" title="序号" align="center"></tiny-grid-column>
        <tiny-grid-column field="name" title="备注" align="center"></tiny-grid-column>
        <tiny-grid-column field="endDate" title="到期时间" align="center" :format-text="formatEnddate"
          sortable></tiny-grid-column>
        <tiny-grid-column field="allowApi" title="API 白名单" align="center" show-overflow></tiny-grid-column>
        <tiny-grid-column field="allowIp" title="IP 白名单" align="center" show-overflow></tiny-grid-column>
        <tiny-grid-column field="status" title="是否启用" align="center" format-text="boole"></tiny-grid-column>
        <tiny-grid-column field="lastUsedDate" title="最近使用时间" align="center" format-text="longDateTime"
          sortable></tiny-grid-column>
        <tiny-grid-column title="操作" align="center">
          <template #default="{ row, $rowIndex }">
            <div class="czsp">
              <tiny-button v-if="row.status == false" type="success"
                @click="updateAccessKeyStatus($rowIndex, '启用')">启用</tiny-button>
              <tiny-button v-if="row.status == true" type="danger"
                @click="updateAccessKeyStatus($rowIndex, '禁用')">禁用</tiny-button>
              <tiny-button type="info" @click="updateAccessKeyOpen(row, $rowIndex)">编辑</tiny-button>
              <tiny-popconfirm title="提示" message="删除成功后无法恢复，确定删除？" type="warning" trigger="hover"
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
        <tiny-input v-model="accesskeyname" clearable show-word-limit minlength="1" maxlength="10"
          placeholder="请输入备注"></tiny-input>
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
          <tiny-button type="success" @click="add">添加</tiny-button>
        </div>
        <div v-for="(item, index) in accesskeyallowip" class="sp">
          <tiny-tag type="info">{{ item }}</tiny-tag>
          <tiny-button type="danger" @click="remove(index)">删除</tiny-button>
        </div>
        <div class="sp">
          <div>启用</div>
          <tiny-switch v-model="accesskeystatus"></tiny-switch>
        </div>
      </div>
      <template #footer>
        <tiny-button type="success" @click="newAccessKey">新增</tiny-button>
      </template>
    </tiny-dialog-box>
    <tiny-dialog-box class="dialog" :visible="updateaccesskeydialog" title="编辑 accessKey" @close="updateAccessKeyClose">
      <div class="dialog-cz">
        <tiny-input v-model="accesskeyname" clearable show-word-limit minlength="1" maxlength="10"
          placeholder="请输入备注"></tiny-input>
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
          <tiny-button type="success" @click="add">添加</tiny-button>
        </div>
        <div v-for="(item, index) in accesskeyallowip" class="sp">
          <tiny-tag type="info">{{ item }}</tiny-tag>
          <tiny-button type="danger" @click="remove(index)">删除</tiny-button>
        </div>
      </div>
      <template #footer>
        <tiny-button type="info" @click="updateAccessKey">保存</tiny-button>
      </template>
    </tiny-dialog-box>
  </div>
</template>