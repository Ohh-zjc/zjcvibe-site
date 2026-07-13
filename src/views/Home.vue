<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="hero-icon">🌊</span>
          智护碧水·数绘洞庭
        </h1>
        <p class="hero-subtitle">湖北大学计算机学院2026年暑期社会实践数据平台</p>
        <p class="hero-desc">
          2026年7月，湖北大学计算机学院「智护碧水」小分队赴岳阳洞庭湖流域，
          开展为期6天的社会实践调研。我们采集卫星遥感数据、无人机航拍影像、
          口述历史档案与水质反演数据，以数字技术守护一江碧水。
        </p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-num">6</span>
            <span class="stat-label">天实地调研</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">5+</span>
            <span class="stat-label">位口述史人物</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">4</span>
            <span class="stat-label">个岸线点位</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">10</span>
            <span class="stat-label">年水质数据</span>
          </div>
        </div>
      </div>
      <button
        type="button"
        class="hero-scroll"
        aria-label="向下滚动到探索数据平台"
        @click="scrollToModules"
      >
        <span>向下探索</span>
        <el-icon><ArrowDown /></el-icon>
      </button>
    </section>

    <!-- 模块入口卡片 -->
    <section ref="modulesSection" class="modules-section">
      <div class="page-container">
        <h2 class="section-title">探索数据平台</h2>
        <p class="section-subtitle">四个模块，从口述史到卫星遥感，全方位展现洞庭湖生态</p>
        
        <div class="module-cards">
          <router-link to="/oral-history" class="module-card">
            <div class="module-icon">🎙️</div>
            <h3>护江者说</h3>
            <p>聆听退捕渔民、湿地巡护员、水文站职工的口述历史，感受人与江河的生命交织。</p>
            <span class="module-arrow">进入 →</span>
          </router-link>
          
          <router-link to="/shoreline" class="module-card">
            <div class="module-icon">🗺️</div>
            <h3>岸线寻访</h3>
            <p>交互地图 + 卫星对比 + NDVI趋势，用遥感数据丈量洞庭湖岸线的十年变迁。</p>
            <span class="module-arrow">进入 →</span>
          </router-link>
          
          <router-link to="/dashboard" class="module-card">
            <div class="module-icon">📊</div>
            <h3>数据看板</h3>
            <p>水质、植被、清滩、巡护——全流程数据汇总，为长江大保护提供量化依据。</p>
            <span class="module-arrow">进入 →</span>
          </router-link>
          
          <router-link to="/education" class="module-card">
            <div class="module-icon">📖</div>
            <h3>童护长江</h3>
            <p>AI绘本 + 生态答题 + 课堂作品墙，将长江故事种进孩子们心中。</p>
            <span class="module-arrow">进入 →</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 实践影像轮播 -->
    <section class="gallery-section">
      <div class="page-container">
        <h2 class="section-title">实践影像</h2>
        <p class="section-subtitle">代表性场景将在实地调研后替换为真实照片</p>
        
        <div class="gallery-grid">
          <div class="gallery-item" v-for="(item, i) in galleryItems" :key="i">
            <div class="gallery-img placeholder-img">
              <el-icon :size="36"><PictureFilled /></el-icon>
              <span>{{ item.label }}</span>
            </div>
            <p class="gallery-caption">{{ item.caption }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 实践路线 -->
    <section class="timeline-section">
      <div class="page-container">
        <h2 class="section-title">实践路线</h2>
        <p class="section-subtitle">Day 1 — Day 6，岳阳洞庭湖流域</p>
        
        <div class="practice-timeline">
          <div class="tl-item" v-for="(day, i) in timeline" :key="i">
            <div class="tl-marker">{{ day.day }}</div>
            <div class="tl-content">
              <h4>{{ day.title }}</h4>
              <p>{{ day.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowDown, PictureFilled } from '@element-plus/icons-vue'

const modulesSection = ref(null)

function scrollToModules() {
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  modulesSection.value?.scrollIntoView({
    behavior: reducedMotion ? 'auto' : 'smooth',
    block: 'start',
  })
}

const galleryItems = [
  { label: '城陵矶', caption: '城陵矶水文站——洞庭入江口' },
  { label: '华龙码头', caption: '华龙码头（江豚湾）今昔对比' },
  { label: '湿地', caption: '东洞庭湖湿地候鸟观测' },
  { label: '采访', caption: '口述史采访现场' },
  { label: '课堂', caption: '社区儿童生态课堂' },
]

const timeline = [
  { day: 'Day 1', title: '抵达岳阳', desc: '抵达岳阳，与城陵矶水文站对接，了解洞庭湖水文监测体系。' },
  { day: 'Day 2', title: '口述史采集（一）', desc: '采访城陵矶水文站退休职工，记录长江水文变迁口述历史。' },
  { day: 'Day 3', title: '口述史采集（二）', desc: '走访东洞庭湖湿地巡护员和退捕渔民，记录禁渔前后的生态变化。' },
  { day: 'Day 4', title: '岸线巡护', desc: '跟随渔政执法船巡护洞庭湖水域，航拍华龙码头等岸线点位。' },
  { day: 'Day 5', title: '童护长江课堂', desc: '在沿江社区和华龙码头开设生态课堂，教授AI绘本和生态知识。' },
  { day: 'Day 6', title: '数据汇总 & 返程', desc: '整理采集数据，拍摄收尾影像，返程。' },
]
</script>

<style scoped>
/* ===== Hero ===== */
.hero {
  position: relative;
  min-height: 92vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--primary-dark) 0%, #0D3B4F 40%, var(--primary) 100%);
}

.hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(46,134,171,0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(241,143,1,0.15) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #fff;
  max-width: 800px;
  padding: 20px;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: 2px;
}

.hero-icon { font-size: 52px; display: block; margin-bottom: 8px; }

.hero-subtitle {
  font-size: 18px;
  opacity: 0.85;
  margin-bottom: 24px;
}

.hero-desc {
  font-size: 16px;
  opacity: 0.7;
  line-height: 1.8;
  max-width: 640px;
  margin: 0 auto 40px;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 48px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 32px;
  font-weight: 800;
  color: var(--accent-light);
}

.stat-label {
  font-size: 13px;
  opacity: 0.7;
  margin-top: 4px;
}

.hero-scroll {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: rgba(255,255,255,0.5);
  font-size: 13px;
  font-family: inherit;
  background: transparent;
  border: 0;
  padding: 8px 12px;
  cursor: pointer;
  animation: bounce 2s infinite;
}

.hero-scroll:hover {
  color: #fff;
}

.hero-scroll:focus-visible {
  color: #fff;
  outline: 2px solid rgba(255,255,255,0.9);
  outline-offset: 3px;
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(8px); }
}

/* ===== 模块卡片 ===== */
.modules-section {
  background: var(--bg-white);
  padding: 60px 0;
  scroll-margin-top: 64px;
}

@media (prefers-reduced-motion: reduce) {
  .hero-scroll { animation: none; }
}

.module-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.module-card {
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px 24px;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.module-card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.module-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.module-card h3 {
  font-size: 20px;
  margin-bottom: 8px;
  color: var(--primary-dark);
}

.module-card p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  flex: 1;
}

.module-arrow {
  margin-top: 16px;
  font-size: 14px;
  color: var(--primary);
  font-weight: 600;
}

/* ===== Gallery ===== */
.gallery-section {
  background: var(--bg-light);
  padding: 60px 0;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.gallery-item {
  text-align: center;
}

.placeholder-img {
  aspect-ratio: 4/3;
  background: var(--bg-white);
  border: 2px dashed var(--border);
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 13px;
  transition: border-color 0.2s;
}

.placeholder-img:hover {
  border-color: var(--primary-light);
}

.gallery-caption {
  margin-top: 10px;
  font-size: 13px;
  color: var(--text-secondary);
}

/* ===== Timeline ===== */
.timeline-section {
  background: var(--bg-white);
  padding: 60px 0;
}

.practice-timeline {
  max-width: 700px;
  margin: 0 auto;
}

.tl-item {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

.tl-marker {
  flex-shrink: 0;
  width: 72px;
  height: 40px;
  background: var(--primary);
  color: #fff;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
}

.tl-content {
  padding-top: 4px;
}

.tl-content h4 {
  font-size: 17px;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.tl-content p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .hero-title { font-size: 30px; }
  .hero-stats { gap: 24px; flex-wrap: wrap; }
  .stat-num { font-size: 24px; }
  .module-cards { grid-template-columns: 1fr; }
  .gallery-grid { grid-template-columns: repeat(2, 1fr); }
  .tl-marker { width: 56px; font-size: 11px; }
}
</style>
