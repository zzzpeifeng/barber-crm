import request from '@/utils/request'
import type { Store } from '@/types'

export const storeApi = {
  // 获取门店列表
  getStores(shopId?: number) {
    return request.get<Store[]>('/stores', { params: { shopId } })
  },
  
  // 获取门店详情
  getStore(id: number) {
    return request.get<Store>(`/stores/${id}`)
  },
  
  // 创建门店
  createStore(data: Partial<Store>) {
    return request.post<Store>('/stores', data)
  },
  
  // 更新门店
  updateStore(id: number, data: Partial<Store>) {
    return request.patch<Store>(`/stores/${id}`, data)
  },
  
  // 删除门店
  deleteStore(id: number) {
    return request.delete(`/stores/${id}`)
  }
}