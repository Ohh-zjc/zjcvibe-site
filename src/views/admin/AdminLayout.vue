<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <span>🛡️</span>
        <h3>管理后台</h3>
      </div>
      
      <nav class="sidebar-nav">
        <router-link to="/admin" exact-active-class="active">
          <el-icon><HomeFilled /></el-icon> 总览
        </router-link>
        <router-link to="/admin/interviews" active-class="active">
          <el-icon><Microphone /></el-icon> 护江者说
        </router-link>
        <router-link to="/admin/geo" active-class="active">
          <el-icon><MapLocation /></el-icon> 岸线数据
        </router-link>
        <router-link to="/admin/dashboard" active-class="active">
          <el-icon><DataAnalysis /></el-icon> 数据看板
        </router-link>
        <router-link to="/admin/education" active-class="active">
          <el-icon><Reading /></el-icon> 童护长江
        </router-link>
      </nav>
      
      <div class="sidebar-footer">
        <el-button type="danger" plain size="small" @click="handleLogout" style="width:100%">
          退出登录
        </el-button>
        <router-link to="/" class="back-link">← 返回前台</router-link>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="admin-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { HomeFilled, Microphone, MapLocation, DataAnalysis, Reading } from '@element-plus/icons-vue'

const router = useRouter()
const auth = useAuthStore()

function handleLogout() {
  auth.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

.admin-sidebar {
  width: 220px;
  background: #1B2A3A;
  color: #fff;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 24px 20px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.sidebar-header span { font-size: 24px; }
.sidebar-header h3 { font-size: 16px; font-weight: 600; }

.sidebar-nav {
  flex: 1;
  padding: 12px 0;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;
}

.sidebar-nav a:hover {
  color: #fff;
  background: rgba(255,255,255,0.08);
}

.sidebar-nav a.active {
  color: #fff;
  background: var(--primary);
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.back-link {
  display: block;
  text-align: center;
  margin-top: 12px;
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  text-decoration: none;
}

.back-link:hover { color: rgba(255,255,255,0.7); }

.admin-main {
  flex: 1;
  margin-left: 220px;
  padding: 32px;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .admin-sidebar { width: 180px; }
  .admin-main { margin-left: 180px; padding: 20px; }
}
</style>
