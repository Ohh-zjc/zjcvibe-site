<template>
  <main class="page-container log-detail-page">
    <RouterLink class="back-link" :to="{ name: 'About' }">← 返回实践日志</RouterLink>

    <template v-if="log">
      <header class="log-hero">
        <div class="log-day-badge">
          <strong>{{ log.day }}</strong>
          <span>{{ log.weekday }}</span>
        </div>
        <div>
          <span class="section-kicker">2026 洞庭湖流域社会实践</span>
          <h1>{{ log.title }}</h1>
          <p>{{ log.summary }}</p>
        </div>
      </header>

      <section class="detail-section" aria-labelledby="journal-heading">
        <h2 id="journal-heading">当日工作笔记</h2>
        <article v-for="entry in log.entries" :key="entry.heading" class="journal-entry">
          <h3>{{ entry.heading }}</h3>
          <p>{{ entry.text }}</p>
        </article>
      </section>

      <section class="detail-section" aria-labelledby="photos-heading">
        <h2 id="photos-heading">现场照片</h2>
        <div class="photo-grid">
          <figure v-for="photo in log.photos" :key="photo.src" class="photo-card">
            <img :src="mediaUrl(photo.src)" :alt="photo.caption" />
            <figcaption>{{ photo.caption }}</figcaption>
          </figure>
        </div>
      </section>

      <aside class="takeaway">
        <span>当天感悟</span>
        <p>{{ log.takeaway }}</p>
      </aside>
    </template>

    <section v-else class="not-found">
      <h1>未找到这篇实践日志</h1>
      <RouterLink :to="{ name: 'About' }">返回关于页面</RouterLink>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { findPracticeLog } from '../data/practiceLogs'

const route = useRoute()
const log = computed(() => findPracticeLog(route.params.id))

function mediaUrl(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}
</script>

<style scoped>
.log-detail-page { max-width: 980px; padding-top: 36px; padding-bottom: 72px; }
.back-link { display: inline-flex; margin-bottom: 28px; color: var(--primary-dark); font-size: 14px; font-weight: 700; }
.log-hero { display: grid; grid-template-columns: 78px minmax(0, 1fr); gap: 22px; align-items: start; padding-bottom: 32px; border-bottom: 1px solid var(--border); }
.log-day-badge { display: grid; min-height: 78px; align-content: center; justify-items: center; border-radius: 8px; background: var(--primary); color: #fff; }
.log-day-badge strong { font-size: 16px; }.log-day-badge span { margin-top: 3px; font-size: 12px; opacity: 0.86; }
.section-kicker { color: var(--primary); font-size: 13px; font-weight: 700; }
.log-hero h1 { margin: 5px 0 12px; color: var(--text-primary); font-size: 30px; line-height: 1.35; letter-spacing: 0; }
.log-hero p { max-width: 760px; color: var(--text-secondary); font-size: 16px; line-height: 1.8; }
.detail-section { margin-top: 40px; }
.detail-section h2 { display: inline-block; margin-bottom: 18px; padding-bottom: 7px; border-bottom: 2px solid var(--primary-light); color: var(--text-primary); font-size: 20px; }
.journal-entry { padding: 20px 0; border-bottom: 1px solid var(--border); }
.journal-entry:first-of-type { padding-top: 0; }.journal-entry h3 { margin-bottom: 8px; color: var(--text-primary); font-size: 17px; }.journal-entry p { color: var(--text-secondary); font-size: 15px; line-height: 1.9; }
.photo-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.photo-card { overflow: hidden; margin: 0; border: 1px solid var(--border); background: #fff; }
.photo-card img { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; }.photo-card figcaption { padding: 10px 12px; color: var(--text-secondary); font-size: 13px; }
.takeaway { margin-top: 38px; padding: 22px 24px; border-left: 4px solid #d97706; background: #fff8ed; }.takeaway span { color: #9a5b12; font-size: 13px; font-weight: 700; }.takeaway p { margin-top: 7px; color: #5d4a35; font-size: 15px; line-height: 1.8; }
.not-found { padding: 72px 0; text-align: center; }.not-found h1 { color: var(--text-primary); font-size: 24px; }.not-found a { display: inline-block; margin-top: 16px; color: var(--primary); }
@media (max-width: 768px) { .log-detail-page { padding-top: 24px; }.log-hero { grid-template-columns: 1fr; gap: 14px; }.log-day-badge { width: 88px; min-height: 54px; }.log-hero h1 { font-size: 24px; }.photo-grid { grid-template-columns: 1fr; } }
</style>
