<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <div class="logo">
        <span>🏪 理发店管理</span>
      </div>
      
      <el-menu
        :default-active="$route.path"
        background-color="transparent"
        text-color="#fff"
        active-text-color="#fff"
        router
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><DataLine /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        
        <el-menu-item index="/admin/merchants">
          <el-icon><Shop /></el-icon>
          <span>商家管理</span>
        </el-menu-item>

        <el-menu-item index="/admin/merchant-users">
          <el-icon><User /></el-icon>
          <span>商家用户管理</span>
        </el-menu-item>
        
        <el-menu-item index="/admin/shops">
          <el-icon><Store /></el-icon>
          <span>店铺管理</span>
        </el-menu-item>
        
        <el-menu-item index="/admin/stores">
          <el-icon><Location /></el-icon>
          <span>门店管理</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 顶部导航 -->
      <div class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-icon><User /></el-icon>
              {{ authStore.user?.username }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content-area">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { DataLine, Shop, Location, User, ArrowDown } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const currentPageTitle = computed(() => {
  return route.meta.title as string || '仪表盘'
})

const handleCommand = (command: string) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      authStore.logout()
      router.push('/admin/login')
    })
  }
}
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #333;
}

.user-info:hover {
  color: #3899EC;
}

:deep(.el-menu-item.is-active) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
</style>