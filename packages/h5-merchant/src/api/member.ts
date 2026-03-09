import request from '@/utils/request'
import type { Member } from '@/types'

export const memberApi = {
  // 获取会员列表
  getMembers(shopId?: number) {
    return request.get<any, Member[]>('/members', { params: { shopId } })
  },
  
  // 获取会员详情
  getMember(id: number) {
    return request.get<any, Member>(`/members/${id}`)
  },
  
  // 搜索会员
  searchMember(phone: string, shopId: number) {
    return request.get<any, Member>('/members/search/by-phone', { 
      params: { phone, shopId } 
    })
  },
  
  // 创建会员
  createMember(data: Partial<Member>) {
    return request.post<any, Member>('/members', data)
  }
}