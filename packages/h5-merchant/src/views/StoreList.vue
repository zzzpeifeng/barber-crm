<template>
  <div class="page-container">
    <van-nav-bar title="门店列表" left-arrow @click-left="goBack" />
    
    <div class="content-container">
      <div v-if="loading" class="loading-container">
        <van-loading size="24px">加载中...</van-loading>
      </div>
      
      <div v-else-if="stores.length === 0" class="empty-container">
        <p class="info-text">暂无门店</p>
      </div>
      
      <div v-else class="store-list">
        <van-card
          v-for="store in stores"
          :key="store.id"
          :title="store.name"
          :desc="store.address || '暂无地址'"
          class="store-card"
          @click="goToMembers(store.id)"
          is-link
        >
          <template #tags>
            <van-tag type="success">门店</van-tag>
          </template>
          
          <template #footer v-if="store.phone">
            <div class="store-info">
              <span class="info-text">{{ store.phone }}</span>
            </div>
          </template>
        </van-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { storeApi } from '@/api/store'
import type { Store } from '@/types'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const stores = ref<Store[]>([])

const loadStores = async () => {
  loading.value = true
  try {
    const shopId = Number(route.params.shopId)
    stores.value = await storeApi.getStores(shopId)
  } catch (error: any) {
    showToast(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const goToMembers = (storeId: number) => {
  router.push(`/stores/${storeId}/members`)
}

onMounted(() => {
  loadStores()
})
</script>

<style scoped>
.content-container {
  padding: 16px;
}

.loading-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.store-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.store-card {
  cursor: pointer;
  transition: all 0.3s;
}

.store-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.store-info {
  margin-top: 8px;
}
</style>