import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor' // 调用编辑器
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

// 导入全局样式表
import './assets/css/global.css'
import './assets/css/iconfont.css'
// import './element/element'
import TerrTable from 'vue-table-with-tree-grid'
import axios from 'axios'
import './http'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.filter('dateFormat', function(date) {
  const dt = new Date(date * 1000)
  var y = dt.getFullYear()
  var m = (dt.getMonth() + 1 + '').padStart(2, '0')
  var r = (dt.getDate() + '').padStart(2, '0')
  var h = (dt.getHours() + '').padStart(2, '0')
  var min = (dt.getMinutes() + '').padStart(2, '0')
  var s = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}/${m}/${r} ${h}:${min}:${s}`
})
Vue.component('tree-table', TerrTable)
Vue.use(VueQuillEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
