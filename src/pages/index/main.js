import Vue from 'vue'
import '@/plugins/axios'
import App from './App.vue'
import router from './router'
import store from '@/store'
import '@/assets/css/reset.css'

if (process.env.VUE_APP_CURRENTMODE) {
  const isDebugMode = process.env.VUE_APP_CURRENTMODE === 't'
  Vue.config.debug = isDebugMode
  Vue.config.devtools = isDebugMode
  Vue.config.productionTip = isDebugMode
}

Vue.config.productionTip = false

// 基础组件的自动化全局注册
const requireIcon = require.context('@/icons', false)
console.log(requireIcon.keys())
requireIcon.keys().forEach(filename => {
  const componentConfig = requireIcon(filename)
  console.log(componentConfig)

  const componentName = filename
    .split('/')
    .pop()
    .replace(/\.\w+\$/, '')
  // console.log(componentName)

  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  )
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
