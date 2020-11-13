import axios from 'axios'
import { Loading } from 'element-ui'
let loading
function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '拼命加载中...',
    background: 'rgba(0,0,0,.6)'
  })
}
function endLoading() {
  loading.close()
}
axios.interceptors.request.use((config) => {
  startLoading()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
},
(error) => {
  return Promise.reject(error)
})
axios.interceptors.response.use((response) => {
  endLoading()
  return response
}, (error) => {
  endLoading()
  return Promise.reject(error)
})
export default axios
