<script setup>
document.title = '轩铭2512'
const endyear = new Date().getFullYear()
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="sp">
        <img class="tx" src="/logo.jpg" loading="lazy" />
        <div class="header-title">轩铭2512</div>
      </div>
    </div>
    <div class="main">
      <div class="cz">
        <div class="title">产品</div>
        <div class="sp" style="align-items: stretch">
          <router-link to="/product/account" target="_blank">
            <div class="kuang">
              <div class="cz">
                <img class="image" src="/logo.jpg" loading="lazy" />
                <div class="large-bold-text">统一账号</div>
              </div>
            </div>
          </router-link>
          <router-link to="/product/admin" target="_blank">
            <div class="kuang">
              <div class="cz">
                <img class="image" src="/logo.jpg" loading="lazy" />
                <div class="large-bold-text">管理后台</div>
              </div>
            </div>
          </router-link>
          <a href="https://appgallery.huawei.com/link/invite-test-wap?taskId=60570bda48933f47d3177bb679a341a3&invitationCode=ABsUTpXFYfD"
            target="_blank">
            <div class="kuang">
              <div class="cz">
                <img class="image" src="/password.png" loading="lazy" />
                <div class="large-bold-text">密码智能备忘录（邀请测试）</div>
              </div>
            </div>
          </a>
        </div>
        <div class="sp" style="align-items: stretch">
          <router-link to="/product/resource" target="_blank">
            <div class="kuang">
              <div class="cz">
                <img class="image" src="/logo.jpg" loading="lazy" />
                <div class="large-bold-text">资源</div>
              </div>
            </div>
          </router-link>
          <router-link to="/product/resourcecreator" target="_blank">
            <div class="kuang">
              <div class="cz">
                <img class="image" src="/logo.jpg" loading="lazy" />
                <div class="large-bold-text">资源投稿</div>
              </div>
            </div>
          </router-link>
          <div class="kuang">
            <div class="cz">
              <img class="image" src="/logossl.png" loading="lazy" />
              <div class="large-bold-text">SSL 证书</div>
              <div class="sp">
                <router-link to="/product/ssl" target="_blank">网页</router-link>
                <router-link to="/qrcodessl.jpg" target="_blank">微信小程序</router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="sp" style="align-items: stretch">
          <router-link to="/qrcodemedia.jpg" target="_blank">
            <div class="kuang">
              <div class="cz">
                <img class="image" src="/logomedia.png" loading="lazy" />
                <div class="large-bold-text">媒体处理</div>
              </div>
            </div>
          </router-link>
          <a href="https://www.npmjs.com/package/nodejs-acmeclient" target="_blank">
            <div class="kuang">
              <div class="cz">
                <img class="image" src="/npm.png" loading="lazy" />
                <div class="large-bold-text">nodejs-acmeclient</div>
              </div>
            </div>
          </a>
          <div class="kuang">
            <div class="cz">
              <img class="image" src="/logo.jpg" loading="lazy" />
              <div class="large-bold-text">个人名片</div>
              <div class="sp">
                <router-link to="/" target="_blank">网页</router-link>
                <tiny-divider direction="vertical"></tiny-divider>
                <router-link to="/qrcodemp.jpg" target="_blank">微信小程序</router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="title">成员</div>
        <div class="sp" style="align-items: stretch">
          <div class="kuang">
            <div class="cz">
              <div class="large-bold-text">张轩铭</div>
              <div>工号：00001</div>
              <div style="text-align: center">设计、研发、测试、宣传、客服</div>
            </div>
          </div>
          <div class="kuang">
            <div class="cz">
              <div class="large-bold-text">宋佳懿</div>
              <div>工号：00007</div>
              <div style="text-align: center">测试</div>
            </div>
          </div>
          <div class="kuang">
            <div class="cz">
              <div class="large-bold-text">朱子轩</div>
              <div>工号：00011</div>
              <div style="text-align: center">测试</div>
            </div>
          </div>
          <div class="kuang">
            <div class="cz">
              <div class="large-bold-text">郭怡航</div>
              <div>工号：00014</div>
              <div style="text-align: center">审核</div>
            </div>
          </div>
        </div>
        <div class="title">媒体</div>
        <div class="sp" style="align-items: stretch">
          <router-link to="/qrcodegzh.jpg" target="_blank">
            <div class="kuang">
              <div class="cz">
                <img class="image" src="/gzh.svg" loading="lazy" />
                <div class="large-bold-text">公众号</div>
              </div>
            </div>
          </router-link>
          <router-link to="/qrcodesph.jpg" target="_blank">
            <div class="kuang">
              <div class="cz">
                <img class="image" src="/sph.svg" loading="lazy" />
                <div class="large-bold-text">视频号</div>
              </div>
            </div>
          </router-link>
          <a href="https://space.bilibili.com/448824492" target="_blank">
            <div class="kuang">
              <div class="cz">
                <img class="image" src="/bili.svg" loading="lazy" />
                <div class="large-bold-text">哔哩哔哩</div>
              </div>
            </div>
          </a>
          <a href="https://www.douyin.com/user/MS4wLjABAAAAOoJXPRRO6wZQXXsV6i_oizMbS0PllfGkXhouXjqIA_M" target="_blank">
            <div class="kuang">
              <div class="cz">
                <img class="image" src="/douyin.png" loading="lazy" />
                <div class="large-bold-text">抖音</div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
    <div class="empty"></div>
    <div class="footer">
      <div class="cz">
        <div class="sp">
          <router-link class="footer-text" to="/product/doc" target="_blank">文档中心</router-link>
          <tiny-divider direction="vertical"></tiny-divider>
          <router-link class="footer-text" to="/product/updatelog" target="_blank">更新日志</router-link>
          <tiny-divider direction="vertical"></tiny-divider>
          <a class="footer-text" href="/product/baxk" target="_blank">备案许可</a>
        </div>
        <div class="sp">
          <a class="footer-text" href="mailto:2300990296@qq.com">联系邮箱：2300990296@qq.com</a>
          <tiny-divider direction="vertical"></tiny-divider>
          <div class="footer-text">联系微信：gerenyinsi_z07x17m</div>
          <tiny-divider direction="vertical"></tiny-divider>
          <a class="footer-text"
            href="https://chatbot.weixin.qq.com/webapp/5e2JglFAERGl06z0FkTK6eWL6D1Oa5?robotName=轩铭2512产品客服"
            target="_blank">在线客服</a>
          <tiny-divider direction="vertical"></tiny-divider>
          <a class="footer-text" href="https://pd.qq.com/s/cnx7f1zdm" target="_blank">腾讯频道</a>
        </div>
        <div class="sp">
          <a class="footer-text" href="https://beian.miit.gov.cn/#/Integrated/recordQuery"
            target="_blank">黑ICP备2024023054号-8</a>
          <tiny-divider direction="vertical"></tiny-divider>
          <img class="logo" src="/gabeian.png" loading="lazy" />
          <a class="footer-text" href="https://beian.mps.gov.cn/#/query/webSearch?code=23060002000214"
            target="_blank">黑公网安备23060002000214号</a>
          <tiny-divider direction="vertical"></tiny-divider>
          <a class="footer-text" href="/product/baxk/jqcx?baxknumber=轩铭2512品备1号-W" target="_blank">轩铭2512品备1号-W</a>
        </div>
        <div class="sp">
          <div class="footer-text">Copyright © {{ endyear }} Zhang Xuanming. All Rights Reserved. 张轩铭 版权所有
          </div>
          <tiny-divider direction="vertical"></tiny-divider>
          <a class="footer-text" href="https://gitcode.com/zhangls2512/xm2512-grmpweb" target="_blank">Gitcode上查看此项目</a>
        </div>
        <div class="sp">
          <div class="footer-text">Version 1.0.11</div>
          <tiny-divider direction="vertical"></tiny-divider>
          <router-link class="footer-text" to="/product/updatelog/index" target="_blank">更新日志</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header,
.main,
.footer {
  justify-content: center;
}

.cz {
  align-items: center;
}

.kuang {
  aspect-ratio: 1 / 1;
  flex: 1;
  justify-content: center;
  width: 150px;
}

.large-bold-text {
  text-align: center;
}
</style>