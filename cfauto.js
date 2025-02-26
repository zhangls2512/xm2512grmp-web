console.time('cfauto')
const fs = require('fs')
const path = require('path')
const cloudfunctionspath = path.join(__dirname, 'cloudfunctions')
const subfolders = fs.readdirSync(cloudfunctionspath).filter(item => fs.statSync(path.join(cloudfunctionspath, item)).isDirectory() && !item.startsWith('.'))
const jsoncontent = {
  'version': '2.0',
  'envId': 'zhangls2512-5ggbio7hc46f4036',
  'functionRoot': 'cloudfunctions',
  'functions': subfolders.map(subfolder => ({
    'name': subfolder,
    'timeout': 60,
    'runtime': 'Nodejs18.15',
    'installDependency': true
  }))
}
const outputfilepath = path.join(__dirname, 'cloudbaserc.json')
fs.writeFileSync(outputfilepath, JSON.stringify(jsoncontent, null, 2), 'utf-8')
console.log('生成完成')
console.timeEnd('cfauto')