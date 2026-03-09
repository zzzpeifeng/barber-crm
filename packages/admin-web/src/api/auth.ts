import request from '@/utils/request'
import type { LoginResponse } from '@/types'

export const authApi = {
  // 管理员登录
  adminLogin(data: { username: string; password: string }) {
    return request.post<LoginResponse>('/auth/admin/login', data)
  }
}