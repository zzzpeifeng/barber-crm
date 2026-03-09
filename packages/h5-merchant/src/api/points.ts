import request from '@/utils/request'
import type { MemberPointsSummary, MemberPointsTransaction } from '@/types'

export const pointsApi = {
  // 获取积分总览
  getSummary(memberId: number, shopId: number) {
    return request.get<any, MemberPointsSummary>('/points/summary', { 
      params: { memberId, shopId } 
    })
  },
  
  // 获取积分变更记录
  getTransactions(memberId?: number, shopId?: number) {
    return request.get<any, MemberPointsTransaction[]>('/points/transactions', { 
      params: { memberId, shopId } 
    })
  },
  
  // 变更积分
  changePoints(data: {
    memberId: number
    shopId: number
    changeType: 'increase' | 'decrease' | 'reset'
    pointsChange: number
    reason?: string
    operatorId: number
  }) {
    return request.post<any, MemberPointsTransaction>('/points/change', data)
  }
}