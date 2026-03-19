import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/Login.vue'),
    meta: { title: '管理员登录' }
  },
  {
    path: '/admin',
    component: () => import('@/components/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '仪表盘' }
      },
      {
        path: 'merchants',
        name: 'MerchantManagement',
        component: () => import('@/views/MerchantManagement.vue'),
        meta: { title: '商家管理' }
      },
      {
        path: 'merchant-users',
        name: 'MerchantUserList',
        component: () => import('@/views/MerchantUserList.vue'),
        meta: { title: '商家用户管理' }
      },
      {
        path: 'shops',
        name: 'ShopList',
        component: () => import('@/views/ShopList.vue'),
        meta: { title: '店铺管理' }
      },
      {
        path: 'stores',
        name: 'StoreList',
        component: () => import('@/views/StoreList.vue'),
        meta: { title: '门店管理' }
      }
    ]
  }
]

export default routes