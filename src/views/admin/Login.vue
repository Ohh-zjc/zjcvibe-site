<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <span class="login-icon">🛡️</span>
        <h2>管理员登录</h2>
        <p>智护碧水·数绘洞庭 后台管理系统</p>
      </div>

      <!-- Supabase 已配置：邮箱登录 -->
      <template v-if="supabaseConfigured">
        <el-form @submit.prevent="handleSupabaseLogin" label-position="top">
          <el-form-item label="邮箱">
            <el-input v-model="email" type="email" placeholder="admin@example.com" size="large" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="password" type="password" placeholder="输入密码" show-password size="large" @keyup.enter="handleSupabaseLogin" />
          </el-form-item>

          <el-alert v-if="error" :title="error" type="error" show-icon :closable="false" style="margin-bottom:16px" />

          <el-button type="primary" size="large" @click="handleSupabaseLogin" :loading="loading" style="width:100%">
            登录
          </el-button>
        </el-form>

        <el-divider>或</el-divider>
      </template>

      <!-- 本地密码登录（fallback） -->
      <el-form @submit.prevent="handleLocalLogin" label-position="top">
        <el-form-item :label="supabaseConfigured ? '本地密码（离线模式）' : '管理密码'">
          <el-input v-model="localPassword" type="password" placeholder="输入本地密码" show-password size="large" @keyup.enter="handleLocalLogin" />
        </el-form-item>

        <el-alert v-if="localError" :title="localError" type="error" show-icon :closable="false" style="margin-bottom:16px" />

        <el-button type="primary" size="large" @click="handleLocalLogin" :loading="localLoading" :plain="supabaseConfigured" style="width:100%">
          {{ supabaseConfigured ? '离线登录' : '登录后台' }}
        </el-button>
      </el-form>

      <div class="login-footer">
        <router-link to="/">← 返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { supabase } from '../../lib/supabase'

const router = useRouter()
const auth = useAuthStore()

const supabaseConfigured = computed(() => {
  return !supabase.supabaseUrl.includes('YOUR-PROJECT')
})

// Supabase 登录
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleSupabaseLogin() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = '请输入邮箱和密码'
    return
  }
  loading.value = true
  const result = await auth.login(email.value, password.value)
  loading.value = false
  if (result.success) {
    router.push('/admin')
  } else {
    error.value = result.error || '登录失败'
  }
}

// 本地密码登录
const localPassword = ref('')
const localError = ref('')
const localLoading = ref(false)

function handleLocalLogin() {
  localError.value = ''
  if (!localPassword.value) {
    localError.value = '请输入密码'
    return
  }
  localLoading.value = true
  setTimeout(() => {
    const ok = auth.login('', localPassword.value)
    localLoading.value = false
    if (ok.success) {
      router.push('/admin')
    } else {
      localError.value = '密码错误'
    }
  }, 200)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-dark), #0D3B4F, var(--primary));
  padding: 20px;
}

.login-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px 36px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 28px;
}

.login-icon { font-size: 40px; display: block; margin-bottom: 8px; }

.login-header h2 {
  font-size: 22px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.login-header p {
  font-size: 13px;
  color: var(--text-muted);
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.login-footer a {
  font-size: 13px;
  color: var(--text-muted);
}

.login-footer a:hover { color: var(--primary); }
</style>
