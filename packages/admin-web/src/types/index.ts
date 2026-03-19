export interface User {
  id: number
  username: string
  role: string
  merchantId?: number
}

export interface LoginResponse {
  access_token: string
  user: User
}

export interface Merchant {
  id: number
  name: string
  phone?: string
  remark?: string
  loginAccount: string
  createdAt: string
  updatedAt: string
}

export interface MerchantUser {
  id: number
  merchantId: number
  username: string
  realName?: string
  role: 'owner' | 'manager' | 'staff'
  status: number
  createdAt: string
  updatedAt: string
  merchant?: Merchant
}

export interface Shop {
  id: number
  merchantId: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  merchant?: Merchant
  stores?: Store[]
}

export interface Store {
  id: number
  shopId: number
  name: string
  address?: string
  phone?: string
  remark?: string
  createdAt: string
  updatedAt: string
  shop?: Shop
}

export interface Member {
  id: number
  shopId: number
  name: string
  phone: string
  address?: string
  createdAt: string
  updatedAt: string
  shop?: Shop
}

export interface MemberPointsSummary {
  id: number
  shopId: number
  memberId: number
  currentPoints: number
  totalEarned: number
  totalUsed: number
  updatedAt: string
}

export interface MemberPointsTransaction {
  id: number
  shopId: number
  memberId: number
  changeType: 'increase' | 'decrease' | 'reset'
  pointsChange: number
  reason?: string
  operatorId: number
  createdAt: string
  member?: Member
  shop?: Shop
}