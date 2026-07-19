<template>
  <div class="page-container shoreline-page">
    <h2 class="section-title">岸线寻访</h2>
    <p class="section-subtitle">调查点地图、历史卫星影像时间轴与实地航拍对照</p>

    <section class="map-section" aria-labelledby="map-heading">
      <h3 id="map-heading">洞庭湖岸线调查点位</h3>
      <div class="map-wrapper">
        <div id="shoreline-map" class="shoreline-map">
          <div v-if="mapError" class="map-error">地图加载失败，请检查网络连接后重试。</div>
        </div>
        <div class="map-legend" aria-label="点位图例">
          <span><i class="legend-dot legend-dot--nanhu"></i>公园广场</span>
          <span><i class="legend-dot legend-dot--wharf"></i>码头</span>
          <span><i class="legend-dot legend-dot--fishery"></i>渔政监督</span>
        </div>
      </div>
    </section>

    <section v-if="selectedPoint" id="satellite-timeline" class="imagery-section" aria-live="polite">
      <div class="section-heading-row">
        <div>
          <span class="section-kicker">调查点影像档案</span>
          <h3>{{ selectedPoint.name }} 岸线变迁影像</h3>
        </div>
        <span class="coordinate-status">{{ selectedPoint.displayCoordinateSystem }}</span>
      </div>

      <div class="imagery-card data-card">
        <SatelliteTimeline v-model="activeHistoricalYear" :point="selectedPoint" />

        <div class="field-flight">
          <div class="field-flight__heading">
            <div>
              <span class="section-kicker">现场对照</span>
              <h4>{{ activeHistoricalEntry.year }} 历史影像与 2026 实地航拍</h4>
            </div>
            <span class="comparison-mode">并排展示</span>
          </div>
          <div class="field-flight__grid">
            <div class="comparison-pane">
              <span>{{ activeHistoricalEntry.year }} 历史卫星影像</span>
              <img
                v-if="activeHistoricalEntry.image"
                :src="mediaUrl(activeHistoricalEntry.image)"
                :alt="`${selectedPoint.name} ${activeHistoricalEntry.year} 年卫星影像`"
                loading="lazy"
                decoding="async"
              />
              <div v-else class="image-placeholder">历史卫星影像待补充</div>
            </div>
            <div class="comparison-pane">
              <span>2026 实地航拍</span>
              <img
                v-if="selectedPoint.current?.image"
                :src="mediaUrl(selectedPoint.current.image)"
                :alt="`${selectedPoint.name} 2026 年实地航拍`"
                loading="lazy"
                decoding="async"
              />
              <div v-else class="image-placeholder image-placeholder--current">
                2026 实地航拍将在社会实践期间补充
              </div>
            </div>
          </div>
          <p class="field-flight__note">{{ selectedPoint.current?.note || '2026 年实地航拍待补充。' }}</p>
        </div>

        <ImageCompareSlider
          :entries="selectedPoint.timeline"
          :left-entry="compareLeftEntry"
          :right-entry="compareRightEntry"
          :point-name="selectedPoint.name"
          @update:left-year="compareLeftYear = $event"
          @update:right-year="compareRightYear = $event"
        />

        <p class="scientific-note">{{ selectedPoint.description }}</p>
        <p class="coordinate-note">坐标说明：{{ selectedPoint.coordinateNote }}</p>
      </div>
    </section>

    <section class="chart-section">
      <h3>NDVI 植被覆盖趋势</h3>
      <div class="chart-card data-card">
        <v-chart :option="ndviOption" autoresize style="height: 380px" />
      </div>
    </section>

    <section class="track-section">
      <h3>巡护轨迹</h3>
      <div class="track-card data-card empty-state">
        <el-icon :size="32"><Guide /></el-icon>
        <p>GPS 巡护轨迹将在实地调研后补充。</p>
        <p class="empty-hint">将记录随渔政执法船巡护的真实 GPS 轨迹数据。</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Guide } from '@element-plus/icons-vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import SatelliteTimeline from '../components/SatelliteTimeline.vue'
import ImageCompareSlider from '../components/ImageCompareSlider.vue'
import { useDataStore } from '../stores/data'

use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const dataStore = useDataStore()
const selectedPoint = ref(null)
const mapError = ref(false)
const activeHistoricalYear = ref(2016)
const compareLeftYear = ref(2016)
const compareRightYear = ref(2021)
const markerById = new Map()
let map = null

const pointMarkerMeta = {
  hualong: { icon: '⚓', type: 'wharf', label: '华龙码头（江豚湾）' },
  'nanhu-square': { icon: '🏞️', type: 'nanhu', label: '南湖广场公园' },
  'dongting-wetland': { icon: '🌿', type: 'wetland', label: '东洞庭湖湿地' },
  fishery: { icon: '🛥', type: 'fishery', label: '渔政监督管理局' },
}

