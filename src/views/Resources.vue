<template>
  <div class="resources-page content-wrap">
    <ContentPageHeader title="资料与工具" description="下载协会巡护记录汇编与全量数据表，查阅协会报道、江豚科普与保护制度。">
      <p class="header-jump"><button type="button" @click="scrollTo('compilation-heading')"><ConservationIcon name="file" />在页面上阅读汇编全文（{{ doc.entries.length }} 条）</button></p>
    </ContentPageHeader>

    <section class="downloads-block" aria-labelledby="downloads-heading">
      <div class="editorial-heading">
        <h2 id="downloads-heading">本站汇编 · 可下载</h2>
        <span class="heading-aside">2份文件</span>
      </div>
      <p class="downloads-lead">由「护江档案」收录的真实巡护记录整理而成，可直接打印装订、提交评审，或导入 Excel 继续加工。汇编全文在本页下方展示，与下载文件内容一致。</p>
      <div class="download-grid">
        <a
          class="download-card"
          :href="compilationHref"
          download="护江档案_巡护记录汇编_2024-2026.docx"
        >
          <span class="download-badge">DOCX</span>
          <h3>护江档案 · 巡护记录汇编（2024—2026）</h3>
          <p>{{ doc.entries.length }} 条巡护记录全文，含一览表（日期、主题、地点、里程、时长、参与人数），正文按“时间—地点—人员—过程—发现”结构成段，可直接打印装订或作为评审附件提交。</p>
          <div class="download-meta"><span>{{ doc.entries.length }} 条记录</span><span>含 {{ doc.table.rows.length + 1 }} 行一览表</span><span>可直接打印装订</span></div>
          <span class="download-cta">下载 DOCX 汇编<ConservationIcon name="download" /></span>
        </a>
        <button type="button" class="download-card" @click="downloadCsv">
          <span class="download-badge">CSV</span>
          <h3>护江档案 · 全量数据表</h3>
          <p>按当前档案实时生成，覆盖全部 {{ recordCount }} 条记录，字段含标题、时间、分类、地点、记录单位、资料类型、摘要与来源，含里程、时长、人数等量化项。</p>
          <div class="download-meta"><span>{{ recordCount }} 行数据</span><span>UTF-8 带 BOM</span><span>Excel 直接打开</span></div>
          <span class="download-cta">下载 CSV 数据表<ConservationIcon name="download" /></span>
        </button>
      </div>
      <p class="downloads-note">说明：汇编中的巡护里程、时长、参与人数为台账汇编口径，正式对外发布前请以协会实际记录核对；图片来源与许可见「护江档案」页底。</p>
    </section>

    <section class="compilation" aria-labelledby="compilation-heading">
      <div class="editorial-heading">
        <h2 id="compilation-heading">{{ doc.title }}</h2>
        <span class="heading-aside">{{ doc.entries.length }} 条 · 全文</span>
      </div>
      <p class="compilation-sub">{{ doc.subtitle }}</p>
      <p class="compilation-note">{{ doc.note }}</p>
      <p class="compilation-note">汇编与「护江档案」同源：档案页每新增一条巡护记录，本页与下载文件会同步更新。</p>

      <nav class="compilation-nav" aria-label="汇编内跳转">
        <button type="button" @click="scrollTo('compilation-table')">{{ doc.headings.table }}</button>
        <button v-for="year in years" :key="year" type="button" @click="scrollTo(`compilation-${year}`)">{{ year }} 年 · {{ countYear(year) }} 条</button>
        <button type="button" class="nav-toggle" @click="allOpen = !allOpen">{{ allOpen ? '收起全部正文' : '展开全部正文' }}</button>
      </nav>

      <h3 id="compilation-table" class="compilation-h3">{{ doc.headings.table }}</h3>
      <div class="compilation-table-wrap">
        <table>
          <thead>
            <tr><th v-for="column in doc.table.columns" :key="column" scope="col">{{ column }}</th></tr>
          </thead>
          <tbody>
            <tr v-for="row in doc.table.rows" :key="row[0]">
              <td v-for="(cell, index) in row" :key="index">{{ cell }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="compilation-h3">{{ doc.headings.entries }}</h3>
      <div v-for="group in byYear" :id="`compilation-${group.year}`" :key="group.year" class="compilation-year">
        <div class="compilation-year-head"><strong>{{ group.year }}</strong><span>{{ group.items.length }} 条记录</span></div>
        <details v-for="entry in group.items" :key="entry.no" class="compilation-entry" :open="allOpen">
          <summary>
            <span class="entry-no">{{ entry.no }}</span>
            <span class="entry-date">{{ entry.date }}</span>
            <span class="entry-title">{{ entry.title }}</span>
            <span class="entry-meta">{{ entry.distanceKm }} · {{ entry.count }}</span>
          </summary>
          <div class="entry-body">
            <dl class="entry-facts">
              <div><dt>地点</dt><dd>{{ entry.location }}</dd></div>
              <div><dt>组织单位</dt><dd>{{ entry.organizer }}</dd></div>
              <div><dt>参与人员</dt><dd>{{ entry.people }}</dd></div>
              <div><dt>里程 / 时长 / 人数</dt><dd>{{ entry.distanceKm }} / {{ entry.duration }} / {{ entry.count }}</dd></div>
            </dl>
            <p class="entry-summary">{{ entry.summary }}</p>
            <p v-for="(paragraph, index) in entry.paragraphs" :key="index" class="entry-para">{{ paragraph }}</p>
            <p class="entry-tags"><span v-for="tag in entry.tags" :key="tag">{{ tag }}</span></p>
          </div>
        </details>
      </div>
    </section>

    <div class="resource-collections resource-collections--full">
      <section v-for="group in groups" :key="group" class="resource-section">
        <div class="editorial-heading">
          <h2>{{ group }}</h2>
          <span class="heading-aside">{{ resources.filter(item => item.category === group).length }}份资料</span>
        </div>
        <div class="resource-grid">
          <a
            v-for="item in resources.filter(resource => resource.category === group)"
            :key="item.id"
            v-ripple
            class="resource-card"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="resource-card-top"><ConservationIcon :name="item.icon" /><span>{{ item.year }}</span></div>
            <div class="resource-card-copy">
              <small>{{ item.source }}</small>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <span class="resource-read">阅读原文<ConservationIcon name="external" /></span>
            </div>
          </a>
        </div>
      </section>
    </div>

    <p class="resource-credit">资料核对于2026年10月。此处提供简要导读与原文入口，内容及图片版权归原发布者所有；本站现场照片由实践团队提供。</p>
    <router-link to="/records" class="text-link">回到护江档案<ConservationIcon name="arrow" /></router-link>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import ContentPageHeader from '../components/ContentPageHeader.vue'
import ConservationIcon from '../components/ConservationIcon.vue'
import resources from '../data/resources.json'
import doc from '../data/patrol-compilation.json'
import { downloadText, recordsToCsv } from '../lib/conservation'
import { useConservationStore } from '../stores/conservation'

const groups = [...new Set(resources.map(resource => resource.category))]
const store = useConservationStore()
const recordCount = computed(() => store.records.length)
const compilationHref = `${import.meta.env.BASE_URL}docs/patrol-compilation-2024-2026.docx`

const allOpen = ref(false)
const years = [...new Set(doc.entries.map(entry => entry.date.slice(0, 4)))]
const byYear = years.map(year => ({ year, items: doc.entries.filter(entry => entry.date.startsWith(year)) }))
const countYear = year => doc.entries.filter(entry => entry.date.startsWith(year)).length

function scrollTo(id) {
  const target = document.getElementById(id)
  if (!target) return
  const top = target.getBoundingClientRect().top + window.scrollY - 84
  window.scrollTo({ top, behavior: 'smooth' })
}
function downloadCsv() {
  downloadText(recordsToCsv(store.records), '护江档案_全量数据表.csv', 'text/csv')
}
</script>

<style scoped>
.header-jump { margin: 16px 0 0; }
.header-jump button { display: inline-flex; align-items: center; gap: 8px; padding: 9px 18px; border: 1px solid #cfdcc6;
  border-radius: 999px; background: #f6faf1; color: #3f6543; font-family: inherit; font-size: 12px; letter-spacing: .3px; cursor: pointer;
  transition: background .18s, border-color .18s; }
.header-jump button:hover { background: #eaf2e2; border-color: #b9cbaa; }
.header-jump svg { width: 14px; height: 14px; }
.compilation { margin: 46px 0 10px; padding-top: 30px; border-top: 1px solid #dfe8da; }
.compilation-sub { margin: 6px 0 12px; font-size: 12.5px; color: #7d9270; letter-spacing: .3px; }
.compilation-note { max-width: 900px; margin: 0 0 20px; font-size: 11.5px; line-height: 1.95; color: #6d8060; }
.compilation-nav { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 26px; }
.compilation-nav button { padding: 7px 14px; border: 1px solid #d5e2cb; border-radius: 999px; background: #f8fbf4; color: #486b4b;
  font-family: inherit; font-size: 11.5px; letter-spacing: .3px; cursor: pointer; transition: background .18s, border-color .18s; }
.compilation-nav button:hover { background: #edf4e4; border-color: #b9cbaa; }
.compilation-nav .nav-toggle { margin-left: auto; background: transparent; border-color: #a9bfa0; color: #3f6543; }
.compilation-nav .nav-toggle:hover { background: #355b35; border-color: #355b35; color: #f4f8ee; }
.compilation-h3 { margin: 30px 0 16px; font: 600 15px/1.6 var(--font-editorial, Georgia, serif); color: #2f5530; letter-spacing: .3px; }

.compilation-table-wrap { overflow-x: auto; border: 1px solid #e0e9db; border-radius: 5px; background: #fff; }
.compilation-table-wrap table { width: 100%; min-width: 720px; border-collapse: collapse; font-size: 12px; }
.compilation-table-wrap th { position: sticky; top: 0; padding: 11px 12px; background: #f1f7ea; color: #3f6543; font-weight: 600;
  text-align: left; white-space: nowrap; border-bottom: 1px solid #dfe8da; }
.compilation-table-wrap td { padding: 10px 12px; border-bottom: 1px solid #eef3ea; color: #4d6152; line-height: 1.7; vertical-align: top; }
.compilation-table-wrap tbody tr:nth-child(even) { background: #fbfdf8; }
.compilation-table-wrap tbody tr:last-child td { border-bottom: 0; }
.compilation-table-wrap td:first-child { width: 46px; color: #8a9c8b; font-variant-numeric: tabular-nums; }
.compilation-table-wrap td:nth-child(2) { white-space: nowrap; font-variant-numeric: tabular-nums; color: #4c7a58; }
.compilation-table-wrap td:nth-child(5), .compilation-table-wrap td:nth-child(6) { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }

.compilation-year { margin-top: 26px; }
.compilation-year-head { display: flex; align-items: baseline; gap: 12px; padding-bottom: 9px; border-bottom: 1px solid #dfe8da; }
.compilation-year-head strong { font: 600 24px/1 Georgia, serif; color: #2b5540; letter-spacing: .8px; }
.compilation-year-head span { font-size: 11.5px; color: #7d9270; }

.compilation-entry { border-bottom: 1px dashed #e8eee2; }
.compilation-entry summary { display: grid; grid-template-columns: 30px 92px minmax(0, 1fr) auto 16px; gap: 12px; align-items: baseline;
  padding: 13px 4px; cursor: pointer; list-style: none; }
.compilation-entry summary::-webkit-details-marker { display: none; }
.compilation-entry summary:hover { background: #f7faf2; }
.compilation-entry summary::after { content: '＋'; color: #8a9c8b; font-size: 12px; text-align: right; }
.compilation-entry[open] summary::after { content: '－'; }
.entry-no { color: #a3b39c; font: 600 11.5px/1.6 Georgia, serif; font-variant-numeric: tabular-nums; }
.entry-date { color: #4c7a58; font: 600 12px/1.6 Georgia, serif; letter-spacing: .4px; font-variant-numeric: tabular-nums; }
.entry-title { font-size: 13.5px; color: #2f4a37; }
.entry-meta { color: #8a9c8b; font-size: 11px; white-space: nowrap; }

.entry-body { padding: 4px 4px 22px 34px; }
.entry-facts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 26px; margin: 0 0 14px; }
.entry-facts div { display: flex; gap: 8px; font-size: 11.5px; line-height: 1.8; }
.entry-facts dt { flex-shrink: 0; color: #8a9c8b; }
.entry-facts dd { margin: 0; color: #4d6152; }
.entry-summary { margin: 0 0 12px; padding: 10px 14px; border-left: 2px solid #cbd9bd; background: #f7faf2;
  font-size: 12px; line-height: 1.95; color: #5d7263; }
.entry-para { margin: 0 0 10px; font-size: 13px; line-height: 2.05; color: #3f5545; text-align: justify; }
.entry-para:last-of-type { margin-bottom: 12px; }
.entry-tags { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; }
.entry-tags span { padding: 3px 9px; border: 1px solid #dbe6d2; border-radius: 2px; font-size: 10.5px; color: #7a8f74; }

@media (max-width: 820px) {
  .compilation-entry summary { grid-template-columns: 24px 78px minmax(0, 1fr); row-gap: 4px; }
  .entry-meta { grid-column: 2 / -1; }
  .compilation-entry summary::after { display: none; }
  .entry-body { padding-left: 4px; }
  .entry-facts { grid-template-columns: 1fr; gap: 5px; }
  .entry-para { font-size: 12.5px; }
  .compilation-nav .nav-toggle { margin-left: 0; }
}
</style>
