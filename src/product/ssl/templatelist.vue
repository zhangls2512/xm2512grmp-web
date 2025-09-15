<script setup>
document.title = '轩铭2512 - SSL 证书 - 模板管理'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const template = ref([])
async function get() {
  const res = await request({
    apiPath: '/ssl/getTemplateList',
    body: {
      accessToken: accesstoken
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  template.value = res.data
}
get()
function newTemplate() {
  router.push('/product/ssl/newtemplate')
}
function updateTemplate(id) {
  router.push('/product/ssl/updatetemplate?id=' + id)
}
async function deleteTemplate(id) {
  await request({
    apiPath: '/ssl/deleteTemplate',
    body: {
      accessToken: accesstoken,
      id: id
    }
  })
  TinyModal.message({
    message: '删除成功',
    status: 'success'
  })
  get()
}
</script>

<template>
  <div class="cz">
    <tiny-alert :closable="false" description="可将常用域名、IP 地址组合存为模板，新增订单时可快速填入。目前支持保存最多 10 个。"></tiny-alert>
    <div><tiny-button type="success" @click="newTemplate">新增</tiny-button></div>
    <tiny-grid :data="template">
      <tiny-grid-column field="domains" title="域名、IP 地址" align="center" show-overflow></tiny-grid-column>
      <tiny-grid-column field="desc" title="备注" align="center"></tiny-grid-column>
      <tiny-grid-column field="updateDate" title="更新时间" align="center" format-text="longDateTime"></tiny-grid-column>
      <tiny-grid-column title="操作" align="center">
        <template #default="{ row }">
          <div class="czsp">
            <tiny-button type="info" @click="updateTemplate(row._id)">修改</tiny-button>
            <tiny-popconfirm title="提示" message="删除成功后无法恢复，确定删除？" type="warning" trigger="hover"
              @confirm="deleteTemplate(row._id)">
              <template #reference>
                <tiny-button type="danger">删除</tiny-button>
              </template>
            </tiny-popconfirm>
          </div>
        </template>
      </tiny-grid-column>
    </tiny-grid>
  </div>
</template>