<template>
  <div class="record-detail content-wrap">
    <router-link to="/records" class="detail-back">← 返回护江档案</router-link>
    <template v-if="record">
      <header class="detail-heading"><p class="eyebrow">{{ categoryName(record.category) }} / {{ KIND_LABELS[record.kind] }}</p><h1>{{ record.title }}</h1><div class="detail-meta"><span><ConservationIcon name="calendar"/>{{ dateText }}{{ record.datePrecision !== 'day' ? ' · 按'+(record.datePrecision === 'month' ? '月' : '年')+'归档' : '' }}</span><span><ConservationIcon name="location"/>{{ record.location || '地点未填写' }}</span></div></header>
      <div class="detail-grid">
        <article class="record-article"><p class="article-summary">{{ record.summary }}</p><p v-for="(paragraph, index) in paragraphs" :key="index" class="article-paragraph">{{ paragraph }}</p>
          <div v-if="metrics.length" class="detail-metrics"><div v-for="metric in metrics" :key="metric.key"><span>{{ metric.label }}</span><strong>{{ record.metrics[metric.key] }}</strong><small>{{ metric.unit }}</small></div></div>
          <div v-if="record.photos.length" class="detail-photos"><figure v-for="(photo, index) in record.photos" :key="photo.src"><el-image :src="publicAsset(photo.src)" :alt="photo.caption || record.title" :preview-src-list="previewSources" :initial-index="index" fit="contain" loading="lazy" hide-on-click-modal/><figcaption>{{ photo.caption }}</figcaption></figure></div>
        </article>
        <aside class="detail-sidebar"><h2>资料信息</h2><dl><div><dt>记录时间</dt><dd>{{ dateText }}</dd></div><div><dt>记录单位 / 参与单位</dt><dd>{{ record.organizer || '未填写' }}</dd></div><div><dt>资料类型</dt><dd>{{ KIND_LABELS[record.kind] }}</dd></div><div><dt>资料来源</dt><dd>{{ record.sourceName }}</dd></div></dl><a v-if="record.sourceUrl" class="detail-source-link" :href="record.sourceUrl" target="_blank" rel="noopener noreferrer">查看来源原文<ConservationIcon name="external"/></a><p v-if="record.sourceNote" class="detail-source-note">{{ record.sourceNote }}</p></aside>
      </div>
      <section v-if="related.length" class="detail-related"><h2>相关记录</h2><div class="record-grid"><ConservationCard v-for="item in related" :key="item.id" :record="item"/></div></section>
    </template>
    <el-skeleton v-else-if="store.loading" :rows="6" animated/>
    <section v-else class="archive-empty"><h1>这份记录暂未公开</h1><p>可以返回档案页，看看其他守护行动。</p><router-link to="/records" class="forest-button">翻阅护江档案</router-link></section>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useConservationStore } from '../stores/conservation'
import { publicAsset, formatRecordDate, categoryName, KIND_LABELS, METRICS } from '../lib/conservation'
import ConservationCard from '../components/ConservationCard.vue'
import ConservationIcon from '../components/ConservationIcon.vue'
const route = useRoute(), store = useConservationStore()
const record = computed(() => store.published.find(item => item.id === route.params.id))
const dateText = computed(() => record.value ? formatRecordDate(record.value) + (record.value.dateEnd ? `—${formatRecordDate({ date: record.value.dateEnd })}` : '') : '')
const paragraphs = computed(() => record.value?.body?.split(/\n\s*\n/).filter(Boolean) || [])
const previewSources = computed(() => record.value?.photos.map(photo => publicAsset(photo.src)) || [])
const metrics = computed(() => METRICS.filter(metric => record.value?.metrics?.[metric.key] != null && record.value.metrics[metric.key] !== ''))
const related = computed(() => record.value ? store.published.filter(item => item.id !== record.value.id && item.category === record.value.category).slice(0,3) : [])
</script>
