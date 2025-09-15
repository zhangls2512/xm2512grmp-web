'use strict'
exports.main = async () => {
  const axios = require('axios')
  const json5 = require('json5')
  const windowscanaryres = await axios.get('https://aka.ms/canaryLatest')
  axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
    accessKey: process.env.accesskey,
    id: '0e7893fb67e67aec0012ffd02eae679a',
    version: windowscanaryres.data.match(/\b\d{5}\b/g)[0]
  })
  const windowsdevres = await axios.get('https://aka.ms/devLatest')
  axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
    accessKey: process.env.accesskey,
    id: 'b013194767e67b6600146b805c3a6ba5',
    version: windowsdevres.data.match(/\b\d{5}\.\d{4}\b/g)[0]
  })
  const windowsbetares = await axios.get('https://aka.ms/betaLatest')
  axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
    accessKey: process.env.accesskey,
    id: '80a8bd4f67e67bb6001344e3625c0400',
    version: windowsbetares.data.match(/\b\d{5}\.\d{4}\b/g)[0]
  })
  const windowsreleasepreviewres = await axios.get('https://aka.ms/releasepreviewLatest')
  axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
    accessKey: process.env.accesskey,
    id: '9f86c65667e67c2f00130c9f5b343245',
    version: windowsreleasepreviewres.data.match(/\b\d{5}\.\d{4}\b/g)[0]
  })
  const wxandroidtestres = await axios.get('https://dldir1.qq.com/weixin/android/weixin_android_alpha_config.json')
  axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
    accessKey: process.env.accesskey,
    id: 'e23fc3b267e67ee0001253ba509d864e',
    version: json5.parse(wxandroidtestres.data.substring(3, wxandroidtestres.data.length - 2)).arm64.versionName
  })
  const wxwindowsres = await axios.get('https://pc.weixin.qq.com')
  const wxwindowsversions = [...new Set(wxwindowsres.data.match(/(\d+\.\d+\.\d+)/g))]
  axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
    accessKey: process.env.accesskey,
    id: '80a8bd4f67e68074001383b1504da293',
    version: wxwindowsversions[0]
  })
  const wxkfzgjres = await axios.get('https://developers.weixin.qq.com/miniprogram/dev/devtools/nightly.html')
  axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
    accessKey: process.env.accesskey,
    id: '11bc22f267e2adb2008bbe7e48ec3c7d',
    version: wxkfzgjres.data.match(/2\.01\.\d+/)[0]
  })
  const nodejsres = await axios.get('https://nodejs.org')
  const nodejsversions = [...new Set(nodejsres.data.match(/v(\d+\.\d+\.\d+)/g))].map(item => item.replace('v', ''))
  axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
    accessKey: process.env.accesskey,
    id: 'fbf3bf436871e67b052203370f53251e',
    version: nodejsversions[0]
  })
  axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
    accessKey: process.env.accesskey,
    id: '93aa0c2e67e29ab00088f4356abd3d5f',
    version: nodejsversions[1]
  })
  const crystaldiskres = await axios.get('https://crystalmark.info')
  axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
    accessKey: process.env.accesskey,
    id: 'f5d5a75067e17fd4007b1c37749ff6af',
    version: (crystaldiskres.data.match(/CrystalDiskInfo (\d+\.\d+\.\d+)/g)[0]).replace(/CrystalDiskInfo /g, '')
  })
  axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
    accessKey: process.env.accesskey,
    id: 'b311655b67e18121007c3e875e3f27fe',
    version: (crystaldiskres.data.match(/CrystalDiskMark (\d+\.\d+\.\d+)/g)[0]).replace(/CrystalDiskMark /g, '')
  })
  const sevenzipres = await axios.get('https://www.7-zip.org')
  axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
    accessKey: process.env.accesskey,
    id: 'a6ec304867e643f7000fe7491e77f39e',
    version: sevenzipres.data.match(/(?<=7-Zip\s)\d+\.\d+/g)[0]
  })
  const hrappstoreres = await axios.head('https://www.huorong.cn/product/download.php?pro=appstore')
  axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
    accessKey: process.env.accesskey,
    id: '5b79d91867e2aaec008968d03de7911d',
    version: hrappstoreres.request.res.responseUrl.match(/-(.*?)\.exe/)[1]
  })
  const navidiaappres = await axios.get('https://www.nvidia.cn/software/nvidia-app')
  axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
    accessKey: process.env.accesskey,
    id: '1bbb9dca67e29b9900891b5a58064b7b',
    version: navidiaappres.data.match(/NVIDIA_app_v(.*)(?=\.exe)/)[1]
  })
  const gitres = await axios.get('https://registry.npmmirror.com/-/binary/git-for-windows')
  axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
    accessKey: process.env.accesskey,
    id: '586080e067e18454007b71e82ef6ce5f',
    version: gitres.data[gitres.data.length - 1].name.match(/v(.*?)\.windows/)[1]
  })
  const rufusres = await axios.get('https://rufus.ie/zh')
  axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
    accessKey: process.env.accesskey,
    id: 'ed153fc76804a5ad017dd25f29e43879',
    version: rufusres.data.match(/rufus-(.+?)\.exe/)[1]
  })
  const msysres = await axios.get('https://www.msys2.org')
  axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
    accessKey: process.env.accesskey,
    id: '0e7893fb67e62980000df4bd6eddfee3',
    version: msysres.data.match(/msys2-x86_64-(.*?)\.exe/)[1]
  })
}