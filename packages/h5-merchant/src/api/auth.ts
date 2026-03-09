import request from '@/utils/request'
import type { LoginResponse } from '@/types'

export const authApi = {
  // 商家登录
  login(data: { username: string; password: string }) {
    return request.post<any, LoginResponse>('/auth/login', data)
  },
  
  // 退出登录
  logout() {
    return request.post('/auth/logout')
  }
}