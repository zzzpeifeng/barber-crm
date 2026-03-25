import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { 
  Button, 
  Form, 
  Field, 
  CellGroup, 
  Cell, 
  NavBar, 
  Tabbar, 
  TabbarItem,
  List,
  Card,
  Search,
  Popup,
  Dialog,
  Toast,
  Loading,
  Stepper,
  Icon
} from 'vant'
import 'vant/lib/index.css'
import './assets/styles/index.css'
import App from './App.vue'
import routes from './router'

const app = createApp(App)

// 注册 Vant 组件
const vantComponents = [
  Button, Form, Field, CellGroup, Cell, NavBar, Tabbar, TabbarItem,
  List, Card, Search, Popup, Dialog, Toast, Loading, Stepper, Icon
]
vantComponents.forEach(component => app.use(component))

// 路由配置
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  let isTokenValid = false

  if (token) {
    try {
      // Decode JWT payload handling UTF-8 characters
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      
      const payload = JSON.parse(jsonPayload)
      
      // Check expiration
      if (payload.exp && payload.exp * 1000 > Date.now()) {
        isTokenValid = true
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    } catch (e) {
      console.error('Token validation failed:', e)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  if (to.path !== '/login' && !isTokenValid) {
    next('/login')
  } else if (to.path === '/login' && isTokenValid) {
    next('/shops')
  } else {
    next()
  }
})

app.use(createPinia())
app.use(router)

/* ========== 移动端防缩放事件拦截（JS 兜底） ========== */
const gestureEvents = ['gesturestart', 'gesturechange', 'gestureend'] as const
gestureEvents.forEach(eventName => {
  document.addEventListener(eventName, (e: Event) => {
    e.preventDefault()
  }, { passive: false })
})

app.mount('#app')