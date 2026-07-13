<template>
  <section class="timeline-module" tabindex="0" @keydown="onKeydown">
    <div class="timeline-image" :class="{ 'timeline-image--empty': !activeEntry.image }">
      <img
        v-if="activeEntry.image && !imageFailed"
        :src="imageUrl(activeEntry.image)"
        :alt="`${point.name} ${activeEntry.year} 年历史卫星影像`"
        loading="lazy"
        decoding="async"
        @error="imageFailed = true"
      />
      <div v-else class="timeline-empty-state">
        <strong>{{ activeEntry.year }} 年影像待补充</strong>
        <span>坐标核验和公开数据检索完成后将在此显示真实卫星影像。</span>
      </div>
      <div class="image-badge">{{ activeEntry.year }}</div>
    </div>

    <ImageryMetadata :entry="activeEntry" />
    <p class="imagery-note">{{ activeEntry.note }}</p>

    <div class="timeline-years" aria-label="历史影像年份">
      <button
        v-for="entry in entries"
        :key="entry.year"
        class="year-button"
        :class="{ active: entry.year === activeYear, pending: !entry.image }"
        type="button"
        :aria-label="`切换至 ${entry.year} 年影像`"
        @click="selectYear(entry.year)"
      >
        {{ entry.year }}
        <small v-if="!entry.image">待补充</small>
      </button>
    </div>

    <div class="timeline-controls">
      <button type="button" class="icon-button" aria-label="上一年" title="上一年" @click="move(-1)">‹</button>
      <button type="button" class="icon-button play-button" :aria-label="isPlaying ? '暂停播放' : '自动播放'" :title="isPlaying ? '暂停播放' : '自动播放'" @click="togglePlayback">
        {{ isPlaying ? 'Ⅱ' : '▶' }}
      </button>
      <button type="button" class="icon-button" aria-label="下一年" title="下一年" @click="move(1)">›</button>
      <label class="loop-control"><input v-model="loop" type="checkbox" /> 循环播放</label>
      <span class="keyboard-hint">方向键切换，空格播放/暂停</span>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ImageryMetadata from './ImageryMetadata.vue'

const props = defineProps({
  point: { type: Object, required: true },
  modelValue: { type: Number, default: 2016 },
})
const emit = defineEmits(['update:modelValue'])

const activeYear = ref(props.modelValue)
const isPlaying = ref(false)
const loop = ref(false)
const imageFailed = ref(false)
let timer = null

const entries = computed(() => props.point.timeline || [])
const activeEntry = computed(() => entries.value.find(entry => entry.year === activeYear.value) || entries.value[0] || { year: activeYear.value })

function imageUrl(path) {
  if (!path || /^(https?:|data:|blob:)/.test(path)) return path || ''
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

function selectYear(year) {
  activeYear.value = year
  imageFailed.value = false
  emit('update:modelValue', year)
}

function move(direction) {
  const index = entries.value.findIndex(entry => entry.year === activeYear.value)
  const nextIndex = index + direction
  if (nextIndex >= 0 && nextIndex < entries.value.length) {
    selectYear(entries.value[nextIndex].year)
  } else if (loop.value && entries.value.length) {
    selectYear(entries.value[direction > 0 ? 0 : entries.value.length - 1].year)
  } else {
    stopPlayback()
  }
}

function startPlayback() {
  if (entries.value.length < 2) return
  isPlaying.value = true
  clearInterval(timer)
  timer = setInterval(() => move(1), 1500)
}

function stopPlayback() {
  isPlaying.value = false
  clearInterval(timer)
  timer = null
}

function togglePlayback() {
  if (isPlaying.value) stopPlayback()
  else startPlayback()
}

function onKeydown(event) {
  const tag = event.target?.tagName?.toLowerCase()
  if (['input', 'select', 'textarea', 'button'].includes(tag)) return
  if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
  if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
  if (event.key === ' ') { event.preventDefault(); togglePlayback() }
}

watch(() => props.point.id, () => {
  stopPlayback()
  selectYear(entries.value[0]?.year || 2016)
})

watch(() => props.modelValue, year => {
  if (year !== activeYear.value) selectYear(year)
})

onMounted(() => {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) loop.value = false
})

onBeforeUnmount(stopPlayback)
</script>

<style scoped>
.timeline-module { outline: none; }
.timeline-module:focus-visible { outline: 3px solid rgba(46, 134, 171, 0.35); outline-offset: 4px; }
.timeline-image { position: relative; aspect-ratio: 16 / 8; overflow: hidden; background: #dcecf2; border: 1px solid var(--border); }
.timeline-image img { width: 100%; height: 100%; display: block; object-fit: cover; animation: image-in 180ms ease-out; }
.timeline-empty-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 26px; color: var(--text-secondary); text-align: center; }
.timeline-empty-state strong { color: var(--text-primary); }
.timeline-empty-state span { max-width: 390px; margin-top: 6px; font-size: 13px; }
.image-badge { position: absolute; top: 14px; left: 14px; padding: 4px 10px; background: rgba(17, 65, 84, 0.85); color: #fff; font-size: 14px; font-weight: 700; }
.imagery-note { margin: 12px 0; color: var(--text-secondary); font-size: 13px; }
.timeline-years { display: flex; overflow-x: auto; gap: 8px; padding: 4px 0 8px; }
.year-button { flex: 1 0 94px; min-height: 52px; border: 1px solid var(--border); background: #fff; color: var(--text-secondary); cursor: pointer; font-weight: 700; }
.year-button:hover, .year-button:focus-visible { border-color: var(--primary); color: var(--primary-dark); }
.year-button.active { background: var(--primary); border-color: var(--primary); color: #fff; }
.year-button small { display: block; font-size: 11px; font-weight: 400; opacity: 0.75; }
.timeline-controls { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 8px; }
.icon-button { width: 36px; height: 36px; border: 1px solid var(--border); background: #fff; color: var(--primary-dark); cursor: pointer; font-size: 25px; line-height: 1; }
.icon-button:hover, .icon-button:focus-visible { border-color: var(--primary); background: #eaf4f8; }
.play-button { font-size: 15px; background: var(--primary); border-color: var(--primary); color: #fff; }
.loop-control { display: inline-flex; align-items: center; gap: 5px; margin-left: 6px; color: var(--text-secondary); font-size: 13px; }
.keyboard-hint { margin-left: auto; color: var(--text-muted); font-size: 12px; }
@keyframes image-in { from { opacity: 0.45; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .timeline-image img { animation: none; } }
@media (max-width: 680px) { .keyboard-hint { width: 100%; margin-left: 0; } }
</style>
