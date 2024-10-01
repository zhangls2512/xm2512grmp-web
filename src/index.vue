<template>
  <div class="container">
    <div class="header">
      <el-avatar class="avatar" src="/logo.jpg" />
      <span class="title">轩铭2512个人名片</span>
    </div>
    <div class="main">
      <el-space size="default" direction="vertical" alignment="normal" wrap>
        <el-space size="large">
          <el-image class="main-image" src="/tx.jpg" />
          <el-space size="default" direction="vertical" alignment="normal" wrap>
            <div class="main-texta">张轩铭</div>
            <div class="main-text">男 20岁 巨蟹座</div>
            <div class="main-text">黑龙江省大庆市</div>
          </el-space>
        </el-space>
      </el-space>
      <div class="main-title">个人简介</div>
      <div class="main-content">张轩铭出生于2004年7月17日，是一个人。</div>
      <div class="main-title">技能证书</div>
      <el-space size="default" direction="vertical" alignment="normal" wrap>
        <el-space size="large">
          <el-image class="zs-image" src="/zsa.jpeg" />
          <el-space size="default" direction="vertical" alignment="normal" wrap>
            <div class="main-texta">工业和信息化人才岗位能力认证证书</div>
            <div class="main-text">证书编号：GXRCPJ011202413996</div>
          </el-space>
        </el-space>
        <el-space size="large">
          <el-image class="zs-image" src="/zsc.jpg" />
          <el-space size="default" direction="vertical" alignment="normal" wrap>
            <div class="main-texta">蓝桥杯大赛获奖证书</div>
            <div class="main-text">证书编号：011504114</div>
          </el-space>
        </el-space>
        <el-space size="large">
          <el-image class="zs-image" src="/zsb.png" />
          <el-space size="default" direction="vertical" alignment="normal" wrap>
            <div class="main-texta">华为开发者学堂专业证书——HarmonyOS应用开发者基础认证</div>
            <div class="main-text">证书编号：TCNdb723c1</div>
          </el-space>
        </el-space>
        <el-space size="large">
          <el-image class="zs-image" src="/mchdrjzzq.png" />
          <el-space size="default" direction="vertical" alignment="normal" wrap>
            <div class="main-texta">MC活动软件——计算机软件著作权转让合同登记证书</div>
            <div class="main-text">证书编号：软转登字第0006144号</div>
          </el-space>
        </el-space>
      </el-space>
      <div class="main-title">就读学校</div>
      <div class="main-content">小学：大庆龙岗小学（1-4年级）、大庆一中附属机关小学（5年级）</div>
      <div class="main-content">初中：大庆第一中学初中部</div>
      <div class="main-content">高中：大庆第一中学高中部</div>
      <div class="main-content">大学（在读）：哈尔滨工程大学</div>
      <div class="main-title">任职单位</div>
      <div class="main-content">大庆市铭懿博科技有限公司：法定代表人</div>
      <div class="main-title">开发项目</div>
      <el-space size="default" direction="vertical" alignment="normal" wrap>
        <el-space size="large">
          <el-image class="cp-image" src="/grxqbwl.jpg" />
          <el-space size="default" direction="vertical" alignment="normal" wrap>
            <div class="main-texta">个人需求备忘录（微信小程序）</div>
            <div class="main-text">简介：随时随地记录个人需求，简单、方便、快捷。</div>
          </el-space>
        </el-space>
      </el-space>
      <div class="main-title">联系方式</div>
      <div class="main-content">微信号：gerenyinsi_z07x17m</div>
      <div class="main-content">QQ号：2300990296</div>
      <div class="main-content">邮箱：2300990296@qq.com</div>
    </div>

    <div class="footer">
      <el-space class="footer-wz" size="default" direction="vertical" alignment="normal" wrap>
        <div>
          <el-space size="default">
            <el-popover width="258">
              <template #reference>
                <el-image class="img" src="/gzh.svg"></el-image>
              </template>
              <el-image src="/wxmpqrcode.jpg" />
            </el-popover>
            <el-popover width="258">
              <template #reference>
                <el-image class="img" src="/sph.svg"></el-image>
              </template>
              <el-image src="/wxsphqrcode.jpg" />
            </el-popover>
            <el-popover width="258">
              <template #reference>
                <el-image class="img" src="/xcx.svg"></el-image>
              </template>
              <el-image src="/mpxcx.jpg" />
            </el-popover>
            <a href="https://space.bilibili.com/448824492" target="_blank"><el-image class="img"
                src="/bili.svg"></el-image></a>
            <a href="https://gitcode.com/zhangls2512" target="_blank"><el-image class="img"
                src="/gitcode.png"></el-image></a>
          </el-space>
        </div>
        <div>
          <el-text class="footer-text">Copyright © 2024 ZhangXuanming. All Rights Reserved. 张轩铭 版权所有</el-text>
        </div>
        <div>
          <el-space size="default">
            <el-link class="footer-text" href="https://beian.miit.gov.cn/#/Integrated/recordQuery"
              target="_blank">黑ICP备2024023054号-3</el-link>
            <el-avatar class="footer-image" src="/gabeian.png" />
            <el-link class="footer-text" href="https://beian.mps.gov.cn/#/query/webSearch?code=23060002000214"
              target="_blank">黑公网安备23060002000214号</el-link>
          </el-space>
        </div>
        <div>
          <el-space size="default">
            <el-link class="footer-text" href="https://www.dqmybkj.com/#/jqcx?id=铭懿博品备5W号"
              target="_blank">产品备案号：铭懿博品备5W号</el-link>
            <el-text class="footer-text">Version 1.0.3</el-text>
            <el-link class="footer-text" href="https://www.dqmybkj.com/#/jqcx?id=铭懿博版备5W号-4Z"
              target="_blank">发布版本备案号：铭懿博版备5W号-4Z</el-link>
            <el-link class="footer-text" href="https://www.dqmybkj.com/#/gxrzxm2512grmpwz"
              target="_blank">更新日志</el-link>
            <el-link class="footer-text" href="https://gitcode.com/zhangls2512/xm2512-grmpweb"
              target="_blank">Gitcode上查看该项目</el-link>
          </el-space>
        </div>
      </el-space>
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.header,
.footer {
  display: flex;
}

.header,
.main,
.footer {
  height: auto;
  padding: 20px 5% 20px 5%;
}

.header {
  align-items: center;
  background-color: #409EFF;
}

.main-title {
  font-weight: bold;
  font-size: 30px;
  margin: 20px 0 20px 0;
}

.main-content {
  font-size: 20px;
  margin: 10px 0 10px 0;
  line-height: 2;
}

.main-text,
.main-texta {
  font-size: 20px;
  line-height: 1.5;
}

.main-texta {
  font-weight: bold;
}

.main-image {
  width: 200px;
  height: 282px;
}

.cp-image {
  width: 200px;
  height: 200px;
}

.zs-image {
  width: 200px;
  height: auto;
}

.footer {
  background-color: #f6f7f8;
  margin-top: auto;
}

.title {
  color: white;
  font-size: 40px;
  font-weight: bold;
}

.avatar {
  margin: 10px;
}

.footer-wz {
  width: 100%;
}

.footer-text {
  color: #9499a0;
}

.footer-image {
  width: 20px;
  height: 20px;
}

.img {
  width: 60px;
  height: 60px;
}
</style>