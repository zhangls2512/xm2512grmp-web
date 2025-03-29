<script setup>
import { ref } from 'vue'
import request from '../../request'
const data = ref([])
const keyword = ref('')
const type = ref('grid')
const count = ref('12')
const showdesc = ref(false)
async function get() {
  const res = await request({
    apiPath: '/resource/getRandomResourceList',
    body: {
      limit: Number(count.value)
    }
  })
  TinyModal.message({
    message: '获取数据成功',
    status: 'success'
  })
  data.value = res.data
}
get()
function search() {
  window.open('/product/resource/search?keyword=' + keyword.value, '_blank')
}
function info(id) {
  window.open('/product/resource/info?id=' + id, '_blank')
}
</script>

<template>
  <div class="main">
    <div class="cz">
      <div class="top">
        <tiny-search v-model="keyword" clearable placeholder="搜索" @search="search"></tiny-search>
        <router-link to="/product/resource/panel" target="_blank">
          <tiny-button type="info">个人中心</tiny-button>
        </router-link>
      </div>
      <div class="sp">
        <tiny-button type="info" @click="get">刷新</tiny-button>
        <tiny-divider direction="vertical"></tiny-divider>
        <div>布局</div>
        <tiny-radio-group v-model="type">
          <tiny-radio label="grid">宫格</tiny-radio>
          <tiny-radio label="list">列表</tiny-radio>
        </tiny-radio-group>
        <tiny-divider direction="vertical"></tiny-divider>
        <div>个数</div>
        <tiny-radio-group v-model="count">
          <tiny-radio label="8">8</tiny-radio>
          <tiny-radio label="12">12</tiny-radio>
          <tiny-radio label="16">16</tiny-radio>
          <tiny-radio label="20">20</tiny-radio>
        </tiny-radio-group>
        <tiny-divider direction="vertical"></tiny-divider>
        <div>显示简介</div>
        <tiny-switch v-model="showdesc"></tiny-switch>
      </div>
      <div v-if="data.length == 0" class="large-bold-text" style="text-align: center">无数据</div>
      <div v-if="type == 'grid'" class="grid">
        <div v-for="item in data" class="kuang" style="cursor: pointer" @click="info(item._id)">
          <div class="cz">
            <div class="bold-text">{{ item.name }}</div>
            <div v-if="item.desc != '' && showdesc == true">{{ item.desc }}</div>
            <div class="sp">
              <tiny-tag v-for="item in item.tag" :type="item.type">{{ item.value }}</tiny-tag>
            </div>
          </div>
        </div>
      </div>
      <div v-for="item in data" v-if="type == 'list'" class="cz" style="cursor: pointer" @click="info(item._id)">
        <tiny-divider></tiny-divider>
        <div class="bold-text">{{ item.name }}</div>
        <div v-if="item.desc != '' && showdesc == true">{{ item.desc }}</div>
        <div class="sp">
          <tiny-tag v-for="item in item.tag" :type="item.type">{{ item.value }}</tiny-tag>
        </div>
      </div>
      <tiny-divider v-if="type == 'list'"></tiny-divider>
    </div>
  </div>
</template>

<style scoped>
.top {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  width: 100%;
}

.grid {
  grid-template-columns: repeat(4, 1fr);
  overflow: auto;
  width: 100%;
}
</style>