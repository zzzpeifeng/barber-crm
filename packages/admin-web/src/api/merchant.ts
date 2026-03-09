import request from '@/utils/request'
import type { Merchant } from '@/types'

export const merchantApi = {
  // 获取商家列表
  getMerchants() {
    return request.get<Merchant[]>('/merchants')
  },
  
  // 获取商家详情
  getMerchant(id: number) {
    return request.get<Merchant>(`/merchants/${id}`)
  },
  
  // 创建商家
  createMerchant(data: Partial<Merchant>) {
    return request.post<Merchant>('/merchants', data)
  },
  
  // 更新商家
  updateMerchant(id: number, data: Partial<Merchant>) {
    return request.patch<Merchant>(`/merchants/${id}`, data)
  },
  
  // 删除商家
  deleteMerchant(id: number) {
    return request.delete(`/merchants/${id}`)
  }
}