<template>
  <section class="compare-tool" aria-label="历史影像滑动对比">
    <div class="compare-heading">
      <div>
        <span class="eyebrow">历史影像滑动对比</span>
        <p>{{ leftEntry.year }} 与 {{ rightEntry.year }} 使用相同点位范围时可进行直观对照。</p>
      </div>
      <div class="year-selects">
        <label>
          左侧
          <select :value="leftEntry.year" @change="$emit('update:leftYear', Number($event.target.value))">
            <option v-for="entry in entries" :key="entry.year" :value="entry.year">{{ entry.year }}</option>
          </select>
        </label>
        <label>
          右侧
          <select :value="rightEntry.year" @change="$emit('update:rightYear', Number($event.target.value))">
            <option v-for="entry in entries" :key="entry.year" :value="entry.year">{{ entry.year }}</option>
          </select>
        </label>
      </div>
    </div>

    <div v-if="canCompare" ref="viewport" class="compare-viewport" @pointerdown="startDrag" @pointermove="drag" @pointerup="stopDrag" @pointercancel="stopDrag">
      <img :src="imageUrl(rightEntry.image)" :alt="`${pointName} ${rightEntry.year} 年卫星影像`" decoding="async" />
      <div class="compare-overlay" :style="{ clipPath: `inset(0 ${100 - split}% 0 0)` }">
        <img :src="imageUrl(leftEntry.image)" :alt="`${pointName} ${leftEntry.year} 年卫星影像`" decoding="async" />
      </div>
      <div class="compare-handle" :style="{ left: `${split}%` }" aria-hidden="true"><span></span></div>
      <span class="compare-year compare-year--left">{{ leftEntry.year }}</span>
      <span class="compare-year compare-year--right">{{ rightEntry.year }}</span>
    </div>
    <div v-else class="compare-empty">
      <strong>对比影像待补充</strong>
      <span>只有左右两张历史影像均已完成核验与上传后，滑动对比才会启用。</span>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  entries: { type: Array, required: true },
  leftEntry: { type: Object, required: true },
  rightEntry: { type: Object, required: true },
  pointName: { type: String, required: true },
})

defineEmits(['update:leftYear', 'update:rightYear'])

const viewport = ref(null)
const split = ref(50)
const dragging = ref(false)
const canCompare = computed(() => Boolean(props.leftEntry.image && props.rightEntry.image))

function imageUrl(path) {
  if (!path || /^(https?:|data:|blob:)/.test(path)) return path || ''
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

function setSplit(clientX) {
  if (!viewport.value) return
  const rect = viewport.value.getBoundingClientRect()
  split.value = Math.min(96, Math.max(4, ((clientX - rect.left) / rect.width) * 100))
}

function startDrag(event) {
  dragging.value = true
  viewport.value?.setPointerCapture?.(event.pointerId)
  setSplit(event.clientX)
}

function drag(event) {
  if (dragging.value) setSplit(event.clientX)
}

function stopDrag() {
  dragging.value = false
}
</script>

<style scoped>
.compare-tool { margin-top: 22px; }
.compare-heading { display: flex; justify-content: space-between; gap: 20px; align-items: end; margin-bottom: 12px; }
.eyebrow { color: var(--primary); font-size: 13px; font-weight: 700; }
.compare-heading p { margin: 3px 0 0; color: var(--text-secondary); font-size: 13px; }
.year-selects { display: flex; flex-wrap: wrap; gap: 8px; }
.year-selects label { color: var(--text-secondary); font-size: 12px; }
select { margin-left: 5px; border: 1px solid var(--border); background: #fff; color: var(--text-primary); padding: 5px; }
.compare-viewport { position: relative; aspect-ratio: 16 / 9; overflow: hidden; background: #e7f0f3; cursor: col-resize; touch-action: none; user-select: none; }
.compare-viewport img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.compare-overlay { position: absolute; inset: 0; }
.compare-handle { position: absolute; top: 0; bottom: 0; width: 2px; background: #fff; box-shadow: 0 0 0 1px rgba(27, 94, 122, 0.28); transform: translateX(-50%); }
.compare-handle span { position: absolute; top: 50%; left: 50%; width: 34px; height: 34px; border: 2px solid #fff; border-radius: 50%; background: var(--primary); transform: translate(-50%, -50%); }
.compare-handle span::before, .compare-handle span::after { content: ''; position: absolute; top: 50%; width: 8px; height: 8px; border-top: 2px solid #fff; border-left: 2px solid #fff; }
.compare-handle span::before { left: 8px; transform: translateY(-50%) rotate(-45deg); }
.compare-handle span::after { right: 8px; transform: translateY(-50%) rotate(135deg); }
.compare-year { position: absolute; top: 10px; padding: 3px 8px; background: rgba(16, 52, 68, 0.78); color: #fff; font-size: 12px; font-weight: 700; }
.compare-year--left { left: 10px; }
.compare-year--right { right: 10px; }
.compare-empty { min-height: 180px; display: flex; flex-direction: column; justify-content: center; align-items: center; border: 2px dashed var(--border); background: #f8fbfc; color: var(--text-secondary); text-align: center; padding: 24px; }
.compare-empty span { margin-top: 6px; font-size: 13px; }
@media (max-width: 720px) { .compare-heading { align-items: start; flex-direction: column; } }
</style>
