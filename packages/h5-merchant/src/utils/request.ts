import axios from 'axios'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code === 200) {
      return data.data
    } else {
      showToast(data.message || '请求失败')
      return Promise.reject(new Error(data.message))
    }
  },
  (error) => {
    const authStore = useAuthStore()
    
    if (error.response?.status === 401) {
      authStore.logout()
      router.push('/login')
      showToast('登录已过期，请重新登录')
    } else if (error.response?.status === 403) {
      showToast('权限不足')
    } else {
      showToast(error.message || '网络错误')
    }
    
    return Promise.reject(error)
  }
)

export default request