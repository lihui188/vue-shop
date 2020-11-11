import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入全局样式表
import './assets/css/global.css'
import './assets/css/iconfont.css'
import './element/element'
import TerrTable from 'vue-table-with-tree-grid'
import axios from 'axios'
import './http'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TerrTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
