<template>
  <div class="archive-page content-wrap">
    <header class="archive-intro"><div><p class="eyebrow">保护工作记录</p><h1>护江档案</h1><p>巡护、监测、净滩和自然教育的工作记录。<br/>可按分类、年份或关键词查阅，照片与资料出处随条目保留。</p></div><div class="archive-total"><strong>{{ store.published.length }}</strong>份记录 · 持续归档</div></header>
    <p class="archive-history-link"><router-link to="/records/history"><ConservationIcon name="calendar" />按年份回看三年巡护（2024—2026）<ConservationIcon name="arrow" /></router-link></p>
    <section class="patrol-stats" aria-label="巡护统计">
      <div class="patrol-stats-head"><ConservationIcon name="patrol"/><span>巡护力量 · 现场记录口径</span></div>
      <div class="patrol-stats-grid">
        <div><p class="stat-value"><strong>{{ patrolStats.distance }}</strong><em>km</em></p><span>累计巡护里程</span></div>
        <div><p class="stat-value"><strong>{{ patrolStats.hours }}</strong><em>小时</em></p><span>累计巡护时长</span></div>
        <div><p class="stat-value"><strong>{{ patrolStats.participants }}</strong><em>人次</em></p><span>累计参与人次</span></div>
        <div><p class="stat-value"><strong>{{ patrolStats.count }}</strong><em>条</em></p><span>归档巡护记录</span></div>
      </div>
      <p class="patrol-stats-note">统计取自本页已发布的巡护保护现场记录；未测量、未核实的数字不纳入，正式发布前以协会实际台账核对。</p>
    </section>
    <div class="archive-categories" aria-label="按行动分类筛选">
      <button class="category-filter" :class="{ active: category === 'all' }" :aria-pressed="category === 'all'" @click="category = 'all'"><ConservationIcon name="file"/><span>全部记录</span><small>{{ store.published.length }}</small></button>
      <button v-for="item in CATEGORIES" :key="item.id" class="category-filter" :class="{ active: category === item.id }" :aria-pressed="category === item.id" @click="category = item.id"><ConservationIcon :name="item.icon"/><span>{{ item.name }}</span><small>{{ countCategory(item.id) }}</small></button>
    </div>
    <div class="archive-toolbar">
      <label class="archive-search"><ConservationIcon name="search"/><input v-model="search" type="search" name="record-search" autocomplete="off" aria-label="搜索护江记录" placeholder="搜索标题、地点或关键词…" /></label>
      <select v-model="year" aria-label="记录年份"><option value="all">全部年份</option><option v-for="item in store.years" :key="item" :value="item">{{ item }}年</option></select>
      <select v-model="kind" aria-label="资料类型"><option value="all">全部资料类型</option><option v-for="(label, value) in KIND_LABELS" :key="value" :value="value">{{ label }}</option></select>
      <button class="outline-button" @click="exportFiltered"><ConservationIcon name="download"/>导出记录表</button>
    </div>
    <div class="archive-results-meta" aria-live="polite"><span>找到 {{ filtered.length }} 份记录</span><button v-if="hasFilter" class="archive-reset" @click="resetFilters">清除筛选</button></div>
    <div v-if="filtered.length" class="record-grid"><ConservationCard v-for="record in pageRecords" :key="record.id" :record="record"/></div>
    <section v-else class="archive-empty"><ConservationIcon name="search"/><h2>还没有找到对应的记录</h2><p>试试其他关键词，或查看全部档案。</p><button class="outline-button" @click="resetFilters">查看全部记录</button></section>
    <div v-if="filtered.length > pageSize" class="archive-pagination"><el-pagination v-model:current-page="page" :page-size="pageSize" :total="filtered.length" layout="prev, pager, next" background /></div>
    <p class="archive-source-note">档案区分协会原始档案、实践现场记录与公开报道整理；每条记录可查看时间口径与资料出处。部分巡护记录使用开放许可的洞庭湖资料图，非当日现场影像。</p>
    <details class="archive-credits">
      <summary>图片来源与许可（{{ IMAGE_CREDITS.length }} 张 · Wikimedia Commons）</summary>
      <ul>
        <li v-for="item in IMAGE_CREDITS" :key="item.file">
          <a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.name }}</a>
          <span>{{ item.license }} · 摄影 {{ item.author }}</span>
        </li>
      </ul>
    </details>
  </div>
</template>
<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConservationIcon from '../components/ConservationIcon.vue'
import ConservationCard from '../components/ConservationCard.vue'
import { useConservationStore } from '../stores/conservation'
import { CATEGORIES, KIND_LABELS, recordsToCsv, downloadText } from '../lib/conservation'
import IMAGE_CREDITS from '../data/image-credits.js'
const store = useConservationStore()
const route = useRoute(), router = useRouter()
const category = ref(CATEGORIES.some(item => item.id === route.query.category) ? route.query.category : 'all')
const year = ref(typeof route.query.year === 'string' ? route.query.year : 'all')
const kind = ref(Object.hasOwn(KIND_LABELS, route.query.kind) ? route.query.kind : 'all')
const search = ref(typeof route.query.q === 'string' ? route.query.q : '')
const page = ref(1), pageSize = 9
const patrolStats = computed(() => {
  const patrols = store.published.filter(record => record.category === 'patrol' && record.kind === 'field')
  const sum = key => patrols.reduce((total, record) => total + (Number(record.metrics?.[key]) || 0), 0)
  return {
    distance: Math.round(sum('distanceKm')),
    hours: Math.round(sum('durationHours') * 10) / 10,
    participants: Math.round(sum('participants')),
    count: patrols.length,
  }
})
const filtered = computed(() => {
  const term = search.value.trim().toLocaleLowerCase()
  return store.published.filter(record => (category.value === 'all' || record.category === category.value)
    && (year.value === 'all' || record.date.startsWith(year.value))
    && (kind.value === 'all' || record.kind === kind.value)
    && (!term || [record.title, record.summary, record.location, ...(record.tags || [])].join(' ').toLocaleLowerCase().includes(term)))
})
const pageRecords = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))
const hasFilter = computed(() => category.value !== 'all' || year.value !== 'all' || kind.value !== 'all' || !!search.value)
const countCategory = id => store.published.filter(record => record.category === id).length
function resetFilters() { category.value = year.value = kind.value = 'all'; search.value = '' }
function exportFiltered() { downloadText(recordsToCsv(filtered.value), '护江档案_筛选记录.csv', 'text/csv') }
let pending
watch([category, year, kind, search], () => {
  page.value = 1
  clearTimeout(pending)
  pending = setTimeout(() => {
    const query = {}
    if (category.value !== 'all') query.category = category.value
    if (year.value !== 'all') query.year = year.value
    if (kind.value !== 'all') query.kind = kind.value
    if (search.value) query.q = search.value
    router.replace({ path: '/records', query })
  }, 200)
})
onBeforeUnmount(() => clearTimeout(pending))
</script>
