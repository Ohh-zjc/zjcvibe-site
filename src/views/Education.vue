<template>
  <div class="page-container">
    <h2 class="section-title">📖 童护长江</h2>
    <p class="section-subtitle">AI绘本 · 生态答题 · 课堂作品墙 —— 将长江故事种进孩子们心中</p>

    <!-- Tab 切换 -->
    <el-tabs v-model="activeTab" type="border-card" class="edu-tabs">
      <!-- 绘本翻页 -->
      <el-tab-pane label="📖 AI绘本" name="flipbook">
        <div class="flipbook-container">
          <div class="flipbook-card data-card">
            <div class="book-page" :class="{ flipped: currentPage % 2 === 0 }">
              <div class="page-content">
                <h3>《守护一江碧水》</h3>
                <p class="page-num">第 {{ currentPage + 1 }} / {{ bookPages.length }} 页</p>
                <div class="page-illustration placeholder-img">
                  <el-icon :size="48"><PictureFilled /></el-icon>
                  <span>{{ bookPages[currentPage].imgLabel }}</span>
                </div>
                <p class="page-text">{{ bookPages[currentPage].text }}</p>
              </div>
            </div>
          </div>
          <div class="flipbook-controls">
            <el-button @click="prevPage" :disabled="currentPage === 0">
              <el-icon><ArrowLeft /></el-icon> 上一页
            </el-button>
            <span class="page-indicator">{{ currentPage + 1 }} / {{ bookPages.length }}</span>
            <el-button @click="nextPage" :disabled="currentPage === bookPages.length - 1">
              下一页 <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </el-tab-pane>

      <!-- 互动答题 -->
      <el-tab-pane label="🎮 生态答题" name="quiz">
        <div class="quiz-container" v-if="!quizFinished">
          <div class="quiz-card data-card">
            <div class="quiz-progress">
              <el-progress
                :percentage="Math.round(((currentQ + 1) / edu.quiz.length) * 100)"
                :stroke-width="8"
                color="#2E86AB"
              />
              <span class="progress-text">第 {{ currentQ + 1 }} / {{ edu.quiz.length }} 题</span>
            </div>

            <h3 class="quiz-question">{{ edu.quiz[currentQ]?.question }}</h3>

            <div class="quiz-options">
              <div
                v-for="(opt, i) in edu.quiz[currentQ]?.options"
                :key="i"
                class="quiz-option"
                :class="{
                  correct: answered && i === edu.quiz[currentQ].answer,
                  wrong: answered && i === selectedOption && i !== edu.quiz[currentQ].answer,
                }"
                @click="selectOption(i)"
              >
                <span class="option-letter">{{ 'ABCD'[i] }}</span>
                <span class="option-text">{{ opt }}</span>
              </div>
            </div>

            <div v-if="answered" class="quiz-feedback">
              <p :class="isCorrect ? 'feedback-ok' : 'feedback-err'">
                {{ isCorrect ? '✅ 回答正确！' : '❌ 回答错误' }}
              </p>
              <p class="feedback-expl">{{ edu.quiz[currentQ].explanation }}</p>
              <el-button type="primary" @click="nextQuestion">
                {{ currentQ < edu.quiz.length - 1 ? '下一题' : '查看成绩' }}
              </el-button>
            </div>
          </div>
        </div>

        <!-- 答题结果 -->
        <div v-else class="quiz-result data-card">
          <div class="result-circle">
            <span class="result-score">{{ score }}</span>
            <span class="result-total">/ {{ edu.quiz.length }}</span>
          </div>
          <h3>{{ score >= 8 ? '🏆 生态小达人！' : score >= 5 ? '👍 继续加油！' : '📚 多多学习哦！' }}</h3>
          <p>你答对了 {{ score }} 道题，正确率 {{ Math.round((score / edu.quiz.length) * 100) }}%</p>
          <p class="result-msg">
            {{ score >= 8 ? '你对长江生态保护了解很多，真棒！' : score >= 5 ? '不错的基础，继续了解更多长江知识吧！' : '别灰心，保护长江从现在学起！' }}
          </p>
          <el-button @click="resetQuiz">重新答题</el-button>
        </div>
      </el-tab-pane>

      <!-- 作品墙 -->
      <el-tab-pane label="🎨 AI绘长江" name="artwork">
        <div v-if="edu.artworks.length === 0" class="empty-wall data-card empty-state">
          <el-icon :size="40"><PictureFilled /></el-icon>
          <p>作品墙将在课堂活动后展示</p>
          <p class="empty-hint">孩子们用AI生成的「我心中的长江」画作将在此拼成照片墙</p>
        </div>
        <div v-else class="artwork-grid">
          <div v-for="(art, i) in edu.artworks" :key="i" class="artwork-item">
            <img :src="art" />
          </div>
        </div>
      </el-tab-pane>

      <!-- 孩子们的话 -->
      <el-tab-pane label="💬 孩子们的话" name="feedback">
        <div v-if="edu.feedback.length === 0" class="empty-wall data-card empty-state">
          <el-icon :size="40"><ChatLineSquare /></el-icon>
          <p>课堂反馈将在活动后收集</p>
          <p class="empty-hint">选取孩子们写下的最真挚的话语，滚动展示</p>
        </div>
        <div v-else class="feedback-list">
          <div v-for="(fb, i) in edu.feedback" :key="i" class="feedback-card data-card">
            <p class="fb-text">「{{ fb.text }}」</p>
            <span class="fb-author">—— {{ fb.author }}</span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowLeft, ArrowRight, PictureFilled, ChatLineSquare } from '@element-plus/icons-vue'