const activeHistoricalEntry = computed(() => {
  const entries = selectedPoint.value?.timeline || []
  return entries.find(entry => entry.year === activeHistoricalYear.value) || entries[0] || { year: 2016 }
})

const visiblePoints = computed(() => (dataStore.geo?.points || []).filter(point => point.showOnShoreline !== false))

const compareLeftEntry = computed(() => {
  const entries = selectedPoint.value?.timeline || []
  return entries.find(entry => entry.year === compareLeftYear.value) || entries[0] || { year: 2016 }
})

const compareRightEntry = computed(() => {
  const entries = selectedPoint.value?.timeline || []
  return entries.find(entry => entry.year === compareRightYear.value) || entries[entries.length - 1] || { year: 2021 }
})

function mediaUrl(path) {
  if (!path || /^(https?:|data:|blob:)/.test(path)) return path || ''
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

function markerIconFor(point) {
  const meta = pointMarkerMeta[point.id] || { icon: '📍', type: 'default', label: point.name }
  return L.divIcon({
    className: 'shoreline-marker-shell',
    html: `<span class="shoreline-marker shoreline-marker--${meta.type}" title="${meta.label}"><i>${meta.icon}</i></span>`,
    iconSize: [42, 42],
    iconAnchor: [21, 40],
    popupAnchor: [0, -38],
  })
}

function updateMarkerSelection() {
  markerById.forEach((marker, id) => {
    const selected = id === selectedPoint.value?.id
    marker.setZIndexOffset(selected ? 1000 : 0)
    marker.getElement()?.classList.toggle('is-selected', selected)
  })
}

function selectPoint(point, scrollToTimeline = false) {
  selectedPoint.value = point
  activeHistoricalYear.value = point.timeline?.[0]?.year || 2016
  compareLeftYear.value = point.timeline?.[0]?.year || 2016
  compareRightYear.value = point.timeline?.[point.timeline.length - 1]?.year || 2021
  updateMarkerSelection()

  if (scrollToTimeline) {
    nextTick(() => {
      document.getElementById('satellite-timeline')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
}

function initMap() {
  try {
    const el = document.getElementById('shoreline-map')
    if (!el || map) return

    map = L.map(el).setView([29.40, 113.00], 10)
    L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
      subdomains: ['1', '2', '3', '4'],
      maxZoom: 18,
      attribution: '&copy; 高德地图',
    }).addTo(map)

    const points = visiblePoints.value
    const markerPositions = []
    points.forEach(point => {
      const position = [point.displayLat ?? point.lat, point.displayLng ?? point.lng]
      const labelOnLeft = position[1] >= 113.09
      markerPositions.push(position)
      const marker = L.marker(position, { icon: markerIconFor(point) })
        .addTo(map)
        .bindTooltip(point.name, {
          permanent: true,
          direction: labelOnLeft ? 'left' : 'top',
          offset: labelOnLeft ? [-28, 0] : [0, -38],
          className: 'shoreline-marker-label',
        })
        .bindPopup(`<b>${point.name}</b><br/>${point.address || '地址待现场核验'}<br/>点击查看历史影像时间轴`)
        .on('click', () => selectPoint(point, true))
      markerById.set(point.id, marker)
    })

    if (markerPositions.length) {
      map.fitBounds(L.latLngBounds(markerPositions), { padding: [72, 72], maxZoom: 11 })
    }

    updateMarkerSelection()
    setTimeout(() => map?.invalidateSize(), 300)
  } catch (error) {
    console.error('Map initialization failed:', error)
    mapError.value = true
  }
}

const ndviOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['华龙码头（江豚湾）', '东洞庭湖湿地'], bottom: 0 },
  grid: { left: '3%', right: '4%', bottom: '12%', top: '8%', containLabel: true },
  xAxis: { type: 'category', data: dataStore.dashboard.ndvi.years.map(String), name: '年份' },
  yAxis: { type: 'value', name: 'NDVI', min: 0, max: 1, axisLabel: { formatter: '{value}' } },
  color: ['#2E86AB', '#27AE60'],
  series: [
    { name: '华龙码头（江豚湾）', type: 'bar', data: dataStore.dashboard.ndvi.hualong, barWidth: '32%', itemStyle: { borderRadius: [4, 4, 0, 0] } },
    { name: '东洞庭湖湿地', type: 'bar', data: dataStore.dashboard.ndvi.dongting, barWidth: '32%', itemStyle: { borderRadius: [4, 4, 0, 0] } },
  ],
}))

onMounted(() => {
  const defaultPoint = visiblePoints.value.find(point => point.id === 'hualong') || visiblePoints.value[0]
  if (defaultPoint) selectPoint(defaultPoint)
  nextTick(() => setTimeout(initMap, 200))
})

