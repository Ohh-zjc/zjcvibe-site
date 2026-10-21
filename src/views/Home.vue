<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section v-ripple class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="hero-icon">🌊</span>
          智护碧水·数绘洞庭
        </h1>
        <p class="hero-subtitle">湖北大学计算机学院、湖南理工大学化学化工学院2026年暑期社会实践数据平台</p>
        <p class="hero-desc">
          2026年7月，湖北大学计算机学院“数智护江·绿美长江”实践团队赴岳阳洞庭湖流域，
          开展水上巡护、水质检测、问卷访谈、自然教育与清滩护岸等活动。
          平台整理现场影像、工作记录和公开资料，供保护协会持续记录与科普展示。
        </p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-num">7</span>
            <span class="stat-label">天实地调研</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">{{ dataStore.interviews.length }}</span>
            <span class="stat-label">位口述史人物</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">{{ dataStore.geo.points.length }}</span>
            <span class="stat-label">个岸线点位</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">{{ conservation.published.length }}</span>
            <span class="stat-label">份护江记录</span>
          </div>
        </div>
        <div class="hero-actions">
          <router-link class="hero-cta primary" to="/dashboard">
            进入数据看板
            <el-icon><ArrowRight /></el-icon>
          </router-link>
          <router-link class="hero-cta ghost" to="/records">翻阅护江档案</router-link>
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

    <HomeLower ref="homeLower" :timeline="timeline" />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useDataStore } from '../stores/data'
import { useConservationStore } from '../stores/conservation'

const dataStore = useDataStore()
const conservation = useConservationStore()
import { ArrowDown, ArrowRight } from '@element-plus/icons-vue'
import HomeLower from '../components/HomeLower.vue'

const homeLower = ref(null)

function scrollToModules() {
  homeLower.value?.scrollToStart()
}

const timeline = [
  { day: 'Day 1', weekday: '周一', title: '实践对接与调研任务协调', desc: '与渔政、保护协会、社区及合作实践团队负责人逐一对接，确认走访时间、人员分工、船只安排和资料采集边界，完成七天调研计划与安全提示的统一。' },
  { day: 'Day 2', weekday: '周二', title: '生态展陈研学与幼儿江豚自然教育', desc: '上午走访生态展陈馆，梳理洞庭湖流域生态保护与自然教育素材；下午赴幼儿园开展江豚主题宣教、互动问答与手作体验。' },
  { day: 'Day 3', weekday: '周三', title: '渔政执法协同调研与水域巡护观测', desc: '走访渔政执法局和生态数据中心，了解禁渔监管、数据监测与江豚保护机制；随执法船开展重点水域巡护与现场观察。' },
  { day: 'Day 4', weekday: '周四', title: '生态认知问卷与无人机航测采集', desc: '开展生态保护认知问卷，采集公众反馈；实施重点水域无人机航拍，记录岸线形态与水域环境影像。' },
  { day: 'Day 5', weekday: '周五', title: '退捕渔民访谈与社区生态对话', desc: '访谈渔民，记录生产生活转型与禁渔后的生态感受；走进社区开展长江保护议题对话与口述资料采集。' },
  { day: 'Day 6', weekday: '周六', title: '江豚保护协作调研与净滩志愿服务', desc: '走访岳阳市江豚保护协会，了解民间保护、巡护与宣教机制；开展清滩行动，分类记录沿岸垃圾。' },
  { day: 'Day 7', weekday: '周日', title: '材料汇总与成果整理', desc: '集中整理问卷、访谈转写、航拍影像、巡护记录和现场照片，复核地点、时间与来源信息，形成可用于平台展示和后续汇报的成果清单。' },
]
</script>

<style scoped>

/* Original homepage composition and colours, isolated from content-page styling. */
.home-page {
  --primary: #2E86AB;
  --primary-light: #4DA8C9;
  --primary-dark: #1B5E7A;
  --accent-light: #F4A83D;
  --bg-light: #F0F7FA;
  --text-primary: #2C3E50;
  --text-secondary: #5A6C7D;
  --border: #DDE8ED;
  --radius: 12px;
  --font-editorial: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}
.home-page .hero > :deep(.water-feedback-ring) { color: #e2f8ff; z-index: 2; }
.home-page .module-card > :deep(.water-feedback-ring) { color: #5babc9; }
.home-page .gallery-item { border-radius: var(--radius); }
@media(max-width:500px) {
  .home-page .hero-stats { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px 28px; max-width:310px; margin-inline:auto; }
  .home-page .hero-subtitle { font-size:15px; }
  .home-page .hero-desc { font-size:14px; }
}

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

.hero-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(115deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 46px),
    repeating-linear-gradient(25deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 62px);
  opacity: 0.85;
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
  max-width: 860px;
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
  font-size: 15px;
  opacity: 0.74;
  line-height: 1.85;
  max-width: 600px;
  margin: 0 auto 36px;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 0;
  max-width: 760px;
  margin: 0 auto;
  padding: 20px 0 4px;
  border-top: 1px solid rgba(255,255,255,0.18);
  border-bottom: 1px solid rgba(255,255,255,0.12);
}

.stat-item {
  position: relative;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
}

.stat-item + .stat-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: rgba(255,255,255,0.22);
}

.stat-num {
  font-size: 50px;
  line-height: 1.05;
  font-weight: 800;
  color: var(--accent-light);
  font-variant-numeric: tabular-nums;
  text-shadow: 0 8px 26px rgba(0,0,0,0.28);
}

.stat-label {
  margin-top: 9px;
  font-size: 13.5px;
  letter-spacing: 0.6px;
  opacity: 0.88;
}

.hero-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 38px;
}

.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: transform 0.25s, box-shadow 0.25s, background 0.25s;
}

.hero-cta .el-icon { font-size: 15px; }

.hero-cta.primary {
  background: #fff;
  color: #14536c;
  box-shadow: 0 12px 28px rgba(3,26,38,0.28);
}

.hero-cta.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 34px rgba(3,26,38,0.34);
}

.hero-cta.ghost {
  color: #fff;
  border: 1px solid rgba(255,255,255,0.55);
}

.hero-cta.ghost:hover {
  background: rgba(255,255,255,0.13);
  border-color: rgba(255,255,255,0.8);
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

@media (prefers-reduced-motion: reduce) {
  .hero-scroll { animation: none; }
}
@media (max-width: 768px) {
  .hero-title { font-size: 30px; }
  .hero-stats { flex-wrap: wrap; gap: 20px 0; padding: 16px 0 2px; }
  .stat-item { flex: 0 0 50%; padding: 0 8px; }
  .stat-item:nth-child(3)::before { display: none; }
  .stat-num { font-size: 34px; }
  .stat-label { font-size: 12px; margin-top: 5px; }
  .hero-actions { margin-top: 28px; gap: 10px; }
  .hero-cta { padding: 12px 22px; font-size: 14px; }
}
</style>
