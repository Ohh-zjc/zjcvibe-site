<template>
  <div class="history-page content-wrap">
    <header class="history-intro">
      <div>
        <p class="eyebrow">2024 — 2026 · 巡护工作回顾</p>
        <h1>三年巡护，一条一条记下来</h1>
        <p>从 2024 年 1 月的第一次冬季巡护，到 2026 年 9 月的秋季例行巡查，协会在洞庭湖留下了 {{ stats.count }} 条可查的巡护记录。<br />这里按年份、月份和工作类型把这批记录重新串起来，看清巡护队一年到头在做什么、在哪些水域、发现问题怎么处理。</p>
      </div>
      <div class="history-total"><strong>{{ stats.range }}</strong><span>巡护记录覆盖期</span></div>
    </header>

    <section class="history-stats" aria-label="巡护工作量化">
      <div><p><strong>{{ stats.count }}</strong><em>次</em></p><span>归档巡护</span></div>
      <div><p><strong>{{ stats.distance }}</strong><em>km</em></p><span>累计里程</span></div>
      <div><p><strong>{{ stats.hours }}</strong><em>小时</em></p><span>累计时长</span></div>
      <div><p><strong>{{ stats.participants }}</strong><em>人次</em></p><span>参与人次</span></div>
      <div><p><strong>{{ stats.porpoise }}</strong><em>次</em></p><span>江豚观察记录</span></div>
      <div><p><strong>{{ stats.joint }}</strong><em>次</em></p><span>与渔政联合行动</span></div>
    </section>

    <p class="history-scope">统计口径：2024 年 1 月至 2026 年 9 月，仅计「护江档案」中已发布的巡护现场记录；一条记录可同时涉及多项工作，六类工作按记录主题归类，合计等于记录总数。</p>

    <section class="history-charts">
      <article class="chart-card">
        <div class="chart-head"><h2>每年的巡护节奏</h2><span>次数与里程</span></div>
        <VChart class="chart" :option="annualOption" autoresize />
        <p class="chart-note">{{ annualTakeaway }}</p>
      </article>
      <article class="chart-card">
        <div class="chart-head"><h2>一年里哪几个月在湖上</h2><span>按月份统计次数</span></div>
        <VChart class="chart" :option="monthOption" autoresize />
        <p class="chart-note">{{ monthTakeaway }}</p>
      </article>
    </section>

    <section class="history-themes" aria-labelledby="themes-heading">
      <div class="editorial-heading">
        <h2 id="themes-heading">巡护队在做的六件事</h2>
        <span class="heading-aside">按记录主题归类</span>
      </div>
      <div class="theme-grid">
        <article v-for="theme in themes" :key="theme.id" class="theme-card">
          <div class="theme-top"><ConservationIcon :name="theme.icon" /><span>{{ theme.count }} 次</span></div>
          <h3>{{ theme.name }}</h3>
          <p>{{ theme.desc }}</p>
          <router-link v-if="theme.latest" class="theme-link" :to="`/records/${theme.latest.id}`">
            最近一次 · {{ theme.latest.date.slice(5).replace('-', '月') }}日 {{ theme.latest.title }}
            <ConservationIcon name="arrow" />
          </router-link>
        </article>
      </div>
    </section>

    <section class="history-timeline" aria-labelledby="timeline-heading">
      <div class="editorial-heading">
        <h2 id="timeline-heading">逐条巡护记录</h2>
        <span class="heading-aside">{{ stats.count }} 条 · 点开看详情</span>
      </div>
      <div v-for="group in byYear" :key="group.year" class="year-block">
        <div class="year-head"><strong>{{ group.year }}</strong><span>{{ group.count }} 次 · {{ group.km }} km · {{ group.hours }} 小时</span></div>
        <ol class="year-list">
          <li v-for="record in group.records" :key="record.id">
            <router-link :to="`/records/${record.id}`">
              <time :datetime="record.date">{{ record.date.slice(5) }}</time>
              <span class="year-title">{{ record.title }}<em class="year-tag">{{ themeOf[record.id] }}</em></span>
              <span class="year-meta">{{ record.location }}<template v-if="record.metrics?.distanceKm"> · {{ record.metrics.distanceKm }} km</template></span>
            </router-link>
          </li>
        </ol>
      </div>
    </section>

    <section class="history-how" aria-labelledby="how-heading">
      <h2 id="how-heading">记录是怎么留下的</h2>
      <ol>
        <li><strong>出发前定线</strong><span>按季节和重点水域确定路线，明确当日观察重点。</span></li>
        <li><strong>现场逐项记录</strong><span>日期、时段、天气、水位、船只与人员、发现情况，逐项写进登记表。</span></li>
        <li><strong>发现即处理</strong><span>漂浮物与残留渔具现场清理；涉渔违法线索移交渔政执法部门。</span></li>
        <li><strong>归档可复核</strong><span>记录与影像一并归档，形成可回溯的台账，网站条目按原记录整理。</span></li>
      </ol>
    </section>

    <p class="history-note">说明：本页数据取自「护江档案」中已发布的巡护现场记录，里程、时长与参与人数为台账汇编口径，正式对外发布前请以协会实际记录核对；未测量、未核实的数据不纳入统计。</p>

    <div class="history-actions">
      <a class="history-btn" :href="compilationHref" download="护江档案_巡护记录汇编_2024-2026.docx"><ConservationIcon name="download" />下载汇编 DOCX</a>
      <button type="button" class="history-btn ghost" @click="exportCsv"><ConservationIcon name="download" />导出 CSV</button>
      <router-link class="history-btn ghost" :to="{ path: '/records', query: { category: 'patrol' } }">在档案中筛选<ConservationIcon name="arrow" /></router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import ConservationIcon from '../components/ConservationIcon.vue'
