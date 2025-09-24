<script setup>
document.title = '轩铭2512 - 统一账号'
const endyear = new Date().getFullYear()
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="sp">
        <img class="tx" src="/logo.jpg" loading="lazy"></img>
        <div class="header-title">统一账号</div>
      </div>
    </div>
    <router-view class="empty"></router-view>
    <div class="footer">
      <div class="cz">
        <div class="sp">
          <a class="footer-text" href="tel:18846496985">联系手机：18846496985</a>
          <tiny-divider direction="vertical"></tiny-divider>
          <a class="footer-text" href="mailto:2300990296@qq.com">联系邮箱：2300990296@qq.com</a>
          <tiny-divider direction="vertical"></tiny-divider>
          <div class="footer-text">联系微信：gerenyinsi_z07x17m</div>
        </div>
        <div class="footer-text">Copyright © {{ endyear }} Zhang Xuanming. All Rights Reserved. 张轩铭 版权所有</div>
        <div class="sp">
          <a class="footer-text" href="/product/baxk/jqcx?baxknumber=轩铭2512品备2号-W" target="_blank">轩铭2512品备2号-W</a>
          <tiny-divider direction="vertical"></tiny-divider>
          <div class="footer-text">敏感信息收集处理服务许可号：<a href="/product/baxk/jqcx?baxknumber=轩铭2512许2号-1M"
              target="_blank">轩铭2512许2号-1M</a></div>
          <tiny-divider direction="vertical"></tiny-divider>
          <div class="footer-text">Version 1.0.11</div>
          <tiny-divider direction="vertical"></tiny-divider>
          <router-link class="footer-text" to="/product/updatelog/account" target="_blank">更新日志</router-link>
        </div>
      </div>
    </div>
  </div>
</template>