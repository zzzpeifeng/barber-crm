<template>
  <div class="page-container">
    <van-nav-bar title="店铺列表" />
    
    <div class="content-container">
      <div v-if="loading" class="loading-container">
        <van-loading size="24px">加载中...</van-loading>
      </div>
      
      <div v-else-if="shops.length === 0" class="empty-container">
        <p class="info-text">暂无店铺</p>
      </div>
      
      <div v-else class="shop-list">
        <van-card
          v-for="shop in shops"
          :key="shop.id"
          :title="shop.name"
          :desc="shop.description || '暂无描述'"
          class="shop-card"
          @click="goToStores(shop.id)"
          is-link
        >
          <template #tags>
            <van-tag type="primary">店铺</van-tag>
          </template>
        </van-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { shopApi } from '@/api/shop'
import { useAuthStore } from '@/stores/auth'
import type { Shop } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const shops = ref<Shop[]>([])

const loadShops = async () => {
  loading.value = true
  try {
    const merchantId = authStore.user?.merchantId
    shops.value = await shopApi.getShops(merchantId)
  } catch (error: any) {
    showToast(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const goToStores = (shopId: number) => {
  router.push(`/shops/${shopId}/stores`)
}

onMounted(() => {
  loadShops()
})
</script>

<style scoped>
.content-container {
  padding: 16px;
  padding-bottom: 80px;
}

.loading-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.empty-container .info-text {
  color: #94a3b8;
  font-size: 16px;
}

.shop-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

:deep(.van-card) {
  /* Use global styles or minimal overrides */
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

:deep(.van-card:hover) {
  transform: translateY(-4px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(0, 217, 255, 0.2);
  border-color: rgba(0, 217, 255, 0.5);
}

:deep(.van-card__content) {
  background: transparent;
}

:deep(.van-card__title) {
  color: #050505;
  font-weight: 600;
  font-size: 18px;
}

:deep(.van-card__desc) {
  color: #050506;
}

:deep(.van-tag) {
  background: linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%);
  color: #00D9FF;
  border: 1px solid rgba(0, 217, 255, 0.3);
}

:deep(.van-icon-arrow) {
  color: #00D9FF;
}

/* NavBar 样式 
:deep(.van-nav-bar) {
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
*/
/*
:deep(.van-nav-bar__title) {
  color: #fff;
  font-weight: 600;
  font-size: 18px;
}
*/

/* Loading 样式 */
:deep(.van-loading__spinner) {
  color: #00D9FF;
}

:deep(.van-loading__text) {
  color: #94a3b8;
}
</style>