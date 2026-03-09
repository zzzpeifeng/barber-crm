import request from '@/utils/request'
import type { Shop } from '@/types'

export const shopApi = {
  // 获取店铺列表
  getShops(merchantId?: number) {
    return request.get<any, Shop[]>('/shops', { params: { merchantId } })
  },
  
  // 获取店铺详情
  getShop(id: number) {
    return request.get<any, Shop>(`/shops/${id}`)
  }
}