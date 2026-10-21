<template>
  <div class="association-page content-wrap">
    <section class="association-heading"><div><p class="eyebrow">关于协会</p><h1>岳阳市江豚保护协会</h1><p>协会自2012年成立以来，以志愿者参与连接巡护、保护宣传与公众行动。保护江豚，也是在守护它赖以生存的江湖与湿地。</p><p>平台汇集巡护档案、现场影像、自然教育和公开报道，便于查阅、整理与后续补充。</p><p class="association-source">协会背景参考：<a href="https://www.0730news.com/detail?infoid=112770" target="_blank" rel="noopener noreferrer">智慧岳阳2022年公开报道 ↗</a></p></div><figure><img :src="publicAsset('/img/conservation/association-group.webp')" alt="2026年两校实践团队与岳阳市江豚保护协会合作交流合影" width="1800" height="1013"/><figcaption>2026年实践团队与保护协会合作交流现场。</figcaption></figure></section>
    <section class="association-work"><h2>主要工作方向</h2><div class="direction-grid"><router-link v-for="item in CATEGORIES" :key="item.id" :to="{ path: '/records', query: { category: item.id } }" v-ripple class="direction-item"><ConservationIcon :name="item.icon"/><h3>{{ item.name }}</h3><p>{{ item.description }}</p><ConservationIcon name="arrow" class="direction-arrow"/></router-link></div></section>
    <section class="association-history"><div class="history-intro"><h2>协会工作足迹</h2><figure><img :src="publicAsset('/img/conservation/patrol-notebook.webp')" alt="协会留存的纸质巡逻登记表" width="1800" height="1013" loading="lazy" /><figcaption>现场留存的巡护工作原始档案</figcaption></figure><router-link to="/records/patrol-note-2018-03-02" class="text-link">翻阅这份巡护档案<ConservationIcon name="arrow" /></router-link></div><div><div v-for="item in history" :key="item.year" class="history-item"><span class="history-year">{{ item.year }}</span><div><h3>{{ item.title }}</h3><p>{{ item.text }}</p><router-link v-if="item.to" :to="item.to">翻阅对应记录 →</router-link><a v-else :href="item.url" target="_blank" rel="noopener noreferrer">查看公开资料 ↗</a></div></div></div></section>
    <section class="association-invitation"><div><h2>资料与自然教育</h2><p>了解江豚与湿地保护工作，查阅巡护表格和科普内容。</p><router-link to="/resources" class="text-link" style="margin-top:13px">翻阅保护资料与巡护表格<ConservationIcon name="arrow"/></router-link></div><router-link to="/education" v-ripple class="forest-button">走进江豚小课堂<ConservationIcon name="arrow"/></router-link></section>
  </div>
</template>
<script setup>
import ConservationIcon from '../components/ConservationIcon.vue'
import { CATEGORIES, publicAsset } from '../lib/conservation'
const history = [
  { year:'2012', title:'协会成立与志愿保护',text:'协会成立时间依据智慧岳阳公开报道，长期参与江豚与湿地保护。',url:'https://www.0730news.com/detail?infoid=112770' },
  { year:'2018', title:'纸质巡逻登记表',text:'留存的巡逻登记表记录时间、天气、路线与工作情况；原件影像在2026年实践交流中采集。',to:'/records/patrol-note-2018-03-02' },
  { year:'2022', title:'协同巡护的公开报道',text:'地方媒体记录了协会志愿者与渔政人员共同开展水上巡护的工作。',to:'/records/association-report-2022' },
  { year:'2024', title:'高校团队交流与水域观察',text:'协会与高校实践团队开展学习交流，把自然教育延伸到水域观察与日常行动。',to:'/records/association-report-2024' },
  { year:'2026', title:'现场资料与平台共建',text:'两校实践团队整理巡护影像、科普活动与现场材料，建设记录、展示和传播的数字入口。',to:'/records/field-2026-association' },
]
</script>
