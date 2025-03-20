<script setup>
import { ref } from 'vue'
import request from '../../request'
const data = ref([])
const keyword = ref('')
const type = ref('grid')
const count = ref('12')
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
  data.value = res.data.map(item => ({
    ...item,
    ashortDesc: item.desc.slice(0, 25),
    bshortDesc: item.desc.slice(0, 50)
  }))
}
get()
function search() {
  window.open('/product/resource/search?keyword=' + keyword.value, '_blank')
}
function info(id) {
  window.open('/product/resource/resourceinfo?id=' + id, '_blank')
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
      </div>
      <div v-if="data.length == 0" class="large-bold-text" style="text-align: center">暂无数据</div>
      <div v-if="type == 'grid'" class="grid">
        <div v-for="item in data" class="kuang" style="cursor: pointer" @click="info(item._id)">
          <div class="cz">
            <div class="bold-text">{{ item.name }}</div>
            <div>{{ item.ashortDesc }}</div>
            <div class="sp">
              <tiny-tag v-for="item in item.tag" :type="item.type">{{ item.value }}</tiny-tag>
            </div>
          </div>
        </div>
      </div>
      <div v-for="item in data" v-if="type == 'list'" class="cz" style="cursor: pointer" @click="info(item._id)">
        <tiny-divider></tiny-divider>
        <div class="bold-text">{{ item.name }}</div>
        <div>{{ item.bshortDesc }}</div>
        <div class="sp">
          <tiny-tag v-for="item in item.tag" :type="item.type">{{ item.value }}</tiny-tag>
        </div>
      </div>
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
  width: 100%;
}
</style>