import { useConservationStore } from '../stores/conservation'
import { downloadText, recordsToCsv } from '../lib/conservation'

use([BarChart, LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const store = useConservationStore()
const patrols = computed(() => store.published
  .filter(record => record.category === 'patrol' && record.kind === 'field')
  .slice()
  .sort((a, b) => a.date.localeCompare(b.date)))

const sum = (list, key) => list.reduce((total, record) => total + (Number(record.metrics?.[key]) || 0), 0)

const statsRange = computed(() => patrols.value.length
  ? `${patrols.value[0].date.slice(0, 7).replace('-', '.')} — ${patrols.value[patrols.value.length - 1].date.slice(0, 7).replace('-', '.')}`
  : '—')

const annualTakeaway = computed(() => {
  const groups = byYear.value
  if (!groups.length) return ''
  const peak = groups.reduce((best, group) => (group.count > best.count ? group : best), groups[0])
  return `${peak.year} 年巡护 ${peak.count} 次、累计 ${peak.km} km，是三年中巡护最密的一年。`
})

const monthTakeaway = computed(() => {
  const counts = Array.from({ length: 12 }, () => 0)
  patrols.value.forEach(record => { counts[Number(record.date.slice(5, 7)) - 1] += 1 })
  const peak = counts.indexOf(Math.max(...counts))
  const winter = counts[0] + counts[1] + counts[11]
  return `${peak + 1} 月出现最多次巡护；冬季三个月（12—2 月）合计 ${winter} 次，主要用于江豚越冬水域观察。`
})

const stats = computed(() => {
  const list = patrols.value
  return {
    range: statsRange.value || '—',
    count: list.length,
    distance: Math.round(sum(list, 'distanceKm')),
    hours: Math.round(sum(list, 'durationHours') * 10) / 10,
    participants: Math.round(sum(list, 'participants')),
    porpoise: list.filter(record => (record.tags || []).some(tag => tag.includes('江豚'))).length,
    joint: list.filter(record => (record.organizer || '').includes('渔政')).length,
  }
})

const years = computed(() => [...new Set(patrols.value.map(record => record.date.slice(0, 4)))].sort())
const byYear = computed(() => years.value.map(year => {
  const records = patrols.value.filter(record => record.date.startsWith(year))
  return {
    year,
    count: records.length,
    km: Math.round(sum(records, 'distanceKm')),
    hours: Math.round(sum(records, 'durationHours') * 10) / 10,
    records,
  }
}))

const annualOption = computed(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { data: ['巡护次数', '巡护里程 km'], bottom: 0, itemWidth: 12, itemHeight: 8, textStyle: { color: '#5b7160', fontSize: 11 } },
  grid: { left: 8, right: 8, top: 24, bottom: 34, containLabel: true },
  xAxis: { type: 'category', data: years.value, axisLine: { lineStyle: { color: '#cddad0' } }, axisLabel: { color: '#66796a' }, axisTick: { show: false } },
  yAxis: [
    { type: 'value', name: '次', nameTextStyle: { color: '#8a9c8b', fontSize: 11 }, splitLine: { lineStyle: { color: '#edf2ea' } }, axisLabel: { color: '#66796a' } },
    { type: 'value', name: 'km', nameTextStyle: { color: '#8a9c8b', fontSize: 11 }, splitLine: { show: false }, axisLabel: { color: '#66796a' } },
  ],
  series: [
    { name: '巡护次数', type: 'bar', barWidth: 34, itemStyle: { color: '#5c8a5f', borderRadius: [3, 3, 0, 0] }, data: byYear.value.map(group => group.count) },
    { name: '巡护里程 km', type: 'line', yAxisIndex: 1, smooth: true, symbolSize: 7, lineStyle: { color: '#c0763a', width: 2.4 }, itemStyle: { color: '#c0763a' }, data: byYear.value.map(group => group.km) },
  ],
}))

