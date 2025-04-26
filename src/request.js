import axios from 'axios'
async function request({ apiPath, body }) {
  const loading = TinyLoading.service({
    lock: true,
    size: 'large',
    background: 'rgba(0, 0, 0, 0.5)'
  })
  try {
    const res = await axios.post('https://api.zhangls2512.cn' + apiPath, body)
    loading.close()
    if (res.data.errCode == 0) {
      return res.data
    }
    TinyNotify({
      type: 'error',
      title: '接口调用失败，错误码：' + String(res.data.errCode),
      message: '错误信息：' + res.data.errMsg + '，修复方法：' + res.data.errFix,
      position: 'top-right'
    })
    throw '接口调用失败'
  } catch (err) {
    loading.close()
    if (err == '接口调用失败') {
      throw new Error('接口调用失败')
    }
    TinyModal.message({
      message: '请求失败：' + err.message,
      status: 'error'
    })
    throw err
  }
}
export default request