import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase, supabaseConfigured } from '../lib/supabase'

const STORAGE_KEY = 'dongtinghu_admin'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const user = ref(null)
  const loading = ref(false)

  // 启动时检查 Supabase session
  async function init() {
    loading.value = true
    if (!supabaseConfigured) {
      // Supabase 未配置，fallback 到 localStorage
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) { const d = JSON.parse(saved); isLoggedIn.value = d.loggedIn === true }
      } catch {}
      loading.value = false
      return
    }
    try {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        isLoggedIn.value = true
        user.value = data.session.user
      }
    } catch {
      // Supabase 不可用
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) { const d = JSON.parse(saved); isLoggedIn.value = d.loggedIn === true }
      } catch {}
    }
    loading.value = false
  }

  // Supabase 邮箱 + 密码登录
  async function login(email, password) {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        // fallback: 本地密码登录
        if (password === 'dongtinghu2026') {
          isLoggedIn.value = true
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ loggedIn: true }))
          loading.value = false
          return { success: true }
        }
        loading.value = false
        return { success: false, error: error.message }
      }
      isLoggedIn.value = true
      user.value = data.user
      loading.value = false
      return { success: true }
    } catch (e) {
      // Supabase 不可用时的 fallback
      if (password === 'dongtinghu2026') {
        isLoggedIn.value = true
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ loggedIn: true }))
        loading.value = false
        return { success: true }
      }
      loading.value = false
      return { success: false, error: e.message }
    }
  }

  async function logout() {
    try {
      await supabase.auth.signOut()
    } catch {}
    isLoggedIn.value = false
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  // 注册管理员（一次性操作）
  async function registerAdmin(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { success: false, error: error.message }
    return { success: true, user: data.user }
  }

  init()

  return { isLoggedIn, user, loading, login, logout, registerAdmin }
})