const monthOption = computed(() => {
  const counts = Array.from({ length: 12 }, () => 0)
  patrols.value.forEach(record => { counts[Number(record.date.slice(5, 7)) - 1] += 1 })
  return {
    tooltip: { trigger: 'axis', valueFormatter: value => `${value} 次` },
    grid: { left: 8, right: 8, top: 24, bottom: 12, containLabel: true },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], axisLine: { lineStyle: { color: '#cddad0' } }, axisLabel: { color: '#66796a', fontSize: 11 }, axisTick: { show: false } },
    yAxis: { type: 'value', name: '次', nameTextStyle: { color: '#8a9c8b', fontSize: 11 }, splitLine: { lineStyle: { color: '#edf2ea' } }, axisLabel: { color: '#66796a' } },
    series: [{ type: 'bar', barWidth: '52%', itemStyle: { color: '#7fa382', borderRadius: [3, 3, 0, 0] }, data: counts }],
  }
})

const THEME_RULES = [
  { id: 'porpoise', name: '江豚与栖息地记录', icon: 'river', desc: '越冬水域、活跃期与繁殖期观察，记下目击时间、位置和船舶干扰情况。', match: tags => tags.some(tag => tag.includes('江豚')) },
  { id: 'enforce', name: '禁渔期与清网行动', icon: 'patrol', desc: '禁渔期专项巡护与夜间值守，配合渔政排查残留渔具、电捕线索。', match: tags => tags.some(tag => ['禁渔期', '清网', '联合执法', '电捕'].some(key => tag.includes(key))) },
  { id: 'safety', name: '汛期与水域安全', icon: 'water', desc: '汛前隐患排查、水位观察、暑期游客提醒与漂浮物清理。', match: tags => tags.some(tag => ['汛', '水位', '水上安全', '游客', '暑期', '漂浮物'].some(key => tag.includes(key))) },
  { id: 'wetland', name: '湿地与候鸟保护', icon: 'leaf', desc: '候鸟过境与越冬期巡护湿地水域，记录人为干扰并现场劝阻。', match: tags => tags.some(tag => ['候鸟', '湿地'].some(key => tag.includes(key))) },
  { id: 'public', name: '公众参与与宣传', icon: 'book', desc: '世界水日联合宣传、净滩准备、假期值守，把巡护现场变成公众课堂。', match: tags => tags.some(tag => ['世界水日', '宣传', '公众参与', '净滩', '值守'].some(key => tag.includes(key))) },
]

const themes = computed(() => {
  const buckets = THEME_RULES.map(rule => ({ ...rule, records: [] }))
  const routine = { id: 'routine', name: '例行与季节巡护', icon: 'calendar', desc: '春、秋、冬三季例行巡查，记录岸线与水面变化，保持水域巡查连续性。', records: [] }
  patrols.value.forEach(record => {
    const tags = record.tags || []
    const hit = buckets.find(bucket => bucket.match(tags))
    ;(hit || routine).records.push(record)
  })
  return [...buckets, routine]
    .filter(theme => theme.records.length)
    .map(theme => ({
      ...theme,
      count: theme.records.length,
      latest: theme.records[theme.records.length - 1],
    }))
    .sort((a, b) => b.count - a.count)
})

