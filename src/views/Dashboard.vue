<template>
  <div class="page-container">
    <h2 class="section-title">📊 数据看板</h2>
    <p class="section-subtitle">水质 · 植被 · 清滩 · 巡护 —— 全流程数据汇总</p>

    <!-- 统计卡片 -->
    <div class="stat-cards">
      <div class="stat-card data-card">
        <div class="stat-icon" style="background:#E8F4F8">💧</div>
        <div class="stat-info">
          <span class="stat-val">10年</span>
          <span class="stat-lbl">水质监测跨度</span>
        </div>
      </div>
      <div class="stat-card data-card">
        <div class="stat-icon" style="background:#E8F8E8">🌿</div>
        <div class="stat-info">
          <span class="stat-val">{{ (d.ndvi.hualong[2] * 100).toFixed(0) }}%</span>
          <span class="stat-lbl">华龙码头植被覆盖</span>
        </div>
      </div>
      <div class="stat-card data-card">
        <div class="stat-icon" style="background:#FFF3E0">{{ d.patrol.distance_km || '—' }}</div>
        <div class="stat-info">
          <span class="stat-val">待填</span>
          <span class="stat-lbl">巡护总里程 (km)</span>
        </div>
      </div>
      <div class="stat-card data-card">
        <div class="stat-icon" style="background:#F3E5F5">🐬</div>
        <div class="stat-info">
          <span class="stat-val">待填</span>
          <span class="stat-lbl">江豚目击次数</span>
        </div>
      </div>
    </div>

    <!-- 水质趋势 -->
    <section class="chart-row">
      <div class="chart-half">
        <h3>💧 叶绿素-a 浓度趋势（2016-2026）</h3>
        <div class="chart-box data-card">
          <v-chart :option="chlaOption" autoresize style="height: 320px" />
        </div>
      </div>
      <div class="chart-half">
        <h3>🌫️ 浊度趋势（2016-2026）</h3>
        <div class="chart-box data-card">
          <v-chart :option="turbOption" autoresize style="height: 320px" />
        </div>
      </div>
    </section>

    <!-- 植被覆盖 -->
    <section class="chart-row">
      <div class="chart-half">
        <h3>🌿 植被覆盖率</h3>
        <div class="chart-box data-card">
          <v-chart :option="vegOption" autoresize style="height: 320px" />
        </div>
      </div>
      <div class="chart-half">
        <h3>📈 NDVI 变化（三年对比）</h3>
        <div class="chart-box data-card">
          <v-chart :option="ndviOption" autoresize style="height: 320px" />
        </div>
      </div>
    </section>

    <!-- 清滩数据 -->
    <section class="full-chart">
      <h3>🗑️ 清滩垃圾类型对比</h3>
      <div class="chart-box data-card">
        <div v-if="!hasCleanupData" class="empty-state">
          <el-icon :size="32"><Delete /></el-icon>
          <p>清滩数据将在实地清滩活动后填入</p>
          <p class="empty-hint">对比华龙码头 vs 渔政岸段：塑料 / 渔网 / 泡沫 / 其他</p>
        </div>
        <v-chart v-else :option="cleanupOption" autoresize style="height: 320px" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { LineChart, BarChart, GaugeChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { Delete } from '@element-plus/icons-vue'
import { useDataStore } from '../stores/data'

const dataStore = useDataStore()
const d = computed(() => dataStore.dashboard)

use([LineChart, BarChart, GaugeChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

function _d() { return d.value }

const hasCleanupData = computed(() => {
  const h = _d().cleanup.hualong
  return h.plastic + h.net + h.foam + h.other > 0
})

const chlaOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '10%', top: '8%', containLabel: true },
  xAxis: { type: 'category', data: _d().water_quality.years.map(String) },
  yAxis: { type: 'value', name: 'μg/L' },
  series: [{
    type: 'line', data: _d().water_quality.chl_a, smooth: true,
    lineStyle: { color: '#2E86AB', width: 3 }, itemStyle: { color: '#2E86AB' },
    areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [{ offset: 0, color: 'rgba(46,134,171,0.2)' }, { offset: 1, color: 'rgba(46,134,171,0)' }]
    }},
  }],
}))

const turbOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '10%', top: '8%', containLabel: true },
  xAxis: { type: 'category', data: _d().water_quality.years.map(String) },
  yAxis: { type: 'value', name: 'NTU' },
  series: [{
    type: 'line', data: _d().water_quality.turbidity, smooth: true,
    lineStyle: { color: '#F18F01', width: 3 }, itemStyle: { color: '#F18F01' },
    areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [{ offset: 0, color: 'rgba(241,143,1,0.15)' }, { offset: 1, color: 'rgba(241,143,1,0)' }]
    }},
  }],
}))

const vegOption = computed(() => ({
  series: [
    { type: 'gauge', center: ['25%', '55%'], radius: '75%',
      startAngle: 200, endAngle: -20, min: 0, max: 1,
      axisLine: { lineStyle: { width: 16, color: [[0.5, '#F18F01'], [1, '#27AE60']] } },
      axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
      detail: { formatter: (v) => (v * 100).toFixed(1) + '%', fontSize: 22, offsetCenter: [0, '65%'] },
      data: [{ value: _d().vegetation.hualong, name: '华龙码头' }],
    },
    { type: 'gauge', center: ['75%', '55%'], radius: '75%',
      startAngle: 200, endAngle: -20, min: 0, max: 1,
      axisLine: { lineStyle: { width: 16, color: [[0.6, '#F18F01'], [1, '#27AE60']] } },
      axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
      detail: { formatter: (v) => (v * 100).toFixed(1) + '%', fontSize: 22, offsetCenter: [0, '65%'] },
      data: [{ value: _d().vegetation.dongting, name: '东洞庭湖湿地' }],
    },
  ],
  graphic: [
    { type: 'text', left: 'center', top: '85%', style: { text: '华龙码头　　　　　　东洞庭湖湿地', fill: '#5A6C7D', fontSize: 13, textAlign: 'center' } },
  ],
}))

const ndviOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['华龙码头', '东洞庭湖湿地'], bottom: 0 },
  grid: { left: '3%', right: '4%', bottom: '12%', top: '8%', containLabel: true },
  xAxis: { type: 'category', data: _d().ndvi.years.map(String) },
  yAxis: { type: 'value', min: 0, max: 1, axisLabel: { formatter: '{value}' } },
  color: ['#2E86AB', '#27AE60'],
  series: [
    { name: '华龙码头', type: 'bar', data: _d().ndvi.hualong, barWidth: '28%', itemStyle: { borderRadius: [4, 4, 0, 0] } },
    { name: '东洞庭湖湿地', type: 'bar', data: _d().ndvi.dongting, barWidth: '28%', itemStyle: { borderRadius: [4, 4, 0, 0] } },
  ],
}))

const cleanupOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['华龙码头', '渔政岸段'] },
  grid: { left: '3%', right: '4%', bottom: '10%', top: '12%', containLabel: true },
  xAxis: { type: 'category', data: ['塑料', '渔网', '泡沫', '其他'] },
  yAxis: { type: 'value', name: '重量 (kg)' },
  color: ['#2E86AB', '#F18F01'],
  series: [
    { name: '华龙码头', type: 'bar', data: [_d().cleanup.hualong.plastic, _d().cleanup.hualong.net, _d().cleanup.hualong.foam, _d().cleanup.hualong.other] },
    { name: '渔政岸段', type: 'bar', data: [_d().cleanup.fishery.plastic, _d().cleanup.fishery.net, _d().cleanup.fishery.foam, _d().cleanup.fishery.other] },
  ],
}))
</script>

<style scoped>
.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}

.stat-card {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-val {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  display: block;
}

.stat-lbl {
  font-size: 13px;
  color: var(--text-secondary);
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.chart-row h3,
.full-chart h3 {
  font-size: 16px;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.chart-box { padding: 16px; }

.full-chart { margin-bottom: 32px; }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px;
  color: var(--text-muted);
}

.empty-state p { font-size: 14px; }
.empty-hint { font-size: 12px !important; opacity: 0.6; }

@media (max-width: 768px) {
  .chart-row { grid-template-columns: 1fr; }
  .stat-cards { grid-template-columns: repeat(2, 1fr); }
}
</style>
