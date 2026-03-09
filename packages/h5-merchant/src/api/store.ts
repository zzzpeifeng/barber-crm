import request from '@/utils/request'
import type { Store } from '@/types'

export const storeApi = {
  // 获取门店列表
  getStores(shopId?: number) {
    return request.get<any, Store[]>('/stores', { params: { shopId } })
  },
  
  // 获取门店详情
  getStore(id: number) {
    return request.get<any, Store>(`/stores/${id}`)
  }
}