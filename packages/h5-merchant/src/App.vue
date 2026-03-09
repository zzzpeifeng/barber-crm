<template>
  <div id="app">
    <router-view />
    <van-tabbar v-if="showTabbar" v-model="activeTab" @change="onTabChange">
      <van-tabbar-item icon="shop-o" to="/shops">店铺</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref(0)
const showTabbar = computed(() => {
  const hideTabbarRoutes = ['/login']
  return !hideTabbarRoutes.includes(route.path) && !route.path.includes('/members/')
})

const onTabChange = (index: number) => {
  const routes = ['/shops', '/profile']
  if (index < routes.length) {
    activeTab.value = index
    router.push(routes[index])
  }
}

watch(
  () => route.path,
  (path) => {
    if (path.startsWith('/shops')) {
      activeTab.value = 0
    } else if (path.startsWith('/profile')) {
      activeTab.value = 1
      authStore.initAuth()
    }
  },
  { immediate: true }
)

onMounted(() => {
  authStore.initAuth()
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  background-color: #f1f5f9; /* Ensure light background matches body */
}

/* Custom Tabbar Styles - Light Mode */
:deep(.van-tabbar) {
  background-color: #ffffff;
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
}

:deep(.van-tabbar-item--active) {
  background-color: transparent; /* No gradient, just icon color change */
}

:deep(.van-tabbar-item__icon) {
  font-size: 24px;
}
</style>