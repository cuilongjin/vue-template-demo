/**
 * 按需加载 js
 * url: js 路径
 */
const loadjsAsync = function (url) {
  return new Promise((resolve, reject) => {
    let scriptHasLoad = document.querySelector('script[src="' + url + '"]')
    if (scriptHasLoad) {
      resolve()
      return false
    }

    let script = document.createElement('script')
    script.src = url
    document.body.appendChild(script)
    script.onload = () => {
      resolve()
    }
    script.onerror = err => {
      reject(err)
    }
  })
}
export default loadjsAsync
