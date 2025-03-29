'use strict'
exports.main = async () => {
  const axios = require('axios')
  const json5 = require('json5')
  const gitres = await axios.get('https://registry.npmmirror.com/-/binary/git-for-windows')
  axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
    accessKey: process.env.accesskey,
    id: '586080e067e18454007b71e82ef6ce5f',
    version: gitres.data[gitres.data.length - 1].name.match(/v(.*?)\.windows/)[1]
  })
  const nodejsres = await axios.get('https://nodejs.org')
  const nodejsversions = [...new Set(nodejsres.data.match(/v(\d+\.\d+\.\d+)/g))].map(item => item.replace('v', ''))
  axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
    accessKey: process.env.accesskey,
    id: '93aa0c2e67e29ab00088f4356abd3d5f',
    version: nodejsversions[1]
  })
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
  axios.post('https://api.zhangls2512.cn/resourcecreator/updateResourceVersion', {
    accessKey: process.env.accesskey,
    id: 'e1cff63567e680e400138e506fb1b405',
    version: wxwindowsversions[1]
  })
}