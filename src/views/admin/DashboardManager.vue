<template>
  <div class="manager-page">
    <h2>📊 数据看板 — 管理</h2>
    <p class="desc">修改数值后点击下方「保存全部」生效。</p>

    <!-- 水质 -->
    <div class="section">
      <h3>💧 水质数据</h3>
      <el-table :data="waterRows" border size="small">
        <el-table-column prop="year" label="年份" width="80" />
        <el-table-column label="叶绿素-a (μg/L)">
          <template #default="{row}">
            <el-input-number v-model="row.chl_a" :precision="1" size="small" controls-position="right" style="width:120px" />
          </template>
        </el-table-column>
        <el-table-column label="浊度 (NTU)">
          <template #default="{row}">
            <el-input-number v-model="row.turbidity" :precision="1" size="small" controls-position="right" style="width:120px" />
          </template>
        </el-table-column>
      </el-table>
      <el-button size="small" type="primary" style="margin-top:8px" @click="addWaterYear">+ 添加年份</el-button>
    </div>

    <!-- 植被 -->
    <div class="section">
      <h3>🌿 植被覆盖度</h3>
      <el-form label-width="160px" size="small">
        <el-form-item label="华龙码头">
          <el-input-number v-model="dash.vegetation.hualong" :min="0" :max="1" :precision="2" :step="0.05" />
        </el-form-item>
        <el-form-item label="东洞庭湖湿地">
          <el-input-number v-model="dash.vegetation.dongting" :min="0" :max="1" :precision="2" :step="0.05" />
        </el-form-item>
      </el-form>
    </div>

    <!-- NDVI -->
    <div class="section">
      <h3>📈 NDVI</h3>
      <el-table :data="ndviRows" border size="small">
        <el-table-column prop="year" label="年份" width="80" />
        <el-table-column label="华龙码头">
          <template #default="{row}">
            <el-input-number v-model="row.hualong" :min="0" :max="1" :precision="2" size="small" style="width:120px" />
          </template>
        </el-table-column>
        <el-table-column label="东洞庭湖湿地">
          <template #default="{row}">
            <el-input-number v-model="row.dongting" :min="0" :max="1" :precision="2" size="small" style="width:120px" />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 清滩 -->
    <div class="section">
      <h3>🗑️ 清滩数据</h3>
      <el-row :gutter="16">
        <el-col :span="12">
          <h4>华龙码头</h4>
          <el-form label-width="80px" size="small">
            <el-form-item label="塑料(kg)"><el-input-number v-model="dash.cleanup.hualong.plastic" :min="0" /></el-form-item>
            <el-form-item label="渔网(kg)"><el-input-number v-model="dash.cleanup.hualong.net" :min="0" /></el-form-item>
            <el-form-item label="泡沫(kg)"><el-input-number v-model="dash.cleanup.hualong.foam" :min="0" /></el-form-item>
            <el-form-item label="其他(kg)"><el-input-number v-model="dash.cleanup.hualong.other" :min="0" /></el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <h4>渔政岸段</h4>
          <el-form label-width="80px" size="small">
            <el-form-item label="塑料(kg)"><el-input-number v-model="dash.cleanup.fishery.plastic" :min="0" /></el-form-item>
            <el-form-item label="渔网(kg)"><el-input-number v-model="dash.cleanup.fishery.net" :min="0" /></el-form-item>
            <el-form-item label="泡沫(kg)"><el-input-number v-model="dash.cleanup.fishery.foam" :min="0" /></el-form-item>
            <el-form-item label="其他(kg)"><el-input-number v-model="dash.cleanup.fishery.other" :min="0" /></el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <!-- 巡护 -->
    <div class="section">
      <h3>🛥️ 巡护统计</h3>
      <el-form label-width="140px" size="small">
        <el-form-item label="总里程 (km)"><el-input-number v-model="dash.patrol.distance_km" :min="0" :precision="1" /></el-form-item>
        <el-form-item label="总时长 (h)"><el-input-number v-model="dash.patrol.duration_h" :min="0" :precision="1" /></el-form-item>
        <el-form-item label="覆盖面积 (km²)"><el-input-number v-model="dash.patrol.area_km2" :min="0" :precision="1" /></el-form-item>
      </el-form>
    </div>

    <el-button type="primary" size="large" @click="saveAll" style="margin-top:24px">💾 保存全部</el-button>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useDataStore } from '../../stores/data'
import { ElMessage } from 'element-plus'

const dataStore = useDataStore()

const dash = reactive(JSON.parse(JSON.stringify(dataStore.dashboard)))

const waterRows = ref([])
const ndviRows = ref([])

onMounted(() => {
  // 水质表格
  const { years, chl_a, turbidity } = dash.water_quality
  waterRows.value = years.map((y, i) => ({ year: y, chl_a: chl_a[i] || 0, turbidity: turbidity[i] || 0 }))

  // NDVI 表格
  const { years: ndviYears, hualong, dongting } = dash.ndvi
  ndviRows.value = ndviYears.map((y, i) => ({ year: y, hualong: hualong[i] || 0, dongting: dongting[i] || 0 }))
})

function addWaterYear() {
  const last = waterRows.value[waterRows.value.length - 1]
  const newYear = last ? last.year + 1 : 2016
  waterRows.value.push({ year: newYear, chl_a: 0, turbidity: 0 })
}

async function saveAll() {
  // 水质
  dash.water_quality.years = waterRows.value.map(r => r.year)
  dash.water_quality.chl_a = waterRows.value.map(r => r.chl_a)
  dash.water_quality.turbidity = waterRows.value.map(r => r.turbidity)

  // NDVI
  dash.ndvi.years = ndviRows.value.map(r => r.year)
  dash.ndvi.hualong = ndviRows.value.map(r => r.hualong)
  dash.ndvi.dongting = ndviRows.value.map(r => r.dongting)

  await dataStore.saveDashboard({ ...dash })
  ElMessage.success('数据看板已保存')
}
</script>

<style scoped>
.manager-page { max-width: 900px; }
.desc { color: var(--text-muted); margin-bottom: 24px; }
.section {
  background: #fff; border-radius: 10px; padding: 20px;
  margin-bottom: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); border: 1px solid #eee;
}
.section h3 { font-size: 16px; margin-bottom: 16px; }
.section h4 { font-size: 14px; margin-bottom: 12px; color: var(--text-secondary); }
</style>
