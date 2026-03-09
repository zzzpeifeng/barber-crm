<template>
  <div class="page-container">
    <van-nav-bar title="个人中心" left-arrow @click-left="goBack" />
    
    <div class="profile-container">
      <div class="user-info-card">
        <div class="avatar-section">
          <van-image
            round
            width="80"
            height="80"
            :src="userAvatar"
            fit="cover"
            class="avatar"
          >
            <template #error>
              <div class="avatar-placeholder">
                <van-icon name="user-o" size="40" />
              </div>
            </template>
          </van-image>
        </div>
        
        <div class="info-section">
          <h3 class="username">{{ userInfo?.username || '未知用户' }}</h3>
          <div class="role-badge">
            <van-tag :type="roleTagType">{{ getRoleText(userInfo?.role) }}</van-tag>
          </div>
        </div>
      </div>

      <div class="menu-list">
        <van-cell-group>
          <van-cell
            title="用户ID"
            :value="userInfo?.id?.toString() || '-'"
          />
          <van-cell
            title="登录账号"
            :value="userInfo?.username || '-'"
          />
          <van-cell
            title="角色权限"
            :value="getRoleText(userInfo?.role)"
          />
          <van-cell
            v-if="userInfo?.merchantId"
            title="商户ID"
            :value="userInfo.merchantId.toString()"
          />
          <van-cell
            title="记住密码"
            :value="rememberStatus"
          />
          <van-cell
            title="登录状态"
            value="已登录"
          />
        </van-cell-group>

        <van-cell-group class="mt-4">
          <van-cell
            title="账号安全"
            is-link
            @click="handleSecurity"
          >
            <template #icon>
              <van-icon name="shield-o" />
            </template>
          </van-cell>
          <van-cell
            title="应用设置"
            is-link
            @click="handleSettings"
          >
            <template #icon>
              <van-icon name="setting-o" />
            </template>
          </van-cell>
          <van-cell
            title="意见反馈"
            is-link
            @click="handleFeedback"
          >
            <template #icon>
              <van-icon name="comment-o" />
            </template>
          </van-cell>
          <van-cell
            title="关于我们"
            is-link
            @click="handleAbout"
          >
            <template #icon>
              <van-icon name="info-o" />
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <div class="logout-section">
        <van-button
          type="danger"
          block
          round
          @click="handleLogout"
          :loading="logoutLoading"
        >
          退出登录
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const logoutLoading = ref(false)

const userInfo = computed(() => authStore.user)

const userAvatar = computed(() => {
  return `https://picsum.photos/seed/${userInfo.value?.username || 'default'}/200/200.jpg`
})

const rememberStatus = computed(() => {
  return localStorage.getItem('h5_remember_credentials') ? '已开启' : '未开启'
})

const roleTagType = computed(() => {
  const role = userInfo.value?.role
  switch (role) {
    case 'merchant_owner':
      return 'primary'
    case 'merchant_manager':
      return 'success'
    case 'merchant_staff':
      return 'warning'
    default:
      return 'default'
  }
})

const getRoleText = (role?: string) => {
  switch (role) {
    case 'merchant_owner':
      return '商户所有者'
    case 'merchant_manager':
      return '商户管理员'
    case 'merchant_staff':
      return '商户员工'
    default:
      return '未知角色'
  }
}

const goBack = () => {
  router.back()
}

const handleSecurity = () => {
  showToast('账号安全功能开发中')
}

const handleSettings = () => {
  showToast('设置功能开发中')
}

const handleFeedback = () => {
  showToast('反馈通道开发中')
}

const handleAbout = () => {
  showToast('理发店会员管理系统 v1.0')
}

const handleLogout = async () => {
  try {
    await showConfirmDialog({
      title: '确认退出',
      message: '确定要退出登录吗？',
    })
  } catch {
    return
  }

  logoutLoading.value = true
  try {
    await authApi.logout()
  } catch (error: any) {
    console.error('退出登录请求失败:', error)
  } finally {
    // 无论请求成功与否，都清除本地状态
    authStore.logout()
    showToast('已退出登录')
    router.replace('/login')
    logoutLoading.value = false
  }
}

onMounted(() => {
  authStore.initAuth()
})
</script>

<style scoped>
.profile-container {
  padding: 16px;
  padding-bottom: 80px;
}

.user-info-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.avatar-section {
  flex-shrink: 0;
}

.avatar {
  border: 2px solid #e2e8f0;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.info-section {
  flex: 1;
}

.username {
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: #1f2937;
}

.role-badge {
  margin-top: 4px;
}

.menu-list {
  margin-bottom: 40px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.logout-section {
  padding: 0 16px;
}
</style>