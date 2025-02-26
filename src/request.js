import axios from 'axios'
async function request({ apiPath, body }) {
  const loading = TinyLoading.service({
    lock: true,
    size: 'large'
  })
  try {
    const res = await axios.post('https://api.zhangls2512.cn' + apiPath, body)
    loading.close()
    if (res.data.errCode == 0) {
      return res.data
    } else {
      TinyNotify({
        type: 'error',
        title: '接口调用失败，错误码：' + String(res.data.errCode),
        message: '错误信息：' + res.data.errMsg + '，修复方法：' + res.data.errFix,
        position: 'top-right'
      })
      throw '接口调用失败'
    }
  } catch (err) {
    loading.close()
    if (err == '接口调用失败') {
      throw new Error('接口调用失败')
    } else {
      TinyModal.message({
        message: '请求失败',
        status: 'error'
      })
      throw err
    }
  }
}
export default request