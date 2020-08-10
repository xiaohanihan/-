import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.js'
import './assets/fonts/iconfont.css'
import Axios from 'axios'
import { Message } from 'element-ui'
import ZkTable from 'vue-table-with-tree-grid'
import $ from 'jquery'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import 'default-passive-events'

// import locale from 'element-ui/lib/locale/lang/zh-CN'
Vue.component(ZkTable.name, ZkTable)
Vue.config.productionTip = false

Axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
Axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

console.log($('div'))

Axios.interceptors.response.use(config => {
  NProgress.done()
  if (config.data.meta.msg === '无效token') {
    Message.error(config.data.meta.msg)
  }
  return config
})
Vue.prototype.$http = Axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
