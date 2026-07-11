<template>
  <div class="manager-page">
    <div class="page-top">
      <h2>🗺️ 岸线数据 — 管理</h2>
      <el-button type="primary" @click="openAdd">+ 添加点位</el-button>
    </div>

    <!-- 点位列表 -->
    <div class="card-list">
      <div v-for="p in dataStore.geo.points" :key="p.id" class="point-card">
        <div class="point-info">
          <strong>{{ p.name }}</strong>
          <span>📍 {{ p.lat.toFixed(4) }}, {{ p.lng.toFixed(4) }}</span>
        </div>
        <div class="point-actions">
          <el-button size="small" @click="openEdit(p)">编辑</el-button>
          <el-button size="small" type="danger" @click="deletePoint(p.id)">删除</el-button>
        </div>
      </div>
    </div>

    <!-- 巡护轨迹 -->
    <div class="section-spacer">
      <h3>🛥️ 巡护轨迹</h3>
      <el-input
        v-model="trackJson"
        type="textarea"
        :rows="4"
        placeholder='[[29.38,113.00],[29.39,113.01],...]  粘贴 GPS 坐标数组'
      />
      <el-button type="primary" size="small" style="margin-top:8px" @click="saveTrack">保存轨迹</el-button>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑点位' : '添加点位'" width="500px" destroy-on-close>
      <el-form :model="form" label-position="top" v-if="dialogVisible">
        <el-form-item label="点位名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="纬度 (lat)">
              <el-input-number v-model="form.lat" :precision="5" :step="0.01" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经度 (lng)">
              <el-input-number v-model="form.lng" :precision="5" :step="0.01" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="ID (英文标识)">
          <el-input v-model="form.id" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="2016 对比图">
          <div class="upload-row">
            <input type="file" accept="image/*" @change="e => onImageUpload(e, 'beforeImg')" ref="beforeInput" style="display:none" />
            <el-button @click="$refs.beforeInput.click()" size="small">上传</el-button>
            <el-input v-model="form.beforeImg" placeholder="或粘贴URL" size="small" style="flex:1" />
          </div>
        </el-form-item>
        <el-form-item label="2026 现状图">
          <div class="upload-row">
            <input type="file" accept="image/*" @change="e => onImageUpload(e, 'afterImg')" ref="afterInput" style="display:none" />
            <el-button @click="$refs.afterInput.click()" size="small">上传</el-button>
            <el-input v-model="form.afterImg" placeholder="或粘贴URL" size="small" style="flex:1" />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePoint">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDataStore } from '../../stores/data'
import { ElMessage, ElMessageBox } from 'element-plus'

const dataStore = useDataStore()
const dialogVisible = ref(false)
const editingId = ref(null)
const trackJson = ref(JSON.stringify(dataStore.geo.patrol_track || []))

const form = ref({ id: '', name: '', lat: 29.38, lng: 113.0, description: '', beforeImg: '', afterImg: '' })

function openAdd() {
  editingId.value = null
  form.value = { id: '', name: '', lat: 29.38, lng: 113.0, description: '', beforeImg: '', afterImg: '' }
  dialogVisible.value = true
}

function openEdit(p) {
  editingId.value = p.id
  form.value = JSON.parse(JSON.stringify(p))
  dialogVisible.value = true
}

async function savePoint() {
  await dataStore.saveGeoPoint({ ...form.value })
  ElMessage.success('已保存')
  dialogVisible.value = false
}

function deletePoint(id) {
  ElMessageBox.confirm('确定删除？', '确认', { type: 'warning' }).then(() => {
    dataStore.deleteGeoPoint(id)
    ElMessage.success('已删除')
  }).catch(() => {})
}

async function onImageUpload(e, key) {
  const file = e.target.files[0]
  if (!file) return
  const url = await dataStore.uploadImage(file)
  form.value[key] = url
}

function saveTrack() {
  try {
    const arr = JSON.parse(trackJson.value)
    dataStore.savePatrolTrack(arr)
    ElMessage.success('轨迹已保存')
  } catch {
    ElMessage.error('JSON 格式错误')
  }
}
</script>

<style scoped>
.manager-page { max-width: 900px; }
.page-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-top h2 { font-size: 20px; }
.card-list { display: flex; flex-direction: column; gap: 10px; }
.point-card {
  background: #fff; border-radius: 10px; padding: 16px 20px;
  display: flex; justify-content: space-between; align-items: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05); border: 1px solid #eee;
}
.point-info strong { display: block; }
.point-info span { font-size: 12px; color: var(--text-muted); }
.section-spacer { margin-top: 40px; }
.section-spacer h3 { font-size: 16px; margin-bottom: 12px; }
.upload-row { display: flex; gap: 8px; align-items: center; }
</style>
