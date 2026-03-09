import request from '@/utils/request'
import type { Member } from '@/types'

export const memberApi = {
  // 获取会员列表
  getMembers(shopId?: number) {
    return request.get<Member[]>('/members', { params: { shopId } })
  },
  
  // 获取会员详情
  getMember(id: number) {
    return request.get<Member>(`/members/${id}`)
  }
}