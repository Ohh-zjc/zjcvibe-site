<template>
  <div class="page-container dashboard-page">
    <h2 class="section-title">📊 数据看板</h2>
    <p class="section-subtitle">现场水样快检 · 江豚保护记录 · 公开生态背景</p>

    <section class="dashboard-section">
      <div class="section-heading">
        <div>
          <p class="section-kicker">2026 年实践现场快检</p>
          <h3>洞庭湖水样记录</h3>
        </div>
        <span class="section-meta">定性与便携仪器快检结果</span>
      </div>

      <div class="stat-cards">
        <article class="stat-card data-card">
          <div class="stat-icon stat-icon--blue">💧</div>
          <div class="stat-info"><span class="stat-val">{{ sample.tds }}</span><span class="stat-unit">mg/L</span><span class="stat-lbl">TDS（溶解性总固体）</span></div>
        </article>
        <article class="stat-card data-card">
          <div class="stat-icon stat-icon--green">⚗️</div>
          <div class="stat-info"><span class="stat-val">{{ sample.ph }}</span><span class="stat-lbl">pH 现场判定</span></div>
        </article>
        <article class="stat-card data-card">
          <div class="stat-icon stat-icon--amber">🧪</div>
          <div class="stat-info"><span class="stat-val">{{ sample.residualChlorine }}</span><span class="stat-lbl">余氯含量</span></div>
        </article>
        <article class="stat-card data-card">
          <div class="stat-icon stat-icon--porpoise">🐬</div>
          <div class="stat-info"><span class="stat-val">{{ porpoise.dongtingCount }}</span><span class="stat-unit">头</span><span class="stat-lbl">洞庭湖江豚记录</span></div>
        </article>
      </div>
    </section>

    <section class="dashboard-section data-card sample-detail">
      <div class="sample-summary">
        <span class="summary-icon">🔬</span>
        <div>
          <p class="section-kicker">水样快检</p>
          <h3>矿物元素检出</h3>
          <p>{{ sample.location }}。已检出钙、镁、锌等元素；余氯为低检出，pH 呈弱碱性。</p>
        </div>
      </div>
      <div class="mineral-list" aria-label="水样检出元素">
        <span v-for="mineral in sample.minerals" :key="mineral" class="mineral-tag">{{ mineral }} · 检出</span>
      </div>
    </section>

    <section class="dashboard-section">
      <div class="section-heading">
        <div>
          <p class="section-kicker">保护动态</p>
          <h3>江豚观察与科学考察背景</h3>
        </div>
        <span class="section-meta">现场记录与公开调查口径分列展示</span>
      </div>
      <div class="porpoise-grid">
        <article class="porpoise-card porpoise-card--local data-card">
          <span class="porpoise-card__label">洞庭湖江豚现有记录</span>
          <div class="porpoise-card__number">{{ porpoise.dongtingCount }}<small>头</small></div>
          <p>{{ porpoise.dongtingNote }}</p>
        </article>
        <article class="porpoise-card data-card">
          <span class="porpoise-card__label">长江江豚科学考察结果</span>
          <div class="porpoise-card__number">{{ porpoise.nationalSurveyCount }}<small>头</small></div>
          <p>{{ porpoise.nationalSurveyNote }}</p>
        </article>
      </div>
    </section>

    <section class="dashboard-section data-card data-note">
      <h3>数据说明</h3>
      <p>现场水样数据由实践团队使用便携设备快检获得，用于实践记录与生态科普，不替代具备资质的实验室检测报告或水环境质量评价。</p>
      <p>公开背景数据：2022 年长江江豚科学考察结果为 1,249 头，结果于 2023 年由农业农村部、生态环境部、国家林草局和中国科学院联合发布，是目前公开发布的最近一轮完整科学考察口径。</p>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDataStore } from '../stores/data'

const dataStore = useDataStore()
const dashboard = computed(() => dataStore.dashboard)
const sample = computed(() => dashboard.value.field_sample)
const porpoise = computed(() => dashboard.value.porpoise)
</script>

<style scoped>
.dashboard-page { padding-bottom: 20px; }
.dashboard-section { margin-bottom: 34px; }
.section-heading { display: flex; justify-content: space-between; align-items: end; gap: 18px; margin-bottom: 14px; }
.section-kicker { margin-bottom: 4px; color: var(--primary); font-size: 13px; font-weight: 700; }
.section-heading h3, .sample-detail h3, .data-note h3 { color: var(--text-primary); font-size: 20px; }
.section-meta { color: var(--text-muted); font-size: 12px; text-align: right; }

.stat-cards { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
.stat-card { min-height: 124px; padding: 20px; display: flex; align-items: center; gap: 14px; }
.stat-icon { width: 50px; height: 50px; flex: 0 0 50px; display: grid; place-items: center; font-size: 23px; }
.stat-icon--blue { background: #e5f4fb; }.stat-icon--green { background: #e8f7ec; }.stat-icon--amber { background: #fff2df; }.stat-icon--porpoise { background: #f3e8fa; }
.stat-info { min-width: 0; }.stat-val { color: var(--text-primary); font-size: 25px; font-weight: 750; }.stat-unit { margin-left: 4px; color: var(--text-secondary); font-size: 13px; }.stat-lbl { display: block; margin-top: 4px; color: var(--text-secondary); font-size: 12px; line-height: 1.35; }

.sample-detail { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(240px, 0.7fr); gap: 24px; padding: 26px; }
.sample-summary { display: flex; align-items: flex-start; gap: 14px; }.summary-icon { display: grid; width: 44px; height: 44px; flex: 0 0 44px; place-items: center; background: #e8f4f8; font-size: 22px; }.sample-summary p { margin-top: 7px; color: var(--text-secondary); font-size: 14px; line-height: 1.7; }
.mineral-list { display: flex; align-content: center; align-items: center; justify-content: flex-end; gap: 10px; flex-wrap: wrap; }.mineral-tag { padding: 7px 10px; border: 1px solid #cbe1e9; background: #f4fafc; color: #17617e; font-size: 13px; font-weight: 600; }

.porpoise-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }.porpoise-card { padding: 26px; border-top: 3px solid #277eab; }.porpoise-card--local { border-top-color: #cf7c25; }.porpoise-card__label { color: var(--text-secondary); font-size: 13px; }.porpoise-card__number { margin: 10px 0 8px; color: var(--text-primary); font-size: 38px; font-weight: 800; line-height: 1; }.porpoise-card__number small { margin-left: 4px; color: var(--text-secondary); font-size: 15px; font-weight: 600; }.porpoise-card p { color: var(--text-secondary); font-size: 13px; line-height: 1.65; }

.data-note { padding: 24px 26px; border-left: 3px solid var(--primary); }.data-note p { margin-top: 9px; color: var(--text-secondary); font-size: 13px; line-height: 1.75; }

@media (max-width: 900px) { .stat-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }.sample-detail { grid-template-columns: 1fr; }.mineral-list { justify-content: flex-start; } }
@media (max-width: 640px) { .section-heading { align-items: start; flex-direction: column; gap: 5px; }.section-meta { text-align: left; }.stat-card { padding: 16px; }.porpoise-grid { grid-template-columns: 1fr; }.sample-detail { padding: 20px; }.porpoise-card { padding: 20px; } }
</style>
