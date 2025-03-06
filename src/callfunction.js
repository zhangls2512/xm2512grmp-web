import cloudbase from '@cloudbase/js-sdk'
async function callfunction({ functionName, data }) {
  const loading = TinyLoading.service({
    lock: true,
    size: 'large',
    background: 'rgba(0, 0, 0, 0.5)'
  })
  const app = cloudbase.init({
    env: 'zhangls2512-5ggbio7hc46f4036',
    timeout: 60000
  })
  await app.auth().signInAnonymously()
  try {
    const res = await app.callFunction({
      name: functionName,
      data: data
    })
    loading.close()
    if (res.result.errCode == 0) {
      return res.result
    } else {
      TinyNotify({
        type: 'error',
        title: '接口调用失败，错误码：' + String(res.result.errCode),
        message: '错误信息：' + res.result.errMsg + '，修复方法：' + res.result.errFix,
        position: 'top-right'
      })
      throw '接口调用失败'
    }
  } catch (err) {
    loading.close()
    if (err == '接口调用失败') {
      throw new Error('接口调用失败')
    } else {
      TinyNotify({
        type: 'error',
        title: '请求失败',
        message: String(err),
        position: 'top-right'
      })
      throw err
    }
  }
}
export default callfunction