'use strict'
exports.main = async () => {
  const axios = require('axios')
  const json5 = require('json5')
  try {
    const { data } = await axios.get('https://learn.microsoft.com/en-us/windows-insider/toc.json')
    const versions = {
      canary: [],
      dev: '',
      beta: ''
    }
    data.items.find(item => item.toc_title === 'Release notes').children.forEach(item => {
      if (item.toc_title === 'Beta') {
        versions.beta = item.children[0].toc_title.slice(-10)
      }
      if (item.toc_title === 'Experimental') {
        versions.dev = item.children[0].toc_title.slice(-10)
      }
      if (item.toc_title === 'Experimental (26H1)' || item.toc_title === 'Experimental (Future Platforms)') {
        versions.canary.push(item.children[0].toc_title.slice(-10))
      }
    })
    versions.canary = versions.canary.join('、')
    try {
      await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
        accessKey: process.env.accesskey,
        id: '0e7893fb67e67aec0012ffd02eae679a',
        version: versions.canary
      })
    } catch {
    }
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: 'b013194767e67b6600146b805c3a6ba5',
      version: versions.dev
    })
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: '80a8bd4f67e67bb6001344e3625c0400',
      version: versions.beta
    })
    const windowsreleasepreviewres = await axios.get('https://aka.ms/releasepreviewLatest')
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: '9f86c65667e67c2f00130c9f5b343245',
      version: windowsreleasepreviewres.data.match(/\b\d{5}\.\d{4}\b/g)[0]
    })
    const wxandroidtestres = await axios.get('https://dldir1.qq.com/weixin/android/weixin_android_alpha_config.json')
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: 'e23fc3b267e67ee0001253ba509d864e',
      version: json5.parse(wxandroidtestres.data.substring(3, wxandroidtestres.data.length - 2)).arm64.versionName
    })
    const wxwindowsres = await axios.get('https://pc.weixin.qq.com')
    const wxwindowsversions = [...new Set(wxwindowsres.data.match(/(\d+\.\d+\.\d+)/g))]
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: '80a8bd4f67e68074001383b1504da293',
      version: wxwindowsversions[0]
    })
    const wxkfzgjres = await axios.get('https://devtools.wxqcloud.qq.com.cn/WechatWebDev/nightly/versions/config.json')
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: '11bc22f267e2adb2008bbe7e48ec3c7d',
      version: wxkfzgjres.data.channels.find(item => item.id == 'nightly').version
    })
    const nodejsres = await axios.get('https://nodejs.org')
    const nodejsversions = [...new Set(nodejsres.data.match(/v(\d+\.\d+\.\d+)/g))].map(item => item.replace('v', ''))
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: 'fbf3bf436871e67b052203370f53251e',
      version: nodejsversions[0]
    })
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: '93aa0c2e67e29ab00088f4356abd3d5f',
      version: nodejsversions[1]
    })
    const nvidiares = await axios.get('https://gfwsl.geforce.cn/nvidia_web_services/controller.gfeclientcontent.NG.php/com.nvidia.services.GFEClientContent_NG.getDispDrvrByDevid/' + encodeURI(JSON.stringify({
      dIDa: ['28E0_10DE_3B53_17AA_1'],
      osC: '10.0',
      osB: '26300',
      is6: '1',
      lg: '2052',
      iLp: '1',
      prvMd: '0',
      gcV: '11.0.6.383',
      gIsB: '0',
      dch: '1',
      upCRD: '0',
      isCRD: '0'
    })))
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: '1ec4d34469a3c8c3002201fe7ba57e7e',
      version: nvidiares.data.DriverAttributes.Version
    })
    const minecraftbedrockserverres = await axios.get('https://net-secondary.web.minecraft-services.net/api/v1.0/download/links')
    const link1 = minecraftbedrockserverres.data.result.links.find(item => item.downloadType == 'serverBedrockLinux').downloadUrl
    const link2 = minecraftbedrockserverres.data.result.links.find(item => item.downloadType == 'serverBedrockPreviewLinux').downloadUrl
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: 'f9fbf60c6997f7c60128e4a5635f3deb',
      version: link1.substring(link1.lastIndexOf('-') + 1).slice(0, -4)
    })
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: 'f9fbf60c6997fa4901290d054a26fc3e',
      version: link2.substring(link2.lastIndexOf('-') + 1).slice(0, -4)
    })
    const minecraftbedrockandroidres = await axios.get('https://mcapks.com/api/get-vslist.php')
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: '21515ff067e21edf0082426b2b8533b2',
      version: minecraftbedrockandroidres.data.data.versions.find(item => !item.beta).version
    })
    const crystaldiskres = await axios.get('https://crystalmark.info')
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: 'f5d5a75067e17fd4007b1c37749ff6af',
      version: (crystaldiskres.data.match(/CrystalDiskInfo (\d+\.\d+\.\d+)/g)[0]).replace(/CrystalDiskInfo /g, '')
    })
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: 'b311655b67e18121007c3e875e3f27fe',
      version: (crystaldiskres.data.match(/CrystalDiskMark (\d+\.\d+\.\d+)/g)[0]).replace(/CrystalDiskMark /g, '')
    })
    const sevenzipres = await axios.get('https://www.7-zip.org')
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: 'a6ec304867e643f7000fe7491e77f39e',
      version: sevenzipres.data.match(/(?<=7-Zip\s)\d+\.\d+/g)[0]
    })
    const hrappstoreres = await axios.head('https://www.huorong.cn/product/download.php?pro=appstore')
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: '5b79d91867e2aaec008968d03de7911d',
      version: hrappstoreres.request.res.responseUrl.match(/-(.*?)\.exe/)[1]
    })
    const nvidiaappres = await axios.get('https://www.nvidia.cn/software/nvidia-app')
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: '1bbb9dca67e29b9900891b5a58064b7b',
      version: nvidiaappres.data.match(/NVIDIA_app_v(.*)(?=\.exe)/)[1]
    })
    const gitres = await axios.get('https://registry.npmmirror.com/-/binary/git-for-windows')
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: '586080e067e18454007b71e82ef6ce5f',
      version: gitres.data[gitres.data.length - 1].name.slice(1, -1)
    })
    const rufusres = await axios.get('https://rufus.ie/zh')
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: 'ed153fc76804a5ad017dd25f29e43879',
      version: rufusres.data.match(/rufus-(.+?)\.exe/)[1]
    })
    const rssres = await axios.get('https://letsencrypt.org/feed.xml')
    const latestitem = rssres.data.substring(rssres.data.indexOf('<item>') + 6, rssres.data.indexOf('</item>'))
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: '9f5d149069ce2d690298fcad5db418da',
      version: latestitem.substring(latestitem.indexOf('<title>') + 7, latestitem.indexOf('</title>'))
    })
    const msysres = await axios.get('https://www.msys2.org')
    await axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
      accessKey: process.env.accesskey,
      id: '0e7893fb67e62980000df4bd6eddfee3',
      version: msysres.data.match(/msys2-x86_64-(.*?)\.exe/)[1]
    })
  } catch {
  }
}