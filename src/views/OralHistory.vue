<template>
  <div class="page-container">
    <h2 class="section-title">🎙️ 护江者说</h2>
    <p class="section-subtitle">洞庭湖保护一线的四种岗位视角：湿地巡护、退捕转型、社区参与与渔政执法</p>

    <div class="interview-grid">
      <div
        v-for="person in interviews"
        :key="person.id"
        class="interview-card data-card"
        @click="$router.push(`/oral-history/${person.id}`)"
      >
        <div class="card-photo placeholder-img">
          <el-icon :size="40"><UserFilled /></el-icon>
        </div>
        <div class="card-body">
          <h3>
            {{ person.name }}
          </h3>
          <p class="card-identity">{{ person.identity }}</p>
          <p class="card-quote">{{ person.quote }}</p>
          <div class="card-tags">
            <el-tag
              v-for="kw in person.keywords"
              :key="kw"
              size="small"
              type="info"
              effect="plain"
            >{{ kw }}</el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from '../stores/data'
import { computed } from 'vue'
import { UserFilled } from '@element-plus/icons-vue'

const dataStore = useDataStore()
const interviews = computed(() => dataStore.interviews)
</script>

<style scoped>
.interview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.interview-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.interview-card:hover {
  border-color: var(--primary);
}

.card-photo {
  width: 100px;
  height: 100px;
  border-radius: 12px;
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

.card-body {
  flex: 1;
  min-width: 0;
}

.card-body h3 {
  font-size: 17px;
  color: var(--text-primary);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-identity {
  font-size: 13px;
  color: var(--primary);
  margin-bottom: 8px;
}

.card-quote {
  font-size: 14px;
  color: var(--text-secondary);
  font-style: italic;
  line-height: 1.6;
  margin-bottom: 10px;
  padding: 0;
  border: none;
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .interview-grid {
    grid-template-columns: 1fr;
  }
}
</style>
