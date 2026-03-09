<template>
  <div class="page-container">
    <van-nav-bar title="商家登录" />
    
    <div class="login-container">
      <div class="logo-section">
        <div class="logo">
          <h1 class="text-3xl font-bold text-primary-500">理发店会员管理</h1>
        </div>
        <p class="info-text mt-2">请登录您的商家账号</p>
      </div>

      <van-form @submit="handleLogin">
        <div class="form-group">
          <van-field
            v-model="loginForm.username"
            label="账号"
            placeholder="请输入登录账号"
            :rules="[{ required: true, message: '请输入登录账号' }]"
          />
        </div>
        
        <div class="form-group">
          <van-field
            v-model="loginForm.password"
            type="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]"
          />
        </div>

        <div class="form-group">
          <van-checkbox v-model="rememberPassword">记住密码</van-checkbox>
        </div>

        <div class="btn-container">
          <van-button 
            type="primary" 
            native-type="submit" 
            :loading="loading"
            block
            round
          >
            登录
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const rememberPassword = ref(false)
const loginForm = ref({
  username: '',
  password: ''
})

// 简单的加密函数（XOR + Base64 + UTF-8 support）
const encrypt = (text: string, key: string): string => {
  try {
    // 1. URL encode to handle UTF-8 characters
    const encoded = encodeURIComponent(text)
    // 2. XOR encryption
    let result = ''
    for (let i = 0; i < encoded.length; i++) {
      result += String.fromCharCode(encoded.charCodeAt(i) ^ key.charCodeAt(i % key.length))
    }
    // 3. Base64 encode
    return btoa(result)
  } catch (e) {
    console.error('Encryption failed:', e)
    return ''
  }
}

// 简单的解密函数
const decrypt = (encryptedText: string, key: string): string => {
  try {
    if (!encryptedText) return ''
    // 1. Base64 decode
    const text = atob(encryptedText)
    // 2. XOR decryption
    let result = ''
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length))
    }
    // 3. URL decode
    return decodeURIComponent(result)
  } catch (e) {
    console.error('Decryption failed:', e)
    return ''
  }
}

// 从localStorage读取保存的账号密码
const loadSavedCredentials = () => {
  try {
    const savedCredentials = localStorage.getItem('h5_remember_credentials')
    if (savedCredentials) {
      const credentials = JSON.parse(savedCredentials)
      if (credentials.remember && credentials.username && credentials.password) {
        loginForm.value.username = decrypt(credentials.username, 'barber_crm')
        loginForm.value.password = decrypt(credentials.password, 'barber_crm')
        rememberPassword.value = true
      }
    }
  } catch (error) {
    console.error('加载保存的账号密码失败:', error)
  }
}

// 保存账号密码到localStorage
const saveCredentials = () => {
  try {
    if (rememberPassword.value && loginForm.value.username && loginForm.value.password) {
      const credentials = {
        remember: true,
        username: encrypt(loginForm.value.username, 'barber_crm'),
        password: encrypt(loginForm.value.password, 'barber_crm')
      }
      localStorage.setItem('h5_remember_credentials', JSON.stringify(credentials))
    } else {
      localStorage.removeItem('h5_remember_credentials')
    }
  } catch (error) {
    console.error('保存账号密码失败:', error)
  }
}

const handleLogin = async () => {
  loading.value = true
  try {
    const response = await authApi.login(loginForm.value)
    authStore.setAuth(response.user, response.access_token)
    saveCredentials()
    showToast('登录成功')
    router.push('/shops')
  } catch (error: any) {
    showToast(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

// 监听记住密码状态变化
watch(rememberPassword, (newValue) => {
  if (!newValue) {
    localStorage.removeItem('h5_remember_credentials')
  }
})

onMounted(() => {
  loadSavedCredentials()
})
</script>

<style scoped>
.login-container {
  padding: 40px 20px;
}

.logo-section {
  text-align: center;
  margin-bottom: 60px;
}

.form-group {
  margin-bottom: 20px;
}

.btn-container {
  margin-top: 40px;
}
</style>