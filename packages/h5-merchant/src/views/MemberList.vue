<template>
  <div class="page-container">
    <van-nav-bar title="会员列表" left-arrow @click-left="goBack" />
    
    <div class="search-container">
      <van-search
        v-model="searchKeyword"
        placeholder="搜索会员手机号"
        @search="handleSearch"
        @clear="handleSearchClear"
      />
    </div>
    
    <div class="content-container">
      <div v-if="loading" class="loading-container">
        <van-loading size="24px">加载中...</van-loading>
      </div>
      
      <div v-else-if="members.length === 0" class="empty-container">
        <p class="info-text">暂无会员</p>
      </div>
      
      <div v-else class="member-list">
        <van-card
          v-for="member in members"
          :key="member.id"
          :title="member.name"
          class="member-card"
          @click="goToMemberDetail(member.id)"
          is-link
        >
          <template #desc>
            <div class="member-info">
              <p class="info-text">{{ member.phone }}</p>
              <p v-if="member.address" class="info-text">{{ member.address }}</p>
              <p class="points-info">
                <van-tag type="warning">
                  积分: {{ member.pointsSummary?.currentPoints || 0 }}
                </van-tag>
              </p>
            </div>
          </template>
        </van-card>
      </div>
    </div>

    <div class="floating-btn" @click="showAddMember = true">
      <van-icon name="plus" color="#ffffff" />
    </div>

    <!-- 新增会员弹窗 -->
    <van-popup 
      v-model:show="showAddMember" 
      position="bottom" 
      round 
      safe-area-inset-bottom 
      teleport="body"
      :z-index="20000"
    >
      <div class="add-member-form">
        <h3 class="section-title">新增会员</h3>
        <van-form @submit="handleAddMember">
          <van-field
            v-model="newMember.name"
            label="姓名"
            placeholder="请输入会员姓名"
            :rules="[{ required: true, message: '请输入会员姓名' }]"
          />
          <van-field
            v-model="newMember.phone"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[{ required: true, message: '请输入手机号' }]"
          />
          <van-field
            v-model="newMember.address"
            label="地址"
            placeholder="请输入地址（选填）"
          />
          <div class="form-actions">
            <van-button type="primary" native-type="submit" block>
              确定
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import { memberApi } from '@/api/member'
import { useAuthStore } from '@/stores/auth'
import type { Member } from '@/types'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(false)
const members = ref<Member[]>([])
const searchKeyword = ref('')
const showAddMember = ref(false)

const storeId = Number(route.params.storeId)
const shopId = computed(() => {
  // 这里需要从路由或状态管理中获取shopId
  // 暂时使用authStore中的merchantId作为shopId
  return authStore.user?.merchantId
})

const newMember = ref({
  name: '',
  phone: '',
  address: ''
})

const loadMembers = async () => {
  loading.value = true
  try {
    members.value = await memberApi.getMembers(shopId.value)
  } catch (error: any) {
    showToast(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    loadMembers()
    return
  }
  
  loading.value = true
  try {
    const member = await memberApi.searchMember(searchKeyword.value, shopId.value!)
    if (member) {
      members.value = [member]
    } else {
      members.value = []
      showToast('未找到该会员')
    }
  } catch (error: any) {
    showToast(error.message || '搜索失败')
  } finally {
    loading.value = false
  }
}

const handleSearchClear = () => {
  searchKeyword.value = ''
  loadMembers()
}

const handleAddMember = async () => {
  if (!shopId.value) {
    showToast('无法获取店铺信息')
    return
  }
  
  loading.value = true
  try {
    await memberApi.createMember({
      ...newMember.value,
      shopId: shopId.value
    })
    showSuccessToast('添加成功')
    showAddMember.value = false
    newMember.value = { name: '', phone: '', address: '' }
    loadMembers()
  } catch (error: any) {
    showToast(error.message || '添加失败')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const goToMemberDetail = (memberId: number) => {
  router.push(`/members/${memberId}`)
}

onMounted(() => {
  loadMembers()
})
</script>

<style scoped>
.search-container {
  padding: 16px;
  background: white;
  border-bottom: 1px solid #ebedf0;
}

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

.member-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-card {
  cursor: pointer;
  transition: all 0.3s;
}

.member-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.member-info {
  margin-top: 8px;
}

.points-info {
  margin-top: 4px;
}

.add-member-form {
  padding: 20px;
}

.form-actions {
  margin-top: 20px;
}

.floating-btn {
  position: fixed;
  bottom: 90px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #2563eb;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
  z-index: 99;
  font-size: 24px;
  transition: all 0.3s;
}

.floating-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
}
</style>