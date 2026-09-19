import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const savedUser = JSON.parse(localStorage.getItem('bikis-user') || 'null')
  const user = ref(savedUser || { firstName: '', lastName: '', email: '', phone: '', city: 'Brazzaville' })
  const isAuthenticated = ref(false)

  function register(profile) {
    user.value = { ...user.value, ...profile }
    localStorage.setItem('bikis-user', JSON.stringify(user.value))
    isAuthenticated.value = true
  }

  function login(identifier) {
    const normalizedIdentifier = identifier.trim().toLowerCase()
    const matchesEmail = user.value.email?.toLowerCase() === normalizedIdentifier
    const matchesPhone = user.value.phone?.replace(/\s/g, '') === identifier.replace(/\s/g, '')

    if (!user.value.firstName || (!matchesEmail && !matchesPhone)) return false

    isAuthenticated.value = true
    return true
  }

  function logout() {
    isAuthenticated.value = false
  }

  return { user, isAuthenticated, register, login, logout }
})