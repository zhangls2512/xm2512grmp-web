<script setup>
document.title = '轩铭2512 - 管理后台 - 新增备案许可'
import { ref } from 'vue'
import cookie from 'js-cookie'
import request from '../../request'
import router from '../../router'
const accesstoken = cookie.get('accessToken')
const products = ref([])
const maintype = ref('')
const desc = ref('')
const productnumber = ref('')
const productname = ref('')
const specifictype = ref('')
const maintypes = ref([
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
const specifictypes = ref([])
function change(t) {
  if (t == '0') {
    specifictype.value = ''
    specifictypes.value = [
      {
        value: '0',
        label: '成人信息服务'
      },
      {
        value: '1',
        label: '敏感信息收集处理服务'
      }
    ]
  }
  if (t == '1') {
    specifictype.value = ''
    specifictypes.value = [
      {
        value: '0',
        label: '网页'
      },
      {
        value: '1',
        label: '微信小程序'
      },
      {
        value: '2',
        label: '鸿蒙原生应用'
      },
      {
        value: '3',
        label: '鸿蒙元服务'
      }
    ]
  }
  if (t == '2') {
    specifictype.value = ''
    specifictypes.value = [
      {
        value: '0',
        label: '适老化'
      },
      {
        value: '1',
        label: '未成年'
      },
      {
        value: '2',
        label: '无障碍'
      },
      {
        value: '3',
        label: '大小屏'
      },
      {
        value: '4',
        label: '特殊网络环境'
      },
      {
        value: '5',
        label: '深色模式'
      },
      {
        value: '6',
        label: '多语言'
      }
    ]
  }
  if (t == '3') {
    specifictype.value = ''
    specifictypes.value = []
  }
  if (t == '4') {
    specifictype.value = ''
    specifictypes.value = [
      {
        value: '0',
        label: '个性化推送类'
      },
      {
        value: '1',
        label: '排序精选类'
      },
      {
        value: '2',
        label: '检索过滤类'
      },
      {
        value: '3',
        label: '调度决策类'
      },
      {
        value: '4',
        label: '生成合成类'
      }
    ]
  }
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
}
getProducts()
async function newBaxk() {
  if (maintype.value === '') {
    TinyModal.message({
      message: '请选择类型',
      status: 'warning'
    })
    return
  }
  if (desc.value === '') {
    TinyModal.message({
      message: '请输入描述',
      status: 'warning'
    })
    return
  }
  if (maintype.value != '1' && productnumber.value === '') {
    TinyModal.message({
      message: '请选择产品',
      status: 'warning'
    })
    return
  }
  if (maintype.value == '1' && productname.value === '') {
    TinyModal.message({
      message: '请输入产品名称',
      status: 'warning'
    })
    return
  }
  if (maintype.value != '3' && specifictype.value === '') {
    TinyModal.message({
      message: '请选择具体类型',
      status: 'warning'
    })
    return
  }
  await request({
    apiPath: '/admin/newBaxk',
    body: {
      accessToken: accesstoken,
      mainType: maintype.value,
      desc: desc.value,
      productNumber: productnumber.value,
      productName: productname.value,
      specificType: specifictype.value
    }
  })
  TinyModal.message({
    message: '新增成功',
    status: 'success'
  })
  router.push('/product/admin/baxklist')
}
</script>

<template>
  <div class="cz">
    <tiny-breadcrumb>
      <tiny-breadcrumb-item :to="{ path: '/product/admin/baxklist' }" label="备案许可管理"></tiny-breadcrumb-item>
      <tiny-breadcrumb-item :to="{ path: '/product/admin/newbaxk' }" label="新增备案许可"></tiny-breadcrumb-item>
    </tiny-breadcrumb>
    <tiny-form>
      <tiny-form-item label="类型">
        <tiny-base-select v-model="maintype" @change="change">
          <tiny-option v-for="item in maintypes" :label="item.label" :value="item.value"></tiny-option>
        </tiny-base-select>
      </tiny-form-item>
      <tiny-form-item v-if="maintype != '1'" label="产品">
        <tiny-base-select v-model="productnumber">
          <tiny-option v-for="item in products" :label="item.label" :value="item.value"></tiny-option>
        </tiny-base-select>
      </tiny-form-item>
      <tiny-form-item v-if="maintype == '1'" label="产品名称">
        <tiny-input v-model="productname" clearable placeholder="请输入产品名称"></tiny-input>
      </tiny-form-item>
      <tiny-form-item v-if="maintype != '3' && maintype != '1'" label="具体类型">
        <tiny-base-select v-model="specifictype">
          <tiny-option v-for="item in specifictypes" :label="item.label" :value="item.value"></tiny-option>
        </tiny-base-select>
      </tiny-form-item>
      <tiny-form-item v-if="maintype == '1'" label="运行平台">
        <tiny-base-select v-model="specifictype">
          <tiny-option v-for="item in specifictypes" :label="item.label" :value="item.value"></tiny-option>
        </tiny-base-select>
      </tiny-form-item>
      <tiny-form-item label="描述">
        <tiny-input v-model="desc" type="textarea" autosize placeholder="请输入描述"></tiny-input>
      </tiny-form-item>
      <tiny-form-item>
        <tiny-button type="success" @click="newBaxk">新增</tiny-button>
      </tiny-form-item>
    </tiny-form>
  </div>
</template>