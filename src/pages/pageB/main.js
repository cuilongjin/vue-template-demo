import Vue from 'vue'
import '../../plugins/axios'
import App from './App.vue'
import router from './router'
import store from '../../store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// var vm = new Vue({
//   router,
//   store,
//   el: '#app',
//   template: App
// })
