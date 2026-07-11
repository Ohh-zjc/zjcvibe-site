<template>
  <div class="admin-overview">
    <h2>📊 管理总览</h2>
    <p class="overview-desc">欢迎进入后台管理系统。在此可编辑所有前台展示的数据。</p>
    
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background:#E8F4F8">🎙️</div>
        <div class="stat-info">
          <span class="stat-num">{{ dataStore.interviews.length }}</span>
          <span class="stat-lbl">口述史人物</span>
        </div>
        <router-link to="/admin/interviews" class="stat-action">管理 →</router-link>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background:#E8F8E8">🗺️</div>
        <div class="stat-info">
          <span class="stat-num">{{ dataStore.geo.points.length }}</span>
          <span class="stat-lbl">岸线点位</span>
        </div>
        <router-link to="/admin/geo" class="stat-action">管理 →</router-link>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background:#FFF3E0">📊</div>
        <div class="stat-info">
          <span class="stat-num">{{ dataStore.dashboard.water_quality.years.length }}</span>
          <span class="stat-lbl">年水质数据</span>
        </div>
        <router-link to="/admin/dashboard" class="stat-action">管理 →</router-link>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background:#F3E5F5">📖</div>
        <div class="stat-info">
          <span class="stat-num">{{ dataStore.education.quiz.length }}</span>
          <span class="stat-lbl">答题题目</span>
        </div>
        <router-link to="/admin/education" class="stat-action">管理 →</router-link>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <h3>快捷操作</h3>
      <div class="action-btns">
        <el-button type="primary" @click="exportData">📥 导出编辑数据</el-button>
        <el-button type="warning" @click="clearConfirm">🗑️ 清除所有编辑</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from '../../stores/data'
import { ElMessageBox, ElMessage } from 'element-plus'

const dataStore = useDataStore()

function exportData() {
  const json = dataStore.exportEdits()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'dongtinghu-edits.json'
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('数据已导出')
}

function clearConfirm() {
  ElMessageBox.confirm(
    '将清除所有管理后台的编辑数据（不影响原始 JSON 文件）。确定继续？',
    '确认清除',
    { confirmButtonText: '确定清除', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    dataStore.clearEdits()
    ElMessage.success('已清除所有编辑数据')
  }).catch(() => {})
}
</script>

<style scoped>
.overview-desc {
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  border: 1px solid #eee;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-bottom: 12px;
}

.stat-num {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  display: block;
}

.stat-lbl {
  font-size: 13px;
  color: var(--text-secondary);
}

.stat-action {
  display: inline-block;
  margin-top: 12px;
  font-size: 13px;
  color: var(--primary);
  text-decoration: none;
}

.quick-actions {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  border: 1px solid #eee;
}

.quick-actions h3 {
  font-size: 16px;
  margin-bottom: 16px;
}

.action-btns {
  display: flex;
  gap: 12px;
}
</style>
