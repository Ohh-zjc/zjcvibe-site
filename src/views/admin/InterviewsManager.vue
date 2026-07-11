<template>
  <div class="manager-page">
    <div class="page-top">
      <h2>🎙️ 护江者说 — 管理</h2>
      <el-button type="primary" @click="openAdd">+ 添加人物</el-button>
    </div>

    <!-- 人物列表 -->
    <div class="card-list">
      <div v-for="p in dataStore.interviews" :key="p.id" class="person-card">
        <div class="person-info">
          <img v-if="p.photo && !p.photo.includes('placeholder')" :src="p.photo" class="person-thumb" />
          <div v-else class="person-thumb placeholder">📷</div>
          <div>
            <strong>{{ p.name }}</strong>
            <span class="person-role">{{ p.identity }}</span>
          </div>
        </div>
        <div class="person-actions">
          <el-button size="small" @click="openEdit(p)">编辑</el-button>
          <el-button size="small" type="danger" @click="deletePerson(p.id)">删除</el-button>
        </div>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingId ? '编辑人物' : '添加人物'"
      width="700px"
      destroy-on-close
    >
      <el-form :model="form" label-position="top" v-if="dialogVisible">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份标签">
              <el-input v-model="form.identity" placeholder="如：城陵矶水文站退休职工" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="一句话简介">
          <el-input v-model="form.summary" type="textarea" :rows="2" />
        </el-form-item>

        <el-form-item label="金句">
          <el-input v-model="form.quote" placeholder="如：以前打鱼，现在护鱼" />
        </el-form-item>

        <el-form-item label="人物照片">
          <div class="upload-row">
            <input type="file" accept="image/*" @change="onPhotoUpload" ref="photoInput" style="display:none" />
            <el-button @click="$refs.photoInput.click()">📷 上传照片</el-button>
            <img v-if="form.photo && !form.photo.includes('placeholder')" :src="form.photo" class="preview-img" />
            <span v-else class="no-photo">未上传</span>
          </div>
        </el-form-item>

        <el-form-item label="采访录音">
          <div class="upload-row">
            <input type="file" accept="audio/*" @change="onAudioUpload" ref="audioInput" style="display:none" />
            <el-button @click="$refs.audioInput.click()">🎵 上传录音</el-button>
            <audio v-if="form.audio" :src="form.audio" controls style="max-width:300px" />
            <span v-else class="no-photo">未上传</span>
          </div>
          <div style="margin-top:8px">
            <el-input v-model="form.audio" placeholder="或直接粘贴音频 URL" size="small" />
          </div>
        </el-form-item>

        <el-form-item label="转写文字稿">
          <el-input v-model="form.transcript" type="textarea" :rows="5" placeholder="AI 转写全文或手动输入" />
        </el-form-item>

        <el-form-item label="更多照片">
          <div class="photo-list">
            <div v-for="(p, i) in form.photos" :key="i" class="photo-item">
              <img v-if="p && !p.includes('placeholder')" :src="p" />
              <span v-else>📷 照片{{ i+1 }}</span>
              <el-button size="small" type="danger" circle @click="form.photos.splice(i,1)">✕</el-button>
            </div>
            <div class="photo-add" @click="addPhotoUrl">
              <span>+</span>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="时间线事件">
          <div v-for="(ev, i) in form.timeline" :key="i" class="timeline-row">
            <el-input v-model="ev.year" placeholder="年份" style="width:100px" size="small" />
            <el-input v-model="ev.event" placeholder="事件描述" size="small" style="flex:1" />
            <el-button size="small" type="danger" circle @click="form.timeline.splice(i,1)">✕</el-button>
          </div>
          <el-button size="small" @click="form.timeline.push({year:'',event:''})">+ 添加事件</el-button>
        </el-form-item>

        <el-form-item label="关键词（逗号分隔）">
          <el-input v-model="keywordsStr" placeholder="如：水文, 城陵矶, 水位" />
        </el-form-item>

      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePerson">保存</el-button>
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
const keywordsStr = ref('')

const defaultForm = () => ({
  id: Date.now(),
  name: '',
  identity: '',
  summary: '',
  quote: '',
  photo: '/img/placeholder-person.jpg',
  audio: null,
  audio_segments: [],
  transcript: '',
  photos: ['/img/placeholder-person.jpg'],
  timeline: [],
  waveform: null,
  sentiment: null,
  keywords: [],
})

const form = ref(defaultForm())

function openAdd() {
  editingId.value = null
  form.value = defaultForm()
  form.value.id = Date.now()
  keywordsStr.value = ''
  dialogVisible.value = true
}

function openEdit(p) {
  editingId.value = p.id
  form.value = JSON.parse(JSON.stringify(p))
  keywordsStr.value = (p.keywords || []).join(', ')
  dialogVisible.value = true
}

async function onPhotoUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  const url = await dataStore.uploadImage(file)
  form.value.photo = url
}

async function onAudioUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  const url = await dataStore.uploadImage(file)
  form.value.audio = url
}

function addPhotoUrl() {
  const url = prompt('输入图片URL，或留空添加占位：')
  form.value.photos.push(url || '/img/placeholder-person.jpg')
}

async function savePerson() {
  form.value.keywords = keywordsStr.value.split(',').map(k => k.trim()).filter(Boolean)
  await dataStore.saveInterview({ ...form.value })
  ElMessage.success('已保存')
  dialogVisible.value = false
}

function deletePerson(id) {
  ElMessageBox.confirm('确定删除该人物？', '确认', { type: 'warning' }).then(() => {
    dataStore.deleteInterview(id)
    ElMessage.success('已删除')
  }).catch(() => {})
}
</script>

<style scoped>
.manager-page { max-width: 900px; }

.page-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-top h2 { font-size: 20px; }

.card-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.person-card {
  background: #fff;
  border-radius: 10px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  border: 1px solid #eee;
}

.person-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.person-thumb {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.person-role {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.upload-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview-img {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.no-photo {
  font-size: 12px;
  color: var(--text-muted);
}

.photo-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.photo-item {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  background: #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  position: relative;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.photo-item button {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  font-size: 10px;
}

.photo-add {
  width: 80px;
  height: 60px;
  border: 2px dashed #ddd;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #ccc;
  cursor: pointer;
}

.timeline-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
</style>
