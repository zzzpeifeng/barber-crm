import request from '@/utils/request'
import type { MerchantUser } from '@/types'

export const merchantUserApi = {
  // 获取商家用户列表
  getMerchantUsers() {
    return request.get<MerchantUser[]>('/merchant-users')
  },
  
  // 获取商家用户详情
  getMerchantUser(id: number) {
    return request.get<MerchantUser>(`/merchant-users/${id}`)
  },
  
  // 创建商家用户
  createMerchantUser(data: Partial<MerchantUser>) {
    return request.post<MerchantUser>('/merchant-users', data)
  },
  
  // 更新商家用户
  updateMerchantUser(id: number, data: Partial<MerchantUser>) {
    return request.patch<MerchantUser>(`/merchant-users/${id}`, data)
  },
  
  // 删除商家用户
  deleteMerchantUser(id: number) {
    return request.delete(`/merchant-users/${id}`)
  }
}
