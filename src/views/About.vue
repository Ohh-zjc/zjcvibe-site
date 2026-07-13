<template>
  <div class="page-container">
    <h2 class="section-title">🙋 关于本项目</h2>
    <p class="section-subtitle">湖北大学计算机学院 · 智护碧水小分队 · 2026暑期社会实践</p>

    <!-- 项目简介 -->
    <section class="about-section">
      <div class="about-card data-card">
        <h3>项目简介</h3>
        <p>
          2026年7月，湖北大学计算机学院「智护碧水」社会实践小分队赴湖南省岳阳市洞庭湖流域，
          开展了为期6天的暑期社会实践活动。我们以"数字技术守护一江碧水"为核心理念，
          综合运用卫星遥感反演、无人机航拍、GIS空间分析、NLP自然语言处理等计算机技术手段，
          对洞庭湖流域的生态环境进行了多维度数据采集与分析。
        </p>
        <p>
          实践过程中，我们采访了城陵矶水文站退休职工、东洞庭湖自然保护区巡护员、退捕渔民、
          渔政执法人员等多位"护江者"，记录下珍贵的长江生态保护口述历史；跟随渔政执法船实地巡护，
          用无人机拍摄华龙码头等关键岸线点位的高清现状影像；在沿江社区和户外课堂为孩子们带来
          AI绘本《守护一江碧水》和长江生态知识答题活动。
        </p>
        <p>
          本平台将所有采集到的多源数据进行整合展示，以期为长江大保护提供量化依据，
          让更多人了解洞庭湖生态保护的最新进展。我们相信，代码可以书写责任，数据能够守护碧水。
        </p>
      </div>
    </section>

    <!-- 团队成员 -->
    <section class="about-section">
      <h3>团队成员</h3>
      <div class="team-grid">
        <div class="team-card data-card" v-for="m in members" :key="m.name">
          <div class="team-avatar placeholder-img">
            <el-icon :size="40"><UserFilled /></el-icon>
          </div>
          <h4>{{ m.name }}</h4>
          <span class="team-role">{{ m.role }}</span>
          <p class="team-task">{{ m.task }}</p>
        </div>
      </div>
    </section>

    <!-- 实践日志 -->
    <section class="about-section">
      <h3>实践日志</h3>
      <div class="log-timeline">
        <div class="log-item" v-for="(day, i) in logDays" :key="i">
          <div class="log-date">{{ day.day }}</div>
          <div class="log-card data-card">
            <div class="log-img placeholder-img">
              <el-icon :size="28"><PictureFilled /></el-icon>
            </div>
            <div class="log-body">
              <h4>{{ day.title }}</h4>
              <p>{{ day.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 致谢 -->
    <section class="about-section">
      <h3>致谢</h3>
      <div class="thanks-grid">
        <div class="thanks-card data-card" v-for="t in thanks" :key="t">
          <p>{{ t }}</p>
        </div>
      </div>
    </section>

    <!-- 指导教师 -->
    <section class="about-section">
      <h3>指导教师</h3>
      <div class="advisor-card data-card">
        <div class="advisor-avatar placeholder-img">
          <el-icon :size="36"><UserFilled /></el-icon>
        </div>
        <div>
          <h4>（待填）</h4>
          <p>湖北大学计算机学院</p>
        </div>
      </div>
    </section>

    <!-- 二维码 -->
    <section class="about-section qr-section">
      <h3>扫码访问</h3>
      <div class="qr-card data-card">
        <a
          class="qr-image-link"
          :href="siteUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="扫码或点击访问智护碧水·数绘洞庭平台"
        >
          <img class="qr-image" :src="qrCodeSrc" alt="访问 zjcvibe.xyz 的二维码" />
        </a>
        <p>扫描二维码即可访问本平台</p>
        <a class="qr-url" :href="siteUrl" target="_blank" rel="noopener noreferrer">zjcvibe.xyz</a>
      </div>
    </section>
  </div>
</template>

<script setup>
import { UserFilled, PictureFilled } from '@element-plus/icons-vue'

const siteUrl = 'https://zjcvibe.xyz/'
const qrCodeSrc = `${import.meta.env.BASE_URL}img/site-qr.png`

const members = [
  { name: '（前端A · 待填）', role: '前端开发', task: 'Vue 3 + Vite 脚手架、组件开发、ECharts 图表' },
  { name: '（前端B · 待填）', role: '前端开发', task: 'Leaflet 地图组件、UI样式、移动端适配' },
  { name: '（数据负责人 · 待填）', role: '数据处理', task: 'Sentinel-2 影像处理、数据JSON编写' },
  { name: '（口述史负责人 · 待填）', role: '采访 & 转写', task: '口述史采访、AI转写校对' },
  { name: '（影像负责人 · 待填）', role: '影像采集', task: '无人机航拍、照片整理' },
  { name: '（课堂负责人 · 待填）', role: '社区课堂', task: '绘本教学、答题互动组织' },
]

const logDays = [
  { day: 'Day 1', title: '抵达岳阳 · 对接水文站', desc: '抵达岳阳，与城陵矶水文站对接，了解洞庭湖水文监测体系与历史数据。' },
  { day: 'Day 2', title: '口述史采集（一）', desc: '采访城陵矶水文站退休职工和东洞庭湖湿地巡护员，记录长江水文变迁与湿地保护口述历史。' },
  { day: 'Day 3', title: '口述史采集（二）', desc: '走访退捕渔民和沿江社区居民，记录禁渔前后的生态变化与岸线变迁口述史。' },
  { day: 'Day 4', title: '岸线巡护 · 航拍采集', desc: '跟随渔政执法船巡护洞庭湖水域，无人机航拍华龙码头、城陵矶等关键岸线点位。清滩活动数据采集。' },
  { day: 'Day 5', title: '童护长江 · 社区课堂', desc: '在岳阳沿江社区和华龙码头（江豚湾）开设生态课堂，教授AI绘本《守护一江碧水》，组织生态知识答题。' },
  { day: 'Day 6', title: '数据汇总 · 返程', desc: '整理全部采集数据，补拍收尾影像，与当地单位交接，返程。' },
]

const thanks = [
  '城陵矶水文站',
  '东洞庭湖国家级自然保护区管理局',
  '岳阳市江豚保护协会',
  '岳阳县渔政执法局',
  '岳阳沿江社区居委会',
  '所有接受采访的护江者',
]
</script>

<style scoped>
.about-section {
  margin-bottom: 48px;
}

.about-section h3 {
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--primary-light);
  display: inline-block;
}

/* 简介 */
.about-card { padding: 32px; }

.about-card p {
  font-size: 15px;
  line-height: 2;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.about-card p:last-child { margin-bottom: 0; }

/* 团队 */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.team-card {
  padding: 24px 16px;
  text-align: center;
}

.team-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.placeholder-img {
  background: var(--bg-light);
  border: 2px dashed var(--border);
}

.team-card h4 {
  font-size: 15px;
  margin-bottom: 4px;
}

.team-role {
  font-size: 12px;
  color: var(--primary);
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
}

.team-task {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
}

/* 日志 */
.log-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.log-item {
  display: flex;
  gap: 16px;
}

.log-date {
  width: 64px;
  height: 36px;
  background: var(--primary);
  color: #fff;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}

.log-card {
  flex: 1;
  padding: 16px;
  display: flex;
  gap: 16px;
  align-items: center;
}

.log-img {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.log-body h4 {
  font-size: 16px;
  margin-bottom: 4px;
}

.log-body p {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 致谢 */
.thanks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.thanks-card {
  padding: 20px;
  text-align: center;
  font-size: 15px;
  color: var(--text-secondary);
}

/* 教师 */
.advisor-card {
  padding: 24px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.advisor-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  flex-shrink: 0;
}

.advisor-card h4 { font-size: 18px; margin-bottom: 4px; }
.advisor-card p { font-size: 14px; color: var(--text-secondary); }

/* 二维码 */
.qr-section { text-align: center; }

.qr-card {
  display: inline-block;
  padding: 32px 48px;
  text-align: center;
}

.qr-image-link {
  display: block;
  width: max-content;
  margin: 0 auto 12px;
}

.qr-image {
  width: 184px;
  height: 184px;
  display: block;
  padding: 8px;
  border: 1px solid var(--border);
  background: #fff;
  image-rendering: pixelated;
}

.qr-image-link:focus-visible {
  outline: 3px solid rgba(46, 134, 171, 0.4);
  outline-offset: 4px;
}

.qr-card p {
  font-size: 14px;
  color: var(--text-secondary);
}

.qr-url {
  display: inline-block;
  margin-top: 5px;
  font-size: 13px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .log-item { flex-direction: column; }
  .log-date { width: 100%; border-radius: 8px; }
}
</style>
