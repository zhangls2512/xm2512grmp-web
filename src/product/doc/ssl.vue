<script setup>
document.title = '轩铭2512 - 文档中心 - SSL 证书'
import { ref } from 'vue'
const link = ref('')
async function getLink() {
  const res = await fetch('https://acme-v02.api.letsencrypt.org/directory')
  const data = await res.json()
  link.value = data.meta.termsOfService
}
getLink()
</script>

<template>
  <div class="cz">
    <a href="https://docs.qq.com/doc/p/6287feb77c28f5078efddbf89fcb32c688440a62" target="_blank">使用常见问题</a>
    <a href="https://docs.qq.com/doc/p/5230c73197bb2e4fd53c88ba22fe3f2ed8210c06" target="_blank">额度常见问题</a>
    <a :href="link" target="_blank">Let's Encrypt 订阅者协议</a>
  </div>
</template>