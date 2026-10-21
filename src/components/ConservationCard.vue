<template>
  <router-link v-ripple class="conservation-card" :to="`/records/${record.id}`">
    <div class="record-cover">
      <img v-if="record.photos?.length" :src="publicAsset(record.photos[0].src)" :alt="record.photos[0].caption || record.title" loading="lazy" />
      <div v-else class="archive-cover" :class="`cover-${record.category}`">
        <ConservationIcon :name="coverIcon" class="cover-icon"/>
        <p v-if="coverFacts" class="cover-facts">{{ coverFacts }}</p>
        <span class="cover-year">{{ record.date.slice(0, 4) }}</span>
      </div>
      <span class="record-cover-label">{{ categoryName(record.category) }}</span>
    </div>
    <div class="record-card-body">
      <div class="record-card-meta"><time>{{ formatRecordDate(record) }}</time><span>{{ shortKind }}</span></div>
      <h3>{{ record.title }}</h3>
      <p>{{ record.summary }}</p>
      <span class="record-read">翻阅记录<ConservationIcon name="arrow"/></span>
    </div>
  </router-link>
</template>
<script setup>
import { computed } from 'vue'
import ConservationIcon from './ConservationIcon.vue'
import { publicAsset, categoryName, formatRecordDate, KIND_LABELS } from '../lib/conservation'
const props = defineProps({ record: { type: Object, required: true } })
const SHORT_KIND = { archive: '协会档案', field: '现场记录', report: '报道整理' }
const shortKind = computed(() => SHORT_KIND[props.record.kind] || KIND_LABELS[props.record.kind] || '')
const coverIcon = computed(() => ({ patrol: 'patrol', monitor: 'water', cleanup: 'leaf', education: 'book' })[props.record.category] || 'river')
const coverFacts = computed(() => {
  const metrics = props.record.metrics || {}
  return [
    metrics.distanceKm ? `${metrics.distanceKm} km` : '',
    metrics.durationHours ? `${metrics.durationHours} 小时` : '',
    metrics.participants ? `${metrics.participants} 人` : '',
  ].filter(Boolean).join(' · ')
})
</script>
