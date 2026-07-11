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
          <span class="placeholder-badge" v-if="person.photo.includes('placeholder')">待填充</span>
        </h1>
        <p class="person-identity">{{ person.identity }}</p>
        <p class="person-summary">{{ person.summary }}</p>
      </div>
    </div>

    <!-- 音频播放器 -->
    <section class="detail-section" v-if="person.audio || true">
      <h3>🎧 采访录音</h3>
      <div class="audio-card data-card">
        <div v-if="person.audio" class="audio-player">
          <audio controls :src="person.audio" style="width:100%">
            您的浏览器不支持音频播放
          </audio>
          <div class="audio-segments" v-if="person.audio_segments?.length">
            <span
              v-for="(seg, i) in person.audio_segments"
              :key="i"
              class="segment-tag"
            >{{ seg.label }}</span>
          </div>
        </div>
        <div v-else class="empty-state">
          <el-icon :size="32"><VideoCamera /></el-icon>
          <p>采访录音将在实地调研后上传</p>
          <p class="empty-hint">支持分段标记——点击时间轴可跳转到关键回答</p>
        </div>
      </div>
    </section>

    <!-- 转写文字稿 -->
    <section class="detail-section">
      <h3>📝 AI转写文字稿</h3>
      <div class="transcript data-card">
        <div class="transcript-text">{{ person.transcript }}</div>
      </div>
    </section>

    <!-- 照片画廊 -->
    <section class="detail-section">
      <h3>📸 影像记录</h3>
      <div class="photo-grid">
        <div v-for="(p, i) in person.photos" :key="i" class="photo-item placeholder-img">
          <el-icon :size="32"><PictureFilled /></el-icon>
          <span>采访照片 {{ i + 1 }}</span>
        </div>
      </div>
    </section>

    <!-- 交互时间线 -->
    <section class="detail-section">
      <h3>⏳ 关键年份事件</h3>
      <div class="timeline-compact">
        <div class="tl-item" v-for="(ev, i) in person.timeline" :key="i">
          <div class="tl-dot"></div>
          <div class="tl-line" v-if="i < person.timeline.length - 1"></div>
          <div class="tl-card data-card">
            <span class="tl-year">{{ ev.year }}</span>
            <span class="tl-event">{{ ev.event }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 声纹可视化（占位） -->
    <section class="detail-section">
      <h3>🎵 声纹可视化</h3>
      <div class="waveform-card data-card empty-state">
        <el-icon :size="32"><Histogram /></el-icon>
        <p>声波动画将在采访录音上传后自动生成</p>
        <p class="empty-hint">截取情绪饱满片段，生成声波可视化动画</p>
      </div>
    </section>

    <!-- NLP分析（占位） -->
    <section class="detail-section">
      <h3>🧠 NLP语义分析</h3>
      <div class="nlp-grid">
        <div class="nlp-card data-card empty-state">
          <h4>情绪热力图</h4>
          <el-icon :size="28"><TrendCharts /></el-icon>
          <p>待分析</p>
        </div>
        <div class="nlp-card data-card empty-state">
          <h4>关键词共现网络</h4>
          <el-icon :size="28"><Connection /></el-icon>
          <p>待分析</p>
        </div>
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
import { ArrowLeft, UserFilled, VideoCamera, PictureFilled, Histogram, TrendCharts, Connection } from '@element-plus/icons-vue'
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

/* 音频 */
.audio-card { padding: 20px; }

.audio-segments {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.segment-tag {
  font-size: 12px;
  padding: 4px 10px;
  background: var(--bg-light);
  border-radius: 12px;
  color: var(--text-secondary);
  cursor: pointer;
}

.segment-tag:hover { background: var(--primary); color: #fff; }

/* 转写 */
.transcript { padding: 24px; }

.transcript-text {
  font-size: 15px;
  line-height: 2;
  color: var(--text-secondary);
  white-space: pre-wrap;
}

/* 照片 */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.photo-item {
  aspect-ratio: 4/3;
  border-radius: var(--radius);
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
}

/* 时间线 */
.timeline-compact {
  padding-left: 20px;
}

.tl-item {
  position: relative;
  padding-left: 32px;
  padding-bottom: 24px;
}

.tl-dot {
  position: absolute;
  left: -6px;
  top: 12px;
  width: 12px;
  height: 12px;
  background: var(--primary);
  border-radius: 50%;
  border: 3px solid var(--bg-light);
}

.tl-line {
  position: absolute;
  left: -2px;
  top: 24px;
  bottom: 0;
  width: 2px;
  background: var(--border);
}

.tl-card {
  padding: 12px 16px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.tl-year {
  font-weight: 700;
  color: var(--primary);
  font-size: 15px;
  white-space: nowrap;
}

.tl-event { font-size: 14px; color: var(--text-secondary); }

/* NLP */
.nlp-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.nlp-card {
  padding: 24px;
  text-align: center;
}

.nlp-card h4 {
  font-size: 15px;
  margin-bottom: 8px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px;
  color: var(--text-muted);
}

.empty-state p { font-size: 14px; }

.empty-hint {
  font-size: 12px !important;
  opacity: 0.6;
}

@media (max-width: 768px) {
  .person-header { flex-direction: column; align-items: center; text-align: center; }
  .person-photo { width: 120px; height: 120px; }
  .nlp-grid { grid-template-columns: 1fr; }
}
</style>