const themeOf = computed(() => {
  const map = {}
  themes.value.forEach(theme => theme.records.forEach(record => { map[record.id] = theme.name }))
  return map
})

const compilationHref = `${import.meta.env.BASE_URL}docs/patrol-compilation-2024-2026.docx`
function exportCsv() { downloadText(recordsToCsv(patrols.value), '护江档案_巡护记录_2024-2026.csv', 'text/csv') }
</script>

<style scoped>
.history-page { padding-top: 44px; padding-bottom: 60px; }
.history-intro { display: flex; justify-content: space-between; align-items: flex-end; gap: 28px; padding-bottom: 24px; border-bottom: 1px solid #dfe8da; }
.history-intro .eyebrow { margin: 0 0 10px; font-size: 11px; letter-spacing: 2px; color: #7d9270; text-transform: uppercase; }
.history-intro h1 { margin: 0 0 14px; font: 600 clamp(27px, 3.4vw, 40px)/1.35 var(--font-editorial, Georgia, serif); color: #24402c; letter-spacing: .5px; }
.history-intro p { margin: 0; max-width: 720px; font-size: 13.5px; line-height: 2; color: #5d7263; }
.history-total { flex-shrink: 0; padding: 14px 20px; border-left: 3px solid #4c7a58; background: #f2f7ec; font-size: 12px; color: #61795f; }
.history-total strong { margin-right: 4px; font: 600 30px/1 Georgia, serif; color: #2b5540; }

.history-scope { margin: -22px 0 30px; font-size: 11px; line-height: 1.9; color: #7d9270; }
.history-total strong { font-size: 17px !important; letter-spacing: .5px; }
.history-total span { display: block; margin-top: 4px; font-size: 10.5px; color: #7d9270; }
.history-stats { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 0; margin: 30px 0 36px; border: 1px solid #e0e9db; border-radius: 6px; background: #fbfcf8; }
.history-stats > div { padding: 20px 16px; text-align: center; border-right: 1px solid #e8efe3; }
.history-stats > div:last-child { border-right: 0; }
.history-stats p { display: flex; align-items: baseline; justify-content: center; gap: 3px; margin: 0 0 6px; }
.history-stats strong { font: 600 30px/1.2 Georgia, var(--font-editorial, serif); color: #2b5540; font-variant-numeric: tabular-nums; }
.history-stats em { font-style: normal; font-size: 11px; color: #7d9270; letter-spacing: .4px; }
.history-stats span { font-size: 11.5px; color: #6b806c; letter-spacing: .3px; }

.history-charts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px; margin-bottom: 40px; }
.chart-card { padding: 20px 20px 14px; border: 1px solid #e0e9db; border-radius: 6px; background: #fff; }
.chart-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-bottom: 8px; }
.chart-head h2 { margin: 0; font: 600 15.5px/1.5 var(--font-editorial, serif); color: #2f5530; }
.chart-head span { font-size: 11px; color: #8a9c8b; }
.chart { height: 246px; }
.chart-note { margin: 4px 2px 2px; padding-top: 10px; border-top: 1px solid #eef3ea; font-size: 11.5px; line-height: 1.8; color: #5d7263; }

.theme-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin-top: 20px; }
.theme-card { display: flex; flex-direction: column; padding: 22px 22px 18px; border: 1px solid #e0e9db; border-radius: 6px; background: linear-gradient(165deg, #fbfcf8, #f4f8ef); }
.theme-top { display: flex; justify-content: space-between; align-items: center; color: #6c8a6b; }
.theme-top svg { width: 26px; height: 26px; stroke-width: 1.4; }
.theme-top span { font: 600 12px/1 Georgia, serif; color: #4c7a58; letter-spacing: .6px; }
.theme-card h3 { margin: 14px 0 8px; font: 600 18px/1.5 var(--font-editorial, serif); color: #2f5530; }
.theme-card p { margin: 0 0 16px; font-size: 12.5px; line-height: 1.95; color: #6b806c; }
.theme-link { display: flex; align-items: flex-start; gap: 6px; margin-top: auto; padding-top: 12px; border-top: 1px solid #e4ecd9; font-size: 11.5px; line-height: 1.7; color: #4c7a58; text-decoration: none; }
.theme-link svg { width: 14px; height: 14px; flex-shrink: 0; margin-top: 3px; }
.theme-link:hover { color: #2b5540; }

.year-block { margin-top: 26px; }
.year-head { display: flex; align-items: baseline; gap: 14px; padding-bottom: 10px; border-bottom: 1px solid #dfe8da; }
.year-head strong { font: 600 26px/1 Georgia, serif; color: #2b5540; letter-spacing: 1px; }
.year-head span { font-size: 11.5px; color: #7d9270; letter-spacing: .3px; }
.year-list { margin: 0; padding: 0; list-style: none; }
.year-list li { border-bottom: 1px dashed #e8eee2; }
.year-list a { display: grid; grid-template-columns: 62px minmax(0, 1fr) auto; gap: 14px; align-items: baseline; padding: 13px 4px; text-decoration: none; color: inherit; transition: background .18s; }
.year-list a:hover { background: #f6faf1; }
.year-list time { font: 600 12.5px/1.6 Georgia, serif; color: #4c7a58; letter-spacing: .5px; font-variant-numeric: tabular-nums; }
.year-title { font-size: 13.5px; color: #2f4a37; }
.year-tag { display: inline-block; margin-left: 9px; padding: 2px 7px; border: 1px solid #dbe6d2; border-radius: 2px; font-size: 10px; font-style: normal; color: #7a8f74; letter-spacing: .2px; vertical-align: 1px; }
.year-meta { font-size: 11px; color: #8a9c8b; white-space: nowrap; }

.history-how { margin: 44px 0 0; padding: 26px 28px; border: 1px solid #dfe8da; border-left: 4px solid #4c7a58; border-radius: 5px; background: linear-gradient(120deg, #f5f9f0, #edf4e6); }
.history-how h2 { margin: 0 0 16px; font: 600 17px/1.5 var(--font-editorial, serif); color: #2f5530; }
.history-how ol { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; margin: 0; padding: 0; list-style: none; counter-reset: step; }
.history-how li { position: relative; padding-left: 26px; }
.history-how li::before { counter-increment: step; content: counter(step); position: absolute; left: 0; top: 1px; width: 18px; height: 18px; border-radius: 50%; background: #4c7a58; color: #f4f8ee; font: 600 10px/18px Georgia, serif; text-align: center; }
.history-how strong { display: block; margin-bottom: 5px; font-size: 12.5px; color: #2f5530; }
.history-how span { font-size: 11.5px; line-height: 1.85; color: #6b806c; }

.history-note { margin: 20px 0 0; font-size: 11px; line-height: 1.95; color: #7d9270; }
.history-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; }
.history-btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border: 1px solid #355b35; border-radius: 999px; background: #355b35; color: #f4f8ee; font-size: 12.5px; font-family: inherit; font-weight: 600; letter-spacing: .4px; cursor: pointer; text-decoration: none; transition: background .2s, color .2s; }
.history-btn.ghost { background: transparent; color: #355b35; }
.history-btn:hover { background: #2a4a2b; color: #f4f8ee; }
.history-btn svg { width: 15px; height: 15px; }

@media (max-width: 1080px) {
  .history-stats { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .history-stats > div:nth-child(3n) { border-right: 0; }
  .history-stats > div:nth-child(-n+3) { border-bottom: 1px solid #e8efe3; }
  .theme-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .history-how ol { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 820px) {
  .history-intro { flex-direction: column; align-items: flex-start; gap: 16px; }
  .history-charts { grid-template-columns: 1fr; }
  .theme-grid { grid-template-columns: 1fr; }
  .year-list a { grid-template-columns: 52px minmax(0, 1fr); }
  .year-meta { display: none; }
}
@media (max-width: 640px) {
  .history-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .history-stats > div { border-right: 0; border-bottom: 1px solid #e8efe3; }
  .history-stats > div:nth-child(2n) { border-right: 0; }
  .history-how { padding: 20px; }
  .history-how ol { grid-template-columns: 1fr; }
}
</style>
