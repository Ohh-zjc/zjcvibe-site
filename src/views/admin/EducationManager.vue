<template>
  <div class="manager-page">
    <h2>📖 童护长江 — 管理</h2>

    <!-- 答题管理 -->
    <div class="section">
      <div class="section-top">
        <h3>🎮 生态答题 ({{ edu.quiz.length }} 题)</h3>
        <el-button size="small" type="primary" @click="addQuiz">+ 添加题目</el-button>
      </div>
      
      <div v-for="(q, i) in edu.quiz" :key="i" class="quiz-card">
        <div class="quiz-header">
          <span>第 {{ i + 1 }} 题</span>
          <el-button size="small" type="danger" @click="edu.quiz.splice(i,1)">删除</el-button>
        </div>
        <el-input v-model="q.question" placeholder="题目" style="margin-bottom:8px" />
        <div class="options-grid">
          <div v-for="(opt, j) in q.options" :key="j" class="option-row">
            <span>{{ 'ABCD'[j] }}</span>
            <el-input v-model="q.options[j]" placeholder="选项" size="small" />
            <el-radio v-model="q.answer" :value="j" size="small" />
          </div>
        </div>
        <el-input v-model="q.explanation" placeholder="答案解析" size="small" type="textarea" :rows="2" style="margin-top:8px" />
      </div>
    </div>

    <!-- 课堂反馈 -->
    <div class="section">
      <div class="section-top">
        <h3>💬 孩子们的话</h3>
        <el-button size="small" type="primary" @click="addFeedback">+ 添加</el-button>
      </div>
      <div v-for="(fb, i) in edu.feedback" :key="i" class="feedback-row">
        <el-input v-model="fb.text" placeholder="孩子说的话" size="small" style="flex:1" />
        <el-input v-model="fb.author" placeholder="署名" size="small" style="width:120px" />
        <el-button size="small" type="danger" @click="edu.feedback.splice(i,1)">✕</el-button>
      </div>
      <p v-if="!edu.feedback.length" style="color:var(--text-muted);font-size:13px">暂无反馈，点击上方添加</p>
    </div>

    <!-- 作品墙 -->
    <div class="section">
      <div class="section-top">
        <h3>🎨 AI绘长江 — 作品墙</h3>
        <el-button size="small" type="primary" @click="addArtwork">+ 添加作品</el-button>
      </div>
      <div class="artwork-grid">
        <div v-for="(art, i) in edu.artworks" :key="i" class="artwork-item">
          <img v-if="art" :src="art" />
          <span v-else>🖼️</span>
          <el-button size="small" type="danger" circle class="art-del" @click="edu.artworks.splice(i,1)">✕</el-button>
        </div>
      </div>
      <el-input v-model="newArtUrl" placeholder="粘贴图片URL或上传" size="small" style="margin-top:8px;max-width:400px" />
      <input type="file" accept="image/*" @change="onArtUpload" style="display:none" ref="artInput" />
      <el-button size="small" @click="$refs.artInput.click()" style="margin-top:8px">📷 上传图片</el-button>
    </div>

    <!-- 课堂统计 -->
    <div class="section">
      <h3>📊 课堂统计</h3>
      <div v-for="(cls, i) in edu.classrooms" :key="i">
        <el-form label-width="160px" size="small">
          <el-form-item label="课堂名称">
            <el-input v-model="cls.name" />
          </el-form-item>
          <el-form-item label="平均分">
            <el-input-number v-model="cls.avg_score" :min="0" :max="10" :precision="1" />
          </el-form-item>
          <el-form-item label="学生人数">
            <el-input-number v-model="cls.total_students" :min="0" />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-button type="primary" size="large" @click="saveAll" style="margin-top:24px">💾 保存全部</el-button>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useDataStore } from '../../stores/data'
import { ElMessage } from 'element-plus'

const dataStore = useDataStore()
const edu = reactive(JSON.parse(JSON.stringify(dataStore.education)))
const newArtUrl = ref('')

function addQuiz() {
  edu.quiz.push({
    id: edu.quiz.length + 1,
    question: '',
    options: ['', '', '', ''],
    answer: 0,
    explanation: '',
  })
}

function addFeedback() {
  edu.feedback.push({ text: '', author: '' })
}

function addArtwork() {
  if (newArtUrl.value) {
    edu.artworks.push(newArtUrl.value)
    newArtUrl.value = ''
  } else {
    edu.artworks.push('')
  }
}

async function onArtUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  const url = await dataStore.uploadImage(file)
  edu.artworks.push(url)
}

async function saveAll() {
  await dataStore.saveEducation({ ...edu })
  ElMessage.success('教育数据已保存')
}
</script>

<style scoped>
.manager-page { max-width: 900px; }
.section {
  background: #fff; border-radius: 10px; padding: 20px;
  margin-bottom: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); border: 1px solid #eee;
}
.section-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.section-top h3 { font-size: 16px; margin:0; }
.quiz-card {
  border: 1px solid #eee; border-radius: 8px; padding: 16px; margin-bottom: 12px;
}
.quiz-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.quiz-header span { font-weight: 600; font-size: 13px; color: var(--text-muted); }
.options-grid { display: flex; flex-direction: column; gap: 6px; }
.option-row { display: flex; align-items: center; gap: 8px; }
.option-row span { font-weight: 700; width: 20px; }
.feedback-row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
.artwork-grid { display: flex; gap: 10px; flex-wrap: wrap; }
.artwork-item {
  width: 100px; height: 75px; border-radius: 6px; background: #f0f0f0;
  display: flex; align-items: center; justify-content: center; position: relative;
}
.artwork-item img { width: 100%; height: 100%; object-fit: cover; border-radius: 6px; }
.art-del { position: absolute; top: -6px; right: -6px; width: 18px; height: 18px; font-size: 10px; }
</style>
