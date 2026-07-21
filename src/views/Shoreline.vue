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
      <div class="track-heading">
        <div>
          <span class="section-kicker">湖上巡护</span>
          <h3>巡护路线</h3>
        </div>
        <span class="route-status">路线示意</span>
      </div>
      <div class="track-card data-card">
        <div id="patrol-map" class="patrol-map" aria-label="渔政综合行政执法局至岳阳楼景区近水域的巡护路线地图"></div>
        <div class="patrol-summary">
          <div class="patrol-stat">
            <span>单程巡护约</span>
            <strong>{{ patrolDistance }} 公里</strong>
          </div>
          <div class="patrol-stat patrol-route-label">
            <span>行进方向</span>
            <strong>{{ patrolMeta.start }} <i>→</i> {{ patrolMeta.end }}</strong>
          </div>
          <button type="button" class="replay-button" @click="replayPatrol">{{ replayLabel }}</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
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
let patrolMap = null
let patrolBoatMarker = null
let patrolTimer = null
let patrolProgressLine = null

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
const patrolTrack = computed(() => dataStore.geo?.patrol_track || [])
const replayLabel = ref('重播路线')
const patrolMeta = computed(() => dataStore.geo?.patrol_meta || {
  start: '渔政综合行政执法局',
  end: '岳阳楼景区近水域',
  distance_km: 0,
})
const patrolDistance = computed(() => Number(patrolMeta.value.distance_km || 0).toFixed(1))

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

function boatIcon() {
  return L.divIcon({
    className: 'patrol-boat-shell',
    html: '<span class="patrol-boat" title="巡护船位置">🛥</span>',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

function initPatrolMap() {
  try {
    const el = document.getElementById('patrol-map')
    if (!el || patrolMap || patrolTrack.value.length < 2) return

    patrolMap = L.map(el, { zoomControl: true, scrollWheelZoom: false })
    L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
      subdomains: ['1', '2', '3', '4'],
      maxZoom: 18,
      attribution: '&copy; 高德地图',
    }).addTo(patrolMap)

    const track = patrolTrack.value
    L.polyline(track, { color: '#ffffff', weight: 8, opacity: 0.9, lineCap: 'round' }).addTo(patrolMap)
    L.polyline(track, { color: '#15769d', weight: 4, opacity: 0.95, lineCap: 'round', dashArray: '8 7' }).addTo(patrolMap)
    patrolProgressLine = L.polyline([track[0]], { color: '#ef9f32', weight: 5, opacity: 1, lineCap: 'round' }).addTo(patrolMap)
    L.circleMarker(track[0], { radius: 8, color: '#fff', weight: 3, fillColor: '#239b73', fillOpacity: 1 })
      .addTo(patrolMap).bindTooltip('起点：渔政综合行政执法局', { permanent: true, direction: 'right', offset: [10, 0], className: 'patrol-label' })
    L.circleMarker(track[track.length - 1], { radius: 8, color: '#fff', weight: 3, fillColor: '#d97706', fillOpacity: 1 })
      .addTo(patrolMap).bindTooltip('终点：岳阳楼景区近水域', { permanent: true, direction: 'left', offset: [-10, 0], className: 'patrol-label' })
    patrolBoatMarker = L.marker(track[0], { icon: boatIcon(), interactive: false }).addTo(patrolMap)
    patrolMap.fitBounds(L.latLngBounds(track), { padding: [46, 46], maxZoom: 14 })
    setTimeout(() => patrolMap?.invalidateSize(), 300)
    replayPatrol()
  } catch (error) {
    console.error('Patrol map initialization failed:', error)
  }
}

function replayPatrol() {
  const track = patrolTrack.value
  if (!patrolBoatMarker || track.length < 2) return
  if (patrolTimer) clearInterval(patrolTimer)
  patrolBoatMarker.setLatLng(track[0])
  patrolProgressLine?.setLatLngs([track[0]])
  patrolMap?.setView(track[0], Math.max(patrolMap.getZoom(), 13), { animate: true, duration: 0.35 })
  replayLabel.value = '巡护进行中'
  const duration = 6200
  const startTime = Date.now()

  const renderProgress = () => {
    const progress = Math.min((Date.now() - startTime) / duration, 1)
    const scaled = progress * (track.length - 1)
    const index = Math.min(Math.floor(scaled), track.length - 2)
    const ratio = scaled - index
    const from = track[index]
    const to = track[index + 1]
    const position = [
      from[0] + (to[0] - from[0]) * ratio,
      from[1] + (to[1] - from[1]) * ratio,
    ]
    patrolBoatMarker.setLatLng(position)
    patrolProgressLine?.setLatLngs([...track.slice(0, index + 1), position])
    if (progress < 1) {
      return
    } else {
      patrolProgressLine?.setLatLngs(track)
      clearInterval(patrolTimer)
      patrolTimer = null
      replayLabel.value = '重播路线'
    }
  }
  renderProgress()
  patrolTimer = setInterval(renderProgress, 80)
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
  nextTick(() => setTimeout(() => {
    initMap()
    initPatrolMap()
  }, 200))
})

onUnmounted(() => {
  markerById.clear()
  if (map) {
    map.remove()
    map = null
  }
  if (patrolTimer) clearInterval(patrolTimer)
  if (patrolMap) {
    patrolMap.remove()
    patrolMap = null
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

.patrol-boat-shell { background: transparent; border: 0; }
.patrol-boat { display: grid; width: 30px; height: 30px; place-items: center; border: 2px solid #fff; border-radius: 50%; background: #1f6281; box-shadow: 0 2px 8px rgba(20, 66, 87, 0.32); font-size: 16px; }
.patrol-label { padding: 4px 7px; border: 1px solid rgba(33, 62, 78, 0.2); border-radius: 4px; background: rgba(255, 255, 255, 0.94); box-shadow: 0 2px 6px rgba(20, 48, 64, 0.16); color: #203847; font-size: 12px; font-weight: 600; white-space: nowrap; }

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
.track-heading { display: flex; align-items: end; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
.track-heading h3 { margin: 2px 0 0; }
.route-status { padding: 3px 8px; border: 1px solid #b9d9e7; background: #f2f9fc; color: #1d6a89; font-size: 12px; }
.patrol-map { height: 360px; overflow: hidden; border: 1px solid var(--border); }
.patrol-summary { display: grid; grid-template-columns: minmax(132px, 0.55fr) minmax(0, 1.65fr) auto; gap: 12px; align-items: stretch; margin-top: 14px; }
.patrol-stat { display: flex; flex-direction: column; justify-content: center; min-width: 0; padding: 12px 14px; border-left: 3px solid #2e86ab; background: #f5fafc; }
.patrol-stat span { color: var(--text-muted); font-size: 12px; }
.patrol-stat strong { margin-top: 3px; color: var(--text-primary); font-size: 18px; line-height: 1.35; }
.patrol-route-label strong { font-size: 14px; }.patrol-route-label i { color: var(--primary); font-style: normal; }
.replay-button { align-self: center; min-height: 38px; padding: 0 13px; border: 1px solid #2e86ab; border-radius: 4px; background: #fff; color: #1c6988; cursor: pointer; font: inherit; font-size: 13px; }
.replay-button:hover { background: #eef8fb; }
.track-note { margin: 12px 0 0; color: var(--text-secondary); font-size: 13px; line-height: 1.7; }
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
  .track-heading { align-items: start; flex-direction: column; }
  .patrol-map { height: 300px; }
  .patrol-summary { grid-template-columns: 1fr; }
  .replay-button { justify-self: start; }
}
</style>