import { useDataStore } from '../stores/data'
import { computed } from 'vue'

const dataStore = useDataStore()
const edu = computed(() => dataStore.education)

const activeTab = ref('flipbook')

// ===== 绘本 =====
const currentPage = ref(0)
const bookPages = [
  { imgLabel: '绘本封面', text: '从前，有一条大河叫长江，她流过很多很多地方。在长江和洞庭湖交汇的地方，有一座美丽的城市——岳阳。' },
  { imgLabel: '江豚场景', text: '长江里住着一位"微笑天使"——江豚。它嘴角上扬，像是在对所有路过的人微笑。可是，江豚越来越少了……' },
  { imgLabel: '码头变迁', text: '华龙码头曾经堆满了砂石，江豚的家被破坏了。但是，人们决定改变！大家开始清理码头、种树、保护江水。' },
  { imgLabel: '巡护场景', text: '渔政叔叔每天开着船在江上巡护，不让坏人偷偷捕鱼。禁渔之后，长江里的鱼又多了起来！' },
  { imgLabel: '湿地候鸟', text: '冬天来了，东洞庭湖湿地迎来了很多候鸟朋友——白鹤、天鹅、大雁……它们在这里过冬、觅食、嬉戏。' },
  { imgLabel: '课堂场景', text: '小朋友们也来帮忙啦！大家学习长江知识，用AI画出心中的长江，还亲手种下小树苗。' },
  { imgLabel: '美好未来', text: '今天的华龙码头变成了美丽的江豚湾，人人都在守护长江。一江碧水，奔流不息，这是我们的长江，我们的家！' },
]

function prevPage() { if (currentPage.value > 0) currentPage.value-- }
function nextPage() { if (currentPage.value < bookPages.length - 1) currentPage.value++ }

// ===== 答题 =====
const currentQ = ref(0)
const selectedOption = ref(null)
const answered = ref(false)
const isCorrect = ref(false)
const score = ref(0)
const quizFinished = ref(false)

function selectOption(i) {
  if (answered.value) return
  selectedOption.value = i
  answered.value = true
  isCorrect.value = i === edu.value.quiz[currentQ.value].answer
  if (isCorrect.value) score.value++
}

function nextQuestion() {
  if (currentQ.value < edu.value.quiz.length - 1) {
    currentQ.value++
    selectedOption.value = null
    answered.value = false
  } else {
    quizFinished.value = true
  }
}

function resetQuiz() {
  currentQ.value = 0
  selectedOption.value = null
  answered.value = false
  score.value = 0
  quizFinished.value = false
}
</script>

<style scoped>
.edu-tabs {
  border-radius: var(--radius);
  overflow: hidden;
}

/* ===== 绘本 ===== */
.flipbook-container {
  max-width: 600px;
  margin: 0 auto;
}

.flipbook-card {
  padding: 32px;
  text-align: center;
  margin-bottom: 20px;
}

.page-content h3 {
  font-size: 22px;
  color: var(--primary-dark);
  margin-bottom: 4px;
}

.page-num {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.page-illustration {
  aspect-ratio: 4/3;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 13px;
}

.placeholder-img {
  background: var(--bg-light);
  border: 2px dashed var(--border);
  color: var(--text-muted);
}

.page-text {
  font-size: 16px;
  line-height: 2;
  color: var(--text-secondary);
  text-align: left;
}

.flipbook-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

/* ===== 答题 ===== */
.quiz-container {
  max-width: 640px;
  margin: 0 auto;
}

.quiz-card {
  padding: 32px;
}

.quiz-progress {
  margin-bottom: 24px;
}

.progress-text {
  font-size: 12px;
  color: var(--text-muted);
  display: block;
  margin-top: 6px;
}

.quiz-question {
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: 24px;
  line-height: 1.5;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.quiz-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border: 2px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.quiz-option:hover { border-color: var(--primary-light); }

.quiz-option.correct {
  border-color: #27AE60;
  background: #E8F8E8;
}

.quiz-option.wrong {
  border-color: #E74C3C;
  background: #FDEDEC;
}

.option-letter {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bg-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}

.option-text { font-size: 15px; }

.quiz-feedback {
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.feedback-ok { color: #27AE60; font-weight: 600; font-size: 16px; }
.feedback-err { color: #E74C3C; font-weight: 600; font-size: 16px; }

.feedback-expl {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 8px 0 16px;
}

/* 答题结果 */
.quiz-result {
  max-width: 500px;
  margin: 0 auto;
  padding: 40px;
  text-align: center;
}

.result-circle {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  border: 6px solid var(--primary);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.result-score {
  font-size: 36px;
  font-weight: 800;
  color: var(--primary);
}

.result-total {
  font-size: 14px;
  color: var(--text-muted);
}

.quiz-result h3 {
  font-size: 22px;
  margin-bottom: 8px;
}

.quiz-result p {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.result-msg { margin-bottom: 20px !important; }

/* 空状态 */
.empty-wall { padding: 48px; }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  text-align: center;
}

.empty-state p { font-size: 14px; }
.empty-hint { font-size: 12px !important; opacity: 0.6; }

/* 反馈 */
.feedback-list {
  display: grid;
  gap: 16px;
}

.feedback-card {
  padding: 24px;
}

.fb-text {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.fb-author {
  font-size: 13px;
  color: var(--text-muted);
}
</style>