onUnmounted(() => {
  markerById.clear()
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style>
#shoreline-map {
  height: 450px;
  width: 100%;
  z-index: 1;
}

.shoreline-marker-shell {
  background: transparent;
  border: 0;
}

.shoreline-marker {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border: 2px solid #fff;
  border-radius: 50% 50% 50% 0;
  box-shadow: 0 3px 9px rgba(25, 62, 82, 0.28);
  font-size: 19px;
  line-height: 1;
  transform: rotate(-45deg);
  transition: box-shadow 160ms ease, transform 160ms ease;
}

.shoreline-marker i { font-style: normal; transform: rotate(45deg); }
.shoreline-marker--wharf { background: #d97706; }
.shoreline-marker--nanhu { background: #1683c7; }
.shoreline-marker--wetland { background: #2f9e61; }
.shoreline-marker--fishery { background: #6b5cc5; }
.shoreline-marker--default { background: #2e86ab; }
.shoreline-marker-shell.is-selected .shoreline-marker { box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.9), 0 0 0 8px rgba(46, 134, 171, 0.45); transform: rotate(-45deg) scale(1.14); }

.shoreline-marker-label {
  padding: 4px 7px;
  border: 1px solid rgba(33, 62, 78, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 2px 6px rgba(20, 48, 64, 0.16);
  color: #203847;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.leaflet-tooltip-top.shoreline-marker-label::before {
  border-top-color: rgba(255, 255, 255, 0.94);
}
</style>

<style scoped>
.shoreline-page { padding-top: 36px; }
.map-section, .imagery-section, .chart-section, .track-section { margin-bottom: 42px; }
.map-section h3, .chart-section h3, .track-section h3 { margin-bottom: 12px; color: var(--text-primary); font-size: 19px; }
.map-wrapper { position: relative; overflow: hidden; border-radius: var(--radius); box-shadow: var(--shadow); }
.map-error { padding: 40px; color: #c0392b; text-align: center; }
.map-legend { position: absolute; right: 14px; bottom: 14px; display: grid; grid-template-columns: repeat(2, max-content); gap: 5px 12px; padding: 9px 12px; background: rgba(255, 255, 255, 0.94); box-shadow: var(--shadow); color: var(--text-secondary); font-size: 12px; }
.map-legend span { display: inline-flex; align-items: center; gap: 5px; }
.legend-dot { width: 9px; height: 9px; border-radius: 50%; }
.legend-dot--wharf { background: #d97706; }.legend-dot--nanhu { background: #1683c7; }.legend-dot--wetland { background: #2f9e61; }.legend-dot--fishery { background: #6b5cc5; }
.section-heading-row { display: flex; justify-content: space-between; align-items: start; gap: 18px; margin-bottom: 12px; }
.section-kicker { color: var(--primary); font-size: 13px; font-weight: 700; }
.section-heading-row h3 { margin-top: 2px; color: var(--text-primary); font-size: 22px; }
.coordinate-status, .comparison-mode { padding: 3px 8px; border: 1px solid var(--border); background: #fff; color: var(--text-muted); font-size: 12px; }
.imagery-card, .chart-card, .track-card { padding: 22px; }
.field-flight { margin-top: 26px; padding-top: 22px; border-top: 1px solid var(--border); }
.field-flight__heading { display: flex; justify-content: space-between; align-items: end; gap: 12px; margin-bottom: 12px; }
.field-flight h4 { margin-top: 2px; color: var(--text-primary); font-size: 17px; }
.field-flight__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.comparison-pane { min-width: 0; }
.comparison-pane > span { display: block; margin-bottom: 7px; color: var(--text-secondary); font-size: 13px; font-weight: 600; }
.comparison-pane img, .image-placeholder { aspect-ratio: 16 / 9; width: 100%; display: block; object-fit: cover; border: 1px solid var(--border); }
.image-placeholder { display: grid; place-items: center; padding: 16px; background: #f7fbfc; color: var(--text-muted); font-size: 13px; text-align: center; }
.image-placeholder--current { background: #f0f7fa; color: var(--primary-dark); }
.field-flight__note, .scientific-note, .coordinate-note { margin: 12px 0 0; color: var(--text-secondary); font-size: 13px; line-height: 1.7; }
.coordinate-note { color: var(--text-muted); }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 40px; color: var(--text-muted); text-align: center; }
.empty-state p { font-size: 14px; }.empty-hint { font-size: 12px !important; opacity: 0.7; }
@media (max-width: 768px) {
  #shoreline-map { height: 330px; }
  .map-legend { left: 12px; right: auto; grid-template-columns: 1fr; }
  .section-heading-row, .field-flight__heading { align-items: start; flex-direction: column; }
  .field-flight__grid { grid-template-columns: 1fr; }
  .imagery-card, .chart-card, .track-card { padding: 16px; }
}
</style>
