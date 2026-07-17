<template>
  <div class="page-container">
    <h2 class="section-title">🐬 童护长江 · 江豚小课堂</h2>
    <p class="section-subtitle">认识“微笑天使”笑笑，听懂江豚的故事，把守护长江变成今天能做的事</p>

    <!-- Tab 切换 -->
    <el-tabs v-model="activeTab" type="border-card" class="edu-tabs">
      <!-- 绘本翻页 -->
      <el-tab-pane label="🐬 认识笑笑" name="flipbook">
        <div class="flipbook-container">
          <div class="flipbook-card data-card">
            <div class="book-page" :class="{ flipped: currentPage % 2 === 0 }">
              <div class="page-content">
                <h3>{{ bookPages[currentPage].title }}</h3>
                <p class="page-num">第 {{ currentPage + 1 }} / {{ bookPages.length }} 页</p>
                <div v-if="bookPages[currentPage].image" class="page-illustration page-illustration--photo">
                  <img :src="publicAsset(bookPages[currentPage].image)" :alt="bookPages[currentPage].imgLabel" />
                  <span>{{ bookPages[currentPage].imgLabel }}</span>
                </div>
                <div v-else class="page-illustration page-illustration--lesson">
                  <span class="lesson-icon">{{ bookPages[currentPage].icon }}</span>
                  <span>{{ bookPages[currentPage].imgLabel }}</span>
                </div>
                <p class="page-text">{{ bookPages[currentPage].text }}</p>
                <ul v-if="bookPages[currentPage].facts" class="page-facts">
                  <li v-for="fact in bookPages[currentPage].facts" :key="fact">{{ fact }}</li>
                </ul>
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
      <el-tab-pane label="🎮 豚豚挑战" name="quiz">
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
          <h3>{{ score >= excellenceThreshold ? '🏆 江豚守护小达人！' : score >= Math.ceil(edu.quiz.length / 2) ? '👍 笑笑为你点赞！' : '📚 再听听笑笑的故事吧！' }}</h3>
          <p>你答对了 {{ score }} 道题，正确率 {{ Math.round((score / edu.quiz.length) * 100) }}%</p>
          <p class="result-msg">
            {{ resultMessage }}
          </p>
          <el-button @click="resetQuiz">重新答题</el-button>
        </div>
      </el-tab-pane>

      <!-- 作品墙 -->
      <el-tab-pane label="🎨 画出江豚家园" name="artwork">
        <section class="action-guide" aria-labelledby="action-guide-title">
          <div>
            <p class="section-kicker">今天就能做到</p>
            <h3 id="action-guide-title">和笑笑约定三件事</h3>
          </div>
          <ol class="action-list">
            <li v-for="action in protectionActions" :key="action.title">
              <span class="action-icon">{{ action.icon }}</span>
              <div><strong>{{ action.title }}</strong><p>{{ action.text }}</p></div>
            </li>
          </ol>
        </section>
        <div v-if="edu.artworks.length === 0" class="empty-wall data-card empty-state">
          <el-icon :size="40"><PictureFilled /></el-icon>
          <p>江豚家园作品墙将在课堂后亮相</p>
          <p class="empty-hint">画出笑笑喜欢的清水、鱼群和安静江面，和大家分享你的守护承诺。</p>
        </div>
        <div v-else class="artwork-grid">
          <div v-for="(art, i) in edu.artworks" :key="i" class="artwork-item">
            <img :src="art" />
          </div>
        </div>
      </el-tab-pane>

      <!-- 孩子们的话 -->
      <el-tab-pane label="💬 课堂回声" name="feedback">
        <div v-if="edu.feedback.length === 0" class="empty-wall data-card empty-state">
          <el-icon :size="40"><ChatLineSquare /></el-icon>
          <p>课堂回声将在活动后收集</p>
          <p class="empty-hint">孩子们写给笑笑的话、课堂照片和作品会在这里陆续展出。</p>
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
  {
    title: '你好，我是笑笑', imgLabel: '长江里的“微笑天使”', image: '/img/education/yangtze-finless-porpoise.jpeg',
    text: '笑笑是一只长江江豚。它生活在长江和洞庭湖水域，是我国特有的淡水鲸类，也是国家一级重点保护野生动物。',
  },
  {
    title: '找找我的特别之处', imgLabel: '圆圆脑袋、没有背鳍的江豚', image: '/img/education/porpoise-features.jpeg',
    text: '江豚的嘴角天生微微上扬，好像一直在微笑。仔细看看，它和海豚并不一样。',
    facts: ['头部浑圆，自带“微笑”', '背部没有背鳍', '皮肤光滑，鳍肢宽大'],
  },
  {
    title: '我不是海豚亮亮', imgLabel: '有背鳍、住在海里的海豚', image: '/img/education/ocean-dolphin.jpeg',
    text: '亮亮是生活在海里的海豚，有明显的背鳍和长长的嘴。笑笑生活在淡水里，头更圆，背上没有背鳍。现在你能分清我们了吗？',
  },
  {
    title: '我的水下超能力', imgLabel: '在水里结伴前行的江豚', image: '/img/education/porpoise-pod.jpeg',
    text: '江水有时很浑浊，笑笑的眼睛看不远，却能用额头和下巴发射、接收超声波，像带着一套水下雷达。',
    facts: ['用声呐辨别方向', '寻找食物和伙伴', '在浑水里也能灵活游泳'],
  },
  {
    title: '江水健康我知道', imgLabel: '江豚家族与清洁水域', image: '/img/education/porpoise-family.jpeg',
    text: '江豚处在长江水生动物食物链的顶端，对水环境要求很高。它们的生活状况，就像一份送给长江的健康报告。',
  },
  {
    title: '笑笑也有困扰', imgLabel: '江豚面临的生态危机', image: '/img/education/porpoise-threats.jpeg',
    text: '密集船只、水质污染、栖息地被破坏和食物变少，都会让江豚的家变得不安全。保护形势仍然需要大家一起努力。',
  },
  {
    title: '守护笑笑的家', imgLabel: 'PPT 中的江豚宣教课堂', image: '/img/education/porpoise-classroom.jpeg',
    text: '不向水里扔垃圾，少用一次性塑料，主动讲述江豚故事。每一个小小的行动，都会让长江更适合笑笑和伙伴们生活。',
  },
]

const protectionActions = [
  { icon: '🗑️', title: '不把垃圾送进江里', text: '分类投放，看到岸边垃圾及时提醒大人一起清理。' },
  { icon: '🥤', title: '少用一次性塑料', text: '带上水杯和环保袋，减少塑料进入河湖的机会。' },
  { icon: '📣', title: '讲一个江豚故事', text: '把今天认识的笑笑讲给家人和朋友听。' },
]

function publicAsset(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

function prevPage() { if (currentPage.value > 0) currentPage.value-- }
function nextPage() { if (currentPage.value < bookPages.length - 1) currentPage.value++ }

// ===== 答题 =====
const currentQ = ref(0)
const selectedOption = ref(null)
const answered = ref(false)
const isCorrect = ref(false)
const score = ref(0)
const quizFinished = ref(false)
const excellenceThreshold = computed(() => Math.ceil(edu.value.quiz.length * 0.8))
const resultMessage = computed(() => {
  if (score.value >= excellenceThreshold.value) return '你已经认识了笑笑，也知道怎样守护她的家，真棒！'
  if (score.value >= Math.ceil(edu.value.quiz.length / 2)) return '你已经掌握了不少江豚知识，再翻翻“认识笑笑”吧！'
  return '别灰心，认识江豚、守护长江，从再听一遍笑笑的故事开始。'
})

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

.page-illustration--photo { position: relative; overflow: hidden; background: #0e617f; color: #fff; }
.page-illustration--photo img { width: 100%; height: 100%; object-fit: cover; }
.page-illustration--photo span { position: absolute; right: 10px; bottom: 10px; padding: 4px 8px; background: rgba(7, 42, 58, 0.72); font-size: 12px; }
.page-illustration--lesson { background: #edf7fa; border: 1px solid #c9e1ea; color: var(--primary-dark); }
.lesson-icon { font-size: 52px; line-height: 1; }

.page-text {
  font-size: 16px;
  line-height: 2;
  color: var(--text-secondary);
  text-align: left;
}

.page-facts { display: grid; gap: 7px; margin: 14px 0 0; padding: 0; list-style: none; text-align: left; }
.page-facts li { position: relative; padding-left: 18px; color: var(--text-secondary); font-size: 14px; line-height: 1.55; }
.page-facts li::before { content: '•'; position: absolute; left: 4px; color: var(--primary); font-weight: 800; }

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

.action-guide { max-width: 780px; margin: 0 auto 28px; padding: 4px 0 22px; border-bottom: 1px solid var(--border); }
.section-kicker { margin-bottom: 4px; color: var(--primary); font-size: 13px; font-weight: 700; }
.action-guide h3 { color: var(--text-primary); font-size: 21px; }
.action-list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; margin: 18px 0 0; padding: 0; list-style: none; }
.action-list li { display: flex; gap: 10px; align-items: flex-start; min-width: 0; }
.action-icon { flex: 0 0 34px; height: 34px; display: grid; place-items: center; background: #eaf5f8; color: var(--primary-dark); font-size: 19px; }
.action-list strong { display: block; color: var(--text-primary); font-size: 14px; line-height: 1.4; }
.action-list p { margin-top: 3px; color: var(--text-secondary); font-size: 12px; line-height: 1.55; }

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

@media (max-width: 640px) {
  .flipbook-card, .quiz-card { padding: 20px; }
  .action-list { grid-template-columns: 1fr; gap: 14px; }
  .flipbook-controls { gap: 10px; }
}
</style>
