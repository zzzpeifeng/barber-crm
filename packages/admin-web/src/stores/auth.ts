import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string>(localStorage.getItem('token') || '')

  const setAuth = (userData: User, authToken: string) => {
    user.value = userData
    token.value = authToken
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    user.value = null
    token.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const initAuth = () => {
    const userData = localStorage.getItem('user')
    if (userData && token.value) {
      try {
        user.value = JSON.parse(userData)
      } catch (error) {
        logout()
      }
    }
  }

  return {
    user,
    token,
    setAuth,
    logout,
    initAuth
  }
})