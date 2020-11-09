import axios from 'axios'
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
},
(error) => {
  return Promise.reject(error)
})
axios.interceptors.response.use((response) => {
  return response
})
export default axios
