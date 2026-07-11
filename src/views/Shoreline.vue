<template>
  <div class="page-container">
    <h2 class="section-title">🗺️ 岸线寻访</h2>
    <p class="section-subtitle">交互地图 + 卫星对比 + NDVI趋势 —— 用数据丈量洞庭湖岸线变迁</p>

    <!-- 交互地图 -->
    <section class="map-section">
      <h3>📍 洞庭湖岸线点位</h3>
      <div class="map-wrapper">
        <div id="shoreline-map" style="height:450px;width:100%;border-radius:12px;background:#e8f0f5;">
          <div v-if="mapError" style="padding:40px;text-align:center;color:#e74c3c;">
            ⚠️ 地图加载失败，请查看浏览器控制台 (F12)
          </div>
        </div>
        <div class="map-legend">
          <div class="legend-item"><span class="dot active"></span> 核心点位</div>
          <div class="legend-item"><span class="dot patrol"></span> 巡护轨迹（待填）</div>
          <div class="legend-item"><span class="dot fisherman"></span> 渔民标注（待填）</div>
        </div>
      </div>
    </section>

    <!-- 对比卡片 -->
    <section class="compare-section" v-if="selectedPoint">
      <h3>🔍 {{ selectedPoint.name }} — 今昔对比</h3>
      <div class="compare-card data-card">
        <div class="compare-slider">
          <div class="compare-pane">
            <div class="compare-label">2016 卫星影像</div>
            <div class="compare-img placeholder-img">
              <el-icon :size="36"><PictureFilled /></el-icon>
              <span>2016 卫星图</span>
            </div>
          </div>
          <div class="compare-divider">
            <el-icon :size="24"><DArrowLeft /></el-icon>
            <span>VS</span>
            <el-icon :size="24"><DArrowRight /></el-icon>
          </div>
          <div class="compare-pane">
            <div class="compare-label">2026 无人机航拍</div>
            <div class="compare-img placeholder-img">
              <el-icon :size="36"><PictureFilled /></el-icon>
              <span>2026 航拍图</span>
            </div>
          </div>
        </div>
        <p class="compare-desc">{{ selectedPoint.description }}</p>
      </div>
    </section>

    <!-- NDVI 趋势 -->
    <section class="chart-section">
      <h3>📈 NDVI 植被覆盖趋势</h3>
      <div class="chart-card data-card">
        <v-chart :option="ndviOption" autoresize style="height: 380px" />
      </div>
    </section>

    <!-- 巡护轨迹 -->
    <section class="track-section">
      <h3>🛥️ 巡护轨迹（Day 4）</h3>
      <div class="track-card data-card empty-state">
        <el-icon :size="32"><Guide /></el-icon>
        <p>GPS巡护轨迹将在实地调研后填入</p>
        <p class="empty-hint">跟随渔政执法船巡护的GPS轨迹数据</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { PictureFilled, DArrowLeft, DArrowRight, VideoPlay, Guide } from '@element-plus/icons-vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useDataStore } from '../stores/data'

use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const dataStore = useDataStore()
const selectedPoint = ref(null)
const mapError = ref(false)
let map = null

function initMap() {
  try {
    const el = document.getElementById('shoreline-map')
    if (!el) { console.error('❌ shoreline-map not found'); return }
    if (map) return

    console.log('🗺️ Init map, container size:', el.offsetWidth, 'x', el.offsetHeight)

    map = L.map(el).setView([29.38, 113.02], 11)

    // 国内可用瓦片 — 高德地图
    L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
      subdomains: ['1', '2', '3', '4'],
      maxZoom: 18,
      attribution: '&copy; 高德地图',
    }).addTo(map)

    // 标记点
    const pts = dataStore.geo?.points || []
    console.log('📍 Points:', pts.length)
    pts.forEach(point => {
      L.marker([point.lat, point.lng])
        .addTo(map)
        .bindPopup(`<b>${point.name}</b>`)
        .on('click', () => { selectedPoint.value = point })
    })

    map.on('click', () => { selectedPoint.value = null })

    setTimeout(() => { if (map) map.invalidateSize() }, 300)
  } catch (e) {
    console.error('❌ Map init error:', e)
    mapError.value = true
  }
}

const ndviOption = {
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
}

onMounted(() => {
  nextTick(() => setTimeout(initMap, 200))
})

onUnmounted(() => {
  if (map) { map.remove(); map = null }
})
</script>

<style>
/* 全局样式 — 确保 Leaflet 显示 */
#shoreline-map {
  height: 450px !important;
  width: 100%;
  border-radius: 12px;
  z-index: 1;
}

#shoreline-map .leaflet-container {
  height: 100% !important;
}
</style>

<style scoped>
.map-section { margin-bottom: 40px; }
.map-section h3,
.chart-section h3,
.compare-section h3,
.track-section h3 {
  font-size: 18px; margin-bottom: 12px; color: var(--text-primary);
}

.map-wrapper {
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.map-legend {
  position: absolute;
  bottom: 16px; right: 16px;
  background: rgba(255,255,255,0.95);
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 12px;
  box-shadow: var(--shadow);
}

.legend-item {
  display: flex; align-items: center; gap: 8px; margin-bottom: 4px;
}
.legend-item:last-child { margin-bottom: 0; }

.dot {
  width: 10px; height: 10px; border-radius: 50%; display: inline-block;
}
.dot.active { background: var(--primary); }
.dot.patrol { background: var(--accent); }
.dot.fisherman { background: #27AE60; }

/* 对比 */
.compare-section { margin-bottom: 40px; }
.compare-card { padding: 24px; }
.compare-slider { display: flex; align-items: center; gap: 16px; }
.compare-pane { flex: 1; }
.compare-label { font-size: 13px; font-weight: 600; color: var(--text-secondary); margin-bottom: 8px; text-align: center; }
.compare-img { aspect-ratio: 16/9; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; font-size: 13px; }
.placeholder-img { background: var(--bg-light); border: 2px dashed var(--border); color: var(--text-muted); }
.compare-divider { display: flex; flex-direction: column; align-items: center; gap: 4px; color: var(--text-muted); font-weight: 700; font-size: 14px; white-space: nowrap; }
.compare-desc { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); font-size: 14px; color: var(--text-secondary); line-height: 1.7; }

/* Chart */
.chart-section { margin-bottom: 40px; }
.chart-card { padding: 24px; }

/* 占位 */
.track-section { margin-bottom: 40px; }
.track-card { padding: 24px; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 40px; color: var(--text-muted); text-align: center; }
.empty-state p { font-size: 14px; }
.empty-hint { font-size: 12px !important; opacity: 0.6; }

@media (max-width: 768px) {
  #shoreline-map { height: 320px !important; }
  .compare-slider { flex-direction: column; }
  .compare-divider { flex-direction: row; }
}
</style>
