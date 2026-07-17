<template>
  <div class="page-container detail-page" v-if="person">
    <!-- 返回 -->
    <router-link to="/oral-history" class="back-link">
      <el-icon><ArrowLeft /></el-icon> 返回人物列表
    </router-link>

    <!-- 人物头部 -->
    <div class="person-header">
      <div class="person-photo placeholder-img">
        <el-icon :size="64"><UserFilled /></el-icon>
      </div>
      <div class="person-meta">
        <h1>
          {{ person.name }}
        </h1>
        <p class="person-identity">{{ person.identity }}</p>
        <p class="person-summary">{{ person.summary }}</p>
      </div>
    </div>

    <!-- 人物故事整理稿 -->
    <section class="detail-section">
      <h3>📝 人物故事整理</h3>
      <p class="story-note">以下内容依据洞庭湖生态保护工作场景整理，用于呈现不同岗位的工作视角，并非逐字采访记录。</p>
      <div class="transcript data-card">
        <div class="transcript-text">{{ person.transcript }}</div>
      </div>
    </section>
  </div>

  <!-- 未找到 -->
  <div v-else class="page-container">
    <el-empty description="人物未找到" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, UserFilled } from '@element-plus/icons-vue'
import { useDataStore } from '../stores/data'

const route = useRoute()
const dataStore = useDataStore()
const person = computed(() => {
  return dataStore.interviews.find(p => p.id === Number(route.params.id)) || null
})
</script>

<style scoped>
.detail-page { max-width: 880px; }

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 24px;
  transition: color 0.2s;
}

.back-link:hover { color: var(--primary); }

/* 人物头部 */
.person-header {
  display: flex;
  gap: 24px;
  margin-bottom: 40px;
}

.person-photo {
  width: 160px;
  height: 160px;
  border-radius: var(--radius);
  flex-shrink: 0;
}

.placeholder-img {
  background: var(--bg-light);
  border: 2px dashed var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.person-meta { padding-top: 8px; }

.person-meta h1 {
  font-size: 28px;
  margin-bottom: 8px;
}

.person-identity {
  font-size: 16px;
  color: var(--primary);
  margin-bottom: 12px;
}

.person-summary {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* 通用 section */
.detail-section { margin-bottom: 36px; }

.detail-section h3 {
  font-size: 18px;
  margin-bottom: 12px;
  color: var(--text-primary);
}

/* 转写 */
.transcript { padding: 24px; }

.story-note { margin: -2px 0 12px; color: var(--text-muted); font-size: 13px; line-height: 1.65; }

.transcript-text {
  font-size: 15px;
  line-height: 2;
  color: var(--text-secondary);
  white-space: pre-wrap;
}

@media (max-width: 768px) {
  .person-header { flex-direction: column; align-items: center; text-align: center; }
  .person-photo { width: 120px; height: 120px; }
}
</style>
