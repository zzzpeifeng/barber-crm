import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const request = axios.create({
  // Use environment variable for API URL, fallback to relative path /api
  baseURL: import.meta.env.VITE_API_URL || '/api',
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

    // 后端直接返回数据，没有包装在 code/data 结构中
    // 如果包含 code 字段，则按照标准响应格式处理
    if (typeof data === 'object' && data !== null && 'code' in data) {
      if (data.code === 200) {
        return data.data
      } else {
        ElMessage.error(data.message || '请求失败')
        return Promise.reject(new Error(data.message))
      }
    }

    // 直接返回数据
    return data
  },
  (error) => {
    const authStore = useAuthStore()

    if (error.response?.status === 401) {
      authStore.logout()
      router.push('/admin/login')
      ElMessage.error('登录已过期，请重新登录')
    } else if (error.response?.status === 403) {
      ElMessage.error('权限不足')
    } else {
      ElMessage.error(error.message || '网络错误')
    }

    return Promise.reject(error)
  }
)

export default request