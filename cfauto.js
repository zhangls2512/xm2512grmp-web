const fs = require('fs')
const path = require('path')
const cloudfunctionspath = path.join(__dirname, 'cloudfunctions')
const cloudfunctionfolders = fs.readdirSync(cloudfunctionspath)
console.log('函数个数：' + cloudfunctionfolders.length)
const jsoncontent = {
  'version': '2.0',
  'envId': 'zhangls2512-5ggbio7hc46f4036',
  'functionRoot': 'cloudfunctions',
  'functions': cloudfunctionfolders.map(item => ({
    'name': item,
    'timeout': 60,
    'runtime': 'Nodejs20.19',
    'installDependency': true
  }))
}
const outputfilepath = path.join(__dirname, 'cloudbaserc.json')
fs.writeFileSync(outputfilepath, JSON.stringify(jsoncontent, null, 2))
console.log('已生成')