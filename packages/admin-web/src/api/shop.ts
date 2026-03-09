import request from '@/utils/request'
import type { Shop } from '@/types'

export const shopApi = {
  // 获取店铺列表
  getShops(merchantId?: number) {
    return request.get<Shop[]>('/shops', { params: { merchantId } })
  },
  
  // 获取店铺详情
  getShop(id: number) {
    return request.get<Shop>(`/shops/${id}`)
  },
  
  // 创建店铺
  createShop(data: Partial<Shop>) {
    return request.post<Shop>('/shops', data)
  },
  
  // 更新店铺
  updateShop(id: number, data: Partial<Shop>) {
    return request.patch<Shop>(`/shops/${id}`, data)
  },
  
  // 删除店铺
  deleteShop(id: number) {
    return request.delete(`/shops/${id}`)
  }
}