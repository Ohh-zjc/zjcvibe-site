<template>
  <div class="page-container">
    <h2 class="section-title">🙋 关于本项目</h2>
    <p class="section-subtitle">湖北大学计算机学院 × 湖南理工大学化学化工学院 · 2026暑期社会实践</p>

    <!-- 合作团队 -->
    <section class="about-section">
      <h3>合作实践团队</h3>
      <div class="partner-grid">
        <article class="partner-card data-card">
          <div class="team-photo team-photo--placeholder" aria-label="湖北大学团队合影待补充">
            <el-icon :size="36"><PictureFilled /></el-icon>
            <span>团队合影待补充</span>
          </div>
          <div class="partner-body">
            <p class="partner-school">湖北大学计算机学院</p>
            <h4>“智护碧水”社会实践小分队</h4>
            <p>2026年7月，湖北大学计算机学院「智护碧水」社会实践小分队赴湖南省岳阳市洞庭湖流域，开展了为期5天的暑期社会实践活动。我们以“数字技术守护一江碧水”为核心理念，综合运用卫星遥感反演、无人机航拍、GIS空间分析，对洞庭湖流域的生态环境进行了多维度数据采集与分析。</p>
            <p>实践过程中，我们走访生态展陈馆、渔政执法局、生态数据中心和岳阳市江豚保护协会，访谈退捕渔民、社区居民与渔政执法人员，记录长江生态保护口述资料；随执法船开展重点水域巡护，以问卷调研、无人机航测和清滩分类记录采集多源生态数据；在幼儿园开展江豚主题自然教育与手作体验活动。</p>
            <p>本平台将所有采集到的多源数据进行整合展示，以期为长江大保护提供量化依据，让更多人了解洞庭湖生态保护的最新进展。我们相信，代码可以书写责任，数据能够守护碧水。</p>
          </div>
        </article>

        <article class="partner-card data-card">
          <img class="team-photo" :src="hunanIstTeamPhoto" alt="湖南理工大学化学化工学院护豚逐浪，碧水长漾实践团队合影" />
          <div class="partner-body">
            <p class="partner-school">湖南理工大学化学化工学院</p>
            <h4>“护豚逐浪，碧水长漾”三下乡实践团队</h4>
            <p>以“研究洞庭湖湿地生态，宣传湿地保护知识，提高大学生湿地保护意识”为宗旨，聚焦洞庭湖生态保护与修复。</p>
            <p>团队成员均来自化学化工学院，依托实验室技术开展水质检测，为水质评估提供科学数据支持。</p>
            <p>团队通过实地调研、净滩行动及深度访谈，记录退捕渔民转型故事与社区观念变迁，展现“人退鱼进”的生态图景，助力生态文明理念落地生根。</p>
          </div>
        </article>
      </div>
    </section>

    <!-- 实践日志 -->
    <section class="about-section">
      <h3>实践日志</h3>
      <div class="log-timeline">
        <div class="log-item" v-for="(day, i) in logDays" :key="i">
          <div class="log-date"><span>{{ day.day }}</span><small>{{ day.weekday }}</small></div>
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
    <section class="about-section qr-section" aria-label="网站访问二维码">
      <div class="qr-card">
        <a
          class="qr-image-link"
          :href="siteUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="扫码或点击访问智护碧水·数绘洞庭平台"
        >
          <img class="qr-image" :src="qrCodeSrc" alt="访问智护碧水·数绘洞庭平台的二维码" />
        </a>
      </div>
    </section>
  </div>
</template>

<script setup>
import { UserFilled, PictureFilled } from '@element-plus/icons-vue'

const siteUrl = 'https://zjcvibe.xyz/'
const qrCodeSrc = `${import.meta.env.BASE_URL}img/site-qr.png`
const hunanIstTeamPhoto = `${import.meta.env.BASE_URL}img/about/hunan-ist-team.webp`

const logDays = [
  { day: 'Day 1', weekday: '周二', title: '生态展陈研学与幼儿江豚自然教育', desc: '上午走访生态展陈馆，梳理洞庭湖流域生态保护与自然教育素材；下午赴幼儿园开展江豚主题宣教、互动问答与手作体验。' },
  { day: 'Day 2', weekday: '周三', title: '渔政执法协同调研与水域巡护观测', desc: '走访渔政执法局和生态数据中心，了解禁渔监管、数据监测与江豚保护机制；随执法船开展重点水域巡护与现场观察。' },
  { day: 'Day 3', weekday: '周四', title: '生态认知问卷与无人机航测采集', desc: '开展生态保护认知问卷，采集公众反馈；实施重点水域无人机航拍，记录岸线形态与水域环境影像。' },
  { day: 'Day 4', weekday: '周五', title: '退捕渔民访谈与社区生态对话', desc: '访谈渔民，记录生产生活转型与禁渔后的生态感受；走进社区开展长江保护议题对话与口述资料采集。' },
  { day: 'Day 5', weekday: '周六', title: '江豚保护协作调研与净滩志愿服务', desc: '走访岳阳市江豚保护协会，了解民间保护、巡护与宣教机制；开展清滩行动，分类记录沿岸垃圾。' },
]

const thanks = [
  '渔政综合行政执法局',
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

/* 合作团队 */
.partner-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.partner-card {
  overflow: hidden;
}

.team-photo {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-bottom: 1px solid var(--border);
}

.team-photo--placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  color: var(--text-muted);
  background: #eef6f8;
  border-bottom: 1px dashed var(--border);
  font-size: 14px;
}

.partner-body { padding: 22px; }
.partner-school { margin-bottom: 4px; color: var(--primary); font-size: 13px; font-weight: 700; }
.partner-body h4 { margin-bottom: 12px; color: var(--text-primary); font-size: 18px; line-height: 1.45; }
.partner-body p:not(.partner-school) { margin-top: 10px; color: var(--text-secondary); font-size: 14px; line-height: 1.8; }
.partner-body p:not(.partner-school):first-of-type { margin-top: 0; }

.placeholder-img {
  background: var(--bg-light);
  border: 2px dashed var(--border);
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
  height: 44px;
  background: var(--primary);
  color: #fff;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
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
.qr-section {
  margin-top: 8px;
  text-align: center;
}

.log-date small { margin-top: 1px; font-size: 10px; font-weight: 500; opacity: 0.85; }

.qr-card {
  display: inline-block;
  padding: 14px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.72);
  box-shadow: 0 2px 10px rgba(46,134,171,0.06);
  text-align: center;
}

.qr-image-link {
  display: block;
  width: max-content;
  margin: 0 auto;
}

.qr-image {
  width: 172px;
  height: 172px;
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

@media (max-width: 768px) {
  .partner-grid { grid-template-columns: 1fr; }
  .log-item { flex-direction: column; }
  .log-date { width: 100%; border-radius: 8px; }
}
</style>
