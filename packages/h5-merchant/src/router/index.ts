import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { title: '个人中心', requiresAuth: true }
  },
  {
    path: '/shops',
    name: 'ShopList',
    component: () => import('@/views/ShopList.vue'),
    meta: { title: '店铺列表', requiresAuth: true }
  },
  {
    path: '/shops/:shopId/stores',
    name: 'StoreList',
    component: () => import('@/views/StoreList.vue'),
    meta: { title: '门店列表', requiresAuth: true }
  },
  {
    path: '/stores/:storeId/members',
    name: 'MemberList',
    component: () => import('@/views/MemberList.vue'),
    meta: { title: '会员列表', requiresAuth: true }
  },
  {
    path: '/members/:memberId',
    name: 'MemberDetail',
    component: () => import('@/views/MemberDetail.vue'),
    meta: { title: '会员详情', requiresAuth: true }
  }
]

export default routes