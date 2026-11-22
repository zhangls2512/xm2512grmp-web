export function base64url(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  bytes.forEach(item => {
    binary += String.fromCharCode(item)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/, '')
}
export function time(time) {
  const date = new Date(time)
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0') + ' ' + String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0') + ':' + String(date.getSeconds()).padStart(2, '0')
}