<template>
  <div>
    <h1 class="page-title">仪表盘</h1>
    
    <!-- 统计数据 -->
    <div class="stats-grid">
      <div class="stats-item">
        <div class="stats-number">{{ stats.merchantCount }}</div>
        <div class="stats-label">商家总数</div>
      </div>
      <div class="stats-item">
        <div class="stats-number">{{ stats.shopCount }}</div>
        <div class="stats-label">店铺总数</div>
      </div>
      <div class="stats-item">
        <div class="stats-number">{{ stats.storeCount }}</div>
        <div class="stats-label">门店总数</div>
      </div>
      <div class="stats-item">
        <div class="stats-number">{{ stats.memberCount }}</div>
        <div class="stats-label">会员总数</div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="stats-card">
      <h3>快速操作</h3>
      <div class="action-buttons">
        <el-button type="primary" @click="$router.push('/admin/merchants')">
          <el-icon><Shop /></el-icon>
          商家管理
        </el-button>
        <el-button type="success" @click="$router.push('/admin/shops')">
          <el-icon><Store /></el-icon>
          店铺管理
        </el-button>
        <el-button type="warning" @click="$router.push('/admin/stores')">
          <el-icon><Location /></el-icon>
          门店管理
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { merchantApi } from '@/api/merchant'
import { shopApi } from '@/api/shop'
import { storeApi } from '@/api/store'
import { memberApi } from '@/api/member'

const stats = ref({
  merchantCount: 0,
  shopCount: 0,
  storeCount: 0,
  memberCount: 0
})

const loadStats = async () => {
  try {
    const [merchantsRes, shopsRes, storesRes] = await Promise.all([
      merchantApi.getMerchants(),
      shopApi.getShops(),
      storeApi.getStores()
    ])
    
    stats.value.merchantCount = merchantsRes.data.length
    stats.value.shopCount = shopsRes.data.length
    stats.value.storeCount = storesRes.data.length
    // 会员统计需要从会员表获取，这里暂时用模拟数据
    stats.value.memberCount = 128
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.action-buttons .el-button {
  height: 48px;
  padding: 0 24px;
  font-size: 16px;
}
</style>