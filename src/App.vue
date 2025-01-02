<script setup>
import { ref } from 'vue'
const endyear = ref('')
const age = ref(0)
endyear.value = new Date().getFullYear()
const outputage = () => {
  let today = new Date()
  let birthDate = new Date('2004-07-17')
  let age = today.getFullYear() - birthDate.getFullYear()
  let monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}
age.value = outputage()
</script>

<template>
  <div class="header">
    <div class="sp">
      <img class="tx" src="/logo.jpg" loading="lazy" />
      <div class="header-title">轩铭2512个人名片</div>
    </div>
  </div>
  <div class="main">
    <div class="cz">
      <div class="sp">
        <img class="tp" src="/tx.jpg" loading="lazy" />
        <div class="cz">
          <div class="large-bold-text">张轩铭</div>
          <div class="large-text">男 {{ age }}岁 巨蟹座</div>
          <div class="large-text">黑龙江省大庆市</div>
        </div>
      </div>
      <div class="title">个人简介</div>
      <div class="large-text">
        我是一名软件开发工程师，专注于网页、鸿蒙原生应用、鸿蒙元服务与微信小程序的开发。
      </div>
      <div class="title">技能证书</div>
      <div class="sp">
        <img class="tp" src="/zsa.jpeg" loading="lazy" />
        <div class="cz">
          <div class="large-bold-text">工业和信息化人才岗位能力认证证书</div>
          <div class="large-text">证书编号：GXRCPJ011202413996</div>
        </div>
      </div>
      <div class="sp">
        <img class="tp" src="/zsc.jpg" loading="lazy" />
        <div class="cz">
          <div class="large-bold-text">蓝桥杯大赛获奖证书</div>
          <div class="large-text">证书编号：011504114</div>
        </div>
      </div>
      <div class="sp">
        <img class="tp" src="/zsb.png" loading="lazy" />
        <div class="cz">
          <div class="large-bold-text">华为开发者学堂专业证书——HarmonyOS应用开发者基础认证</div>
          <div class="large-text">证书编号：TCNdb723c1</div>
        </div>
      </div>
      <div class="sp">
        <img class="tp" src="/mchdrjzzq.png" loading="lazy" />
        <div class="cz">
          <div class="large-bold-text">MC活动软件——计算机软件著作权转让合同登记证书</div>
          <div class="large-text">证书编号：软转登字第0006144号</div>
        </div>
      </div>
      <div class="sp">
        <img class="tp" src="/grxqbwlrjzzq.png" loading="lazy" />
        <div class="cz">
          <div class="large-bold-text">个人需求备忘录软件——计算机软件著作权登记证书</div>
          <div class="large-text">证书编号：软著登字第14161102号</div>
        </div>
      </div>
      <div class="title">教育经历</div>
      <div class="large-text">小学：大庆龙岗小学（1-4年级）、大庆一中附属机关小学（5年级）</div>
      <div class="large-text">初中：大庆第一中学初中部</div>
      <div class="large-text">高中：大庆第一中学高中部</div>
      <div class="large-text">大学（在读）：哈尔滨工程大学</div>
      <div class="title">联系方式</div>
      <div class="large-text">微信号：gerenyinsi_z07x17m</div>
      <div class="large-text">QQ号：2300990296</div>
    </div>
  </div>
  <div class="footer">
    <div class="cz">
      <div class="sp">
        <tiny-popover trigger="hover" width="237">
          <template #reference>
            <img class="media-image" src="/gzh.svg" loading="lazy" />
          </template>
          <img class="tp" src="/wxmpqrcode.jpg" />
        </tiny-popover>
        <tiny-popover trigger="hover" width="237">
          <template #reference>
            <img class="media-image" src="/sph.svg" loading="lazy" />
          </template>
          <img class="tp" src="/wxsphqrcode.jpg" />
        </tiny-popover>
        <tiny-popover trigger="hover" width="237">
          <template #reference>
            <img class="media-image" src="/mpxcx.svg" loading="lazy" />
          </template>
          <img class="tp" src="/mpxcx.jpg" />
        </tiny-popover>
        <a href="https://space.bilibili.com/448824492" target="_blank"><img class="media-image"
            src="/bili.svg"></img></a>
        <a href="https://gitcode.com/zhangls2512" target="_blank"><img class="media-image" src="/gitcode.png"></img></a>
      </div>
      <div class="sp">
        <a class="footer-text" href="tel:18846496985">联系手机：18846496985</a>
        <tiny-divider direction="vertical"></tiny-divider>
        <a class="footer-text" href="mailto:2300990296@qq.com">联系邮箱：2300990296@qq.com</a>
      </div>
      <div class="sp">
        <a class="footer-text" href="https://beian.miit.gov.cn/#/Integrated/recordQuery"
          target="_blank">黑ICP备2024023054号-8</a>
        <tiny-divider direction="vertical"></tiny-divider>
        <img class="logo" src="/gabeian.png" loading="lazy" />
        <a class="footer-text" href="https://beian.mps.gov.cn/#/query/webSearch?code=23060002000214"
          target="_blank">黑公网安备23060002000214号</a>
      </div>
      <div class="sp">
        <div class="footer-text">Copyright © 2024-{{ endyear }} Zhang Xuanming. All Rights Reserved. 张轩铭 版权所有</div>
        <tiny-divider direction="vertical"></tiny-divider>
        <a class="footer-text" href="https://gitcode.com/zhangls2512/xm2512-grmpweb" target="_blank">Gitcode上查看此项目</a>
      </div>
    </div>
  </div>
</template>

<style>
.header,
.main,
.footer {
  padding: 20px 5% 20px 5%;
}

.header {
  background-color: #1476ff;
}

.footer {
  background-color: #fafafa;
}

.sp,
.cz {
  display: flex;
  gap: 10px;
}

.sp {
  align-items: center;
}

.cz {
  flex-direction: column;
}

.large-text,
.large-bold-text {
  font-size: 20px;
}

.large-bold-text,
.title,
.header-title {
  font-weight: bold;
}

.title {
  font-size: 30px;
}

.header-title {
  color: white;
  font-size: 40px;
}

.footer-text {
  color: grey;
}

.tp {
  width: 200px;
}

.logo {
  width: 20px;
}

.tx {
  width: 60px;
}

.media-image {
  width: 60px;
}
</style>