<template>
  <div class="home-lower">
    <section ref="startSection" class="home-explore home-block" aria-labelledby="explore-heading">
      <div class="home-inner">
        <header class="home-heading">
          <div><h2 id="explore-heading">探索数据平台</h2><p>听一线故事，看湖岸变化，了解保护工作怎样开展。</p></div>
          <router-link to="/association" class="home-link">认识保护协会<ConservationIcon name="arrow" /></router-link>
        </header>
        <div class="explore-composition">
          <figure class="explore-landscape">
            <router-link to="/shoreline" v-ripple aria-label="查看洞庭湖岸线与调查点位">
              <img :src="publicAsset('/img/conservation/lake-hero.webp')" width="1800" height="1200" alt="洞庭湖水面、草洲与沿岸植被的现场照片" loading="lazy" />
              <span class="landscape-caption"><ConservationIcon name="location" />岳阳洞庭湖<span>查看岸线地图<ConservationIcon name="arrow" /></span></span>
            </router-link>
            <figcaption>2026年7月实践现场影像</figcaption>
          </figure>
          <nav class="explore-entries" aria-label="数据平台内容入口">
            <router-link v-for="item in modules" :key="item.to" :to="item.to" v-ripple class="explore-entry">
              <ConservationIcon :name="item.icon" class="entry-icon" />
              <div><h3>{{ item.title }}</h3><p>{{ item.description }}</p></div>
              <ConservationIcon name="arrow" class="entry-arrow" />
            </router-link>
          </nav>
        </div>
      </div>
    </section>

    <section class="home-archive home-block" aria-labelledby="home-archive-heading">
      <div class="home-inner">
        <header class="home-heading">
          <div><h2 id="home-archive-heading">护江档案</h2><p>从纸质巡逻登记表到现场影像，留下可以回看的工作记录。</p></div>
          <router-link to="/records" class="home-link">查看全部记录<ConservationIcon name="arrow" /></router-link>
        </header>
        <div class="home-archive-layout" :class="{ 'without-original': !originalRecord }">
          <router-link v-if="originalRecord" :to="`/records/${originalRecord.id}`" v-ripple class="home-original-record">
            <img v-if="originalRecord.photos?.length" :src="publicAsset(originalRecord.photos[0].src)" :alt="originalRecord.photos[0].caption || originalRecord.title" width="1800" height="1013" loading="lazy" />
            <div class="original-record-copy"><p class="home-record-meta">{{ KIND_LABELS[originalRecord.kind] }}<time>{{ formatRecordDate(originalRecord) }}</time></p><h3>{{ originalRecord.title }}</h3><p>{{ originalRecord.summary }}</p><span class="home-link">查看原始档案<ConservationIcon name="arrow" /></span></div>
          </router-link>
          <div class="home-recent-records">
            <router-link v-for="record in recentRecords" :key="record.id" :to="`/records/${record.id}`" v-ripple class="home-recent-record">
              <img v-if="record.photos?.length" :src="publicAsset(record.photos[0].src)" :alt="record.photos[0].caption || record.title" width="1800" height="1013" loading="lazy" />
              <div><p class="home-record-meta">{{ categoryName(record.category) }}<time>{{ formatRecordDate(record) }}</time></p><h3>{{ record.title }}</h3><p class="recent-description">{{ record.summary }}</p><span class="home-link">阅读记录<ConservationIcon name="arrow" /></span></div>
            </router-link>
            <router-link to="/records" class="archive-index-link">按年份、保护方向和资料类型查阅<ConservationIcon name="arrow" /></router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="home-gallery home-block" aria-labelledby="home-gallery-heading">
      <div class="home-inner">
        <header class="home-heading"><div><h2 id="home-gallery-heading">实践影像</h2><p>从座谈交流到自然课堂，回看保护现场。</p></div><span class="gallery-position" aria-label="当前影像位置">{{ activeGallery + 1 }} / {{ galleryItems.length }}</span></header>
        <div class="gallery-stage">
          <figure class="gallery-main-photo"><img :src="publicAsset(selectedPhoto.image)" :alt="selectedPhoto.caption" :width="selectedPhoto.width" :height="selectedPhoto.height" loading="lazy" /></figure>
          <div class="gallery-story" aria-live="polite">
            <p class="gallery-location"><ConservationIcon name="location" />{{ selectedPhoto.location }}</p>
            <h3>{{ selectedPhoto.title }}</h3><p>{{ selectedPhoto.description }}</p>
            <router-link :to="selectedPhoto.to" class="home-link">{{ selectedPhoto.action }}<ConservationIcon name="arrow" /></router-link>
          </div>
        </div>
        <div class="gallery-choices" aria-label="选择实践影像">
          <button v-for="(item, index) in galleryItems" :key="item.image" type="button" :aria-label="`查看影像：${item.title}`" :aria-pressed="activeGallery === index" :class="{ selected: activeGallery === index }" @click="activeGallery = index">
            <img :src="publicAsset(item.image)" alt="" :width="item.width" :height="item.height" loading="lazy" /><span>{{ item.title }}</span>
          </button>
        </div>
      </div>
    </section>

    <section class="home-route home-block" aria-labelledby="home-route-heading">
      <div class="home-inner route-layout">
        <div class="route-intro"><h2 id="home-route-heading">七天实践路线</h2><p>岳阳洞庭湖流域<br />从走访、巡护到整理与分享。</p><figure><img :src="publicAsset('/img/conservation/patrol-boat.webp')" alt="实践团队随船开展洞庭湖水域观察" width="1800" height="1013" loading="lazy" /><figcaption>水上巡护实践现场</figcaption></figure><router-link to="/about" class="home-link">认识共建团队<ConservationIcon name="arrow" /></router-link></div>
        <ol class="route-days">
          <li v-for="(day, index) in timeline" :key="day.day"><details :open="index === 0"><summary><span class="route-day">{{ day.day }}<small>{{ day.weekday }}</small></span><h3>{{ day.title }}</h3><ConservationIcon name="plus" /></summary><p>{{ day.desc }}</p></details></li>
        </ol>
      </div>
    </section>

    <div class="home-useful-links home-inner">
      <router-link to="/association" v-ripple><ConservationIcon name="patrol" /><div><h2>认识保护协会</h2><p>了解长期巡护、志愿服务与工作足迹。</p></div><ConservationIcon name="arrow" /></router-link>
      <router-link to="/resources" v-ripple><ConservationIcon name="book" /><div><h2>资料与工具</h2><p>查阅权威科普，下载协会巡护记录汇编。</p></div><ConservationIcon name="arrow" /></router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import ConservationIcon from './ConservationIcon.vue'
import { useConservationStore } from '../stores/conservation'
import { publicAsset, formatRecordDate, categoryName, KIND_LABELS } from '../lib/conservation'

const props = defineProps({ timeline: { type: Array, required: true } })
const conservation = useConservationStore()
const startSection = ref(null)
const originalRecord = computed(() => conservation.published.find(record => record.kind === 'archive'))
const recentRecords = computed(() => {
  const records = conservation.published.filter(record => record.id !== originalRecord.value?.id)
  return [...records.filter(record => record.featured), ...records.filter(record => !record.featured)].slice(0, 2)
})
const modules = [
  { to: '/oral-history', icon: 'voice', title: '护江者说', description: '听巡护员、退捕渔民、社区居民和渔政人员讲述一线故事。' },
  { to: '/shoreline', icon: 'map', title: '岸线寻访', description: '沿调查点位看湖岸，查阅历史卫星影像与现场航拍。' },
  { to: '/dashboard', icon: 'water', title: '数据看板', description: '查看水样快检记录，了解保护数据的来源与含义。' },
  { to: '/education', icon: 'book', title: '童护长江', description: '认识江豚，参与趣味问答，把保护带进日常生活。' },
]
const galleryItems = [
  { title: '禁渔护渔座谈', location: '渔政综合行政执法局', caption: '实践团队与渔政工作人员开展禁渔护渔座谈', description: '走进渔政工作现场，在交流中了解禁捕退捕、水域巡护与生态监管的日常工作。', image: '/img/gallery/fishery-forum.webp', width: 1067, height: 1600, to: '/oral-history', action: '了解一线工作者' },
  { title: '共话江豚保护', location: '岳阳市江豚保护协会', caption: '两校实践团队在江豚保护协会交流', description: '从协会工作者的讲述与巡护登记表出发，了解民间保护的经验和持续记录的需要。', image: '/img/gallery/porpoise-association.webp', width: 1600, height: 1067, to: '/association', action: '认识保护协会' },
  { title: '湖岸湿地航拍', location: '华龙码头（江豚湾）', caption: '华龙码头江豚湾的水面与湖岸植被航拍', description: '用现场航拍留存水面、草洲与岸线的空间关系，与历史影像一同回看。', image: '/img/field/hualong/gallery-lakeshore.webp', width: 900, height: 675, to: '/shoreline', action: '查看岸线影像' },
  { title: '听见护江故事', location: '岳阳实践走访现场', caption: '团队在实地走访中开展口述史交流', description: '听取不同岗位和生活经历中的观察，记录人们与江湖之间的联系。', image: '/img/gallery/oral-history-interview.webp', width: 1600, height: 1067, to: '/oral-history', action: '阅读人物故事' },
  { title: '孩子们的江豚课堂', location: '儿童生态教育课堂', caption: '团队与孩子们开展江豚主题生态课堂', description: '通过故事、问答和手作认识江豚，让孩子从身边的小事开始理解保护。', image: '/img/education/community-children-classroom.webp', width: 1600, height: 1067, to: '/education', action: '走进江豚小课堂' },
]
const activeGallery = ref(0)
const selectedPhoto = computed(() => galleryItems[activeGallery.value])
function scrollToStart() {
  startSection.value?.scrollIntoView({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
}
defineExpose({ scrollToStart })
</script>

<style scoped>
.home-lower{--home-ink:#244451;--home-blue:#174f69;--home-action:#267fa2;--home-muted:#526b77;--home-line:#d5e3e9;background:#fbfdfd;color:var(--home-ink);font-family:'Microsoft YaHei','PingFang SC',sans-serif}
.home-inner{width:min(1180px,calc(100% - 80px));margin-inline:auto}.home-block{padding-block:72px}.home-lower h2{font-size:32px;line-height:1.5;letter-spacing:.2px;font-weight:700;color:var(--home-blue);text-wrap:balance}.home-lower h3{font-weight:600;line-height:1.6;text-wrap:pretty}.home-lower p{overflow-wrap:anywhere}.home-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:28px;margin-bottom:30px}.home-heading>div>p{font-size:14px;color:var(--home-muted);margin-top:9px;line-height:1.9}.home-link{display:inline-flex;align-items:center;gap:10px;color:var(--home-action);font-size:14px;font-weight:600;min-height:36px;white-space:nowrap}.home-link svg{width:20px;height:20px}.home-lower a:hover{color:#124c67}.home-lower a:focus-visible,.home-lower button:focus-visible,.home-lower summary:focus-visible{outline:3px solid #3c90b4;outline-offset:4px}.home-lower a,.home-lower button,.home-lower summary{touch-action:manipulation;-webkit-tap-highlight-color:#267fa21a}.home-explore{scroll-margin-top:var(--nav-height);background:#fff}
.explore-composition{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:54px;align-items:start}.explore-landscape{min-width:0}.explore-landscape>a{display:block;position:relative;overflow:hidden;border-radius:12px}.explore-landscape img{display:block;width:100%;height:auto;aspect-ratio:3/2;object-fit:contain}.landscape-caption{display:flex;align-items:center;gap:7px;position:absolute;left:0;right:0;bottom:0;padding:28px 22px 18px;background:linear-gradient(transparent,#123447d9);color:#fff;font-size:14px}.landscape-caption>svg{width:17px;height:17px}.landscape-caption>span{display:flex;align-items:center;gap:8px;margin-left:auto;font-size:12px}.landscape-caption>span>svg{width:18px;height:18px}.explore-landscape figcaption{margin-top:11px;font-size:12px;color:var(--home-muted)}.explore-entries{margin-top:-12px}.explore-entry{display:grid;grid-template-columns:36px minmax(0,1fr) 22px;gap:18px;align-items:center;padding:23px 8px;border-bottom:1px solid var(--home-line);color:inherit;transition:background-color .2s}.explore-entry:last-child{border-bottom:0}.explore-entry:hover{background:#eef6fa}.entry-icon{width:30px;height:30px;color:var(--home-action);stroke-width:1.4}.entry-arrow{width:20px;height:20px;color:#57879c}.explore-entry h3{font-size:21px;color:var(--home-blue);margin-bottom:6px}.explore-entry p{font-size:13px;line-height:1.9;color:var(--home-muted)}
.home-archive{background:#eaf3f7}.home-archive-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:34px}.home-archive-layout.without-original{grid-template-columns:1fr}.home-original-record{display:block;background:#fff;border-radius:10px;overflow:hidden;color:inherit}.home-original-record>img{width:100%;height:auto;aspect-ratio:16/9;object-fit:contain;display:block;background:#dfe9ee}.original-record-copy{padding:25px 30px 27px}.home-record-meta{font-size:12px;line-height:1.7;color:var(--home-muted);display:flex;flex-wrap:wrap;gap:8px 20px;align-items:center}.home-record-meta time{font-variant-numeric:tabular-nums}.original-record-copy h3{font-size:24px;color:var(--home-blue);margin:12px 0}.original-record-copy>p:not(.home-record-meta){font-size:14px;line-height:1.95;color:var(--home-muted)}.original-record-copy .home-link{margin-top:15px}.home-recent-records{min-width:0;display:flex;flex-direction:column;gap:24px}.home-recent-record{display:grid;grid-template-columns:180px minmax(0,1fr);gap:24px;padding-bottom:24px;border-bottom:1px solid #c6dce6;color:inherit;align-items:start}.home-recent-record>img{display:block;width:100%;height:auto;aspect-ratio:4/3;object-fit:contain;background:#dce9ef;border-radius:7px}.home-recent-record h3{font-size:20px;color:var(--home-blue);margin:8px 0}.recent-description{font-size:13px;line-height:1.9;color:var(--home-muted)}.home-recent-record .home-link{font-size:12px;margin-top:9px}.archive-index-link{display:flex;align-items:center;gap:18px;font-size:13px;margin-top:auto;color:#285e77;min-height:44px}.archive-index-link svg{width:20px;height:20px}
.home-gallery{background:#fff}.gallery-position{font-size:14px;font-variant-numeric:tabular-nums;color:var(--home-muted)}.gallery-stage{display:grid;grid-template-columns:minmax(0,1.8fr) minmax(0,1fr);align-items:center;gap:44px}.gallery-main-photo{min-width:0;border-radius:10px;overflow:hidden;background:#eaf1f4}.gallery-main-photo img{width:100%;height:auto;aspect-ratio:16/10;object-fit:contain;display:block}.gallery-story h3{font-size:28px;color:var(--home-blue);margin:18px 0 16px}.gallery-story>p:not(.gallery-location){font-size:15px;line-height:2.1;color:var(--home-muted)}.gallery-location{display:flex;align-items:center;gap:7px;font-size:12px;line-height:1.8;color:#526d7d}.gallery-location svg{width:16px;height:16px;flex-shrink:0}.gallery-story>.home-link{margin-top:25px}.gallery-choices{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:17px;margin-top:27px}.gallery-choices button{appearance:none;display:block;border:0;border-bottom:3px solid transparent;background:transparent;padding:0 0 12px;text-align:left;cursor:pointer;min-width:0;color:var(--home-muted);transition:border-color .2s,color .2s}.gallery-choices button.selected{border-bottom-color:var(--home-action);color:var(--home-blue)}.gallery-choices button:hover{color:var(--home-blue);border-bottom-color:#a6cbdc}.gallery-choices img{width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;border-radius:5px;display:block}.gallery-choices span{display:block;font-size:13px;line-height:1.6;margin-top:10px}
.home-route{background:#f0f6f8}.route-layout{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:90px;align-items:start}.route-intro>p{font-size:14px;line-height:1.9;color:var(--home-muted);margin-top:13px}.route-intro figure{margin:29px 0 18px}.route-intro img{display:block;width:100%;height:auto;border-radius:9px}.route-intro figcaption{font-size:12px;color:var(--home-muted);margin-top:10px}.route-days{list-style:none;border-top:1px solid #c9dce5}.route-days li{border-bottom:1px solid #c9dce5}.route-days summary{list-style:none;display:grid;grid-template-columns:62px minmax(0,1fr) 22px;align-items:center;gap:18px;padding:20px 0;cursor:pointer}.route-days summary::-webkit-details-marker{display:none}.route-day{color:var(--home-action);font:600 22px/1.3 'Segoe UI',sans-serif;font-variant-numeric:tabular-nums}.route-day small{display:block;font:400 11px/1.7 'Microsoft YaHei',sans-serif;color:var(--home-muted);margin-top:5px}.route-days h3{font-size:16px;color:var(--home-ink)}.route-days summary>svg{width:18px;height:18px;color:#417e98;transition:transform .2s}.route-days details[open] summary>svg{transform:rotate(45deg)}.route-days details>p{font-size:13px;line-height:2;color:var(--home-muted);padding:0 22px 24px 80px}
.home-useful-links{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:65px;padding-block:42px 48px}.home-useful-links>a{display:grid;grid-template-columns:38px minmax(0,1fr) 24px;gap:20px;align-items:center;padding:15px 0;color:inherit}.home-useful-links>a>svg:first-child{width:31px;height:31px;color:var(--home-action);stroke-width:1.4}.home-useful-links>a>svg:last-child{width:21px;height:21px;color:var(--home-action)}.home-useful-links h2{font-size:21px;font-weight:600}.home-useful-links p{font-size:13px;line-height:1.9;color:var(--home-muted);margin-top:5px}
@media(max-width:1050px){.home-inner{width:calc(100% - 56px)}.home-block{padding-block:56px}.explore-composition{gap:32px;grid-template-columns:1fr 1fr}.explore-entry{padding:17px 4px;gap:12px}.explore-entry h3{font-size:19px}.home-recent-record{grid-template-columns:130px minmax(0,1fr);gap:18px}.home-recent-record h3{font-size:18px}.recent-description{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.gallery-stage{gap:30px;grid-template-columns:1.6fr 1fr}.gallery-story h3{font-size:24px}.gallery-story>p:not(.gallery-location){font-size:14px}.route-layout{gap:44px}.gallery-choices{gap:12px}.original-record-copy{padding:23px}.home-recent-record .home-record-meta{font-size:11px;gap:6px}}
@media(max-width:750px){.home-inner{width:calc(100% - 36px)}.home-block{padding-block:39px}.home-lower h2{font-size:26px}.home-heading{align-items:flex-start;flex-direction:column;gap:15px;margin-bottom:23px}.home-heading>div>p{font-size:13px;margin-top:8px}.home-heading>.home-link{font-size:13px}.explore-composition{grid-template-columns:1fr;gap:22px}.landscape-caption{padding:25px 15px 15px;font-size:12px}.landscape-caption>span{font-size:11px}.explore-landscape figcaption{font-size:11px}.explore-entry{padding:21px 3px;gap:17px}.explore-entry h3{font-size:20px}.explore-entry p{font-size:13px}.home-archive-layout{grid-template-columns:1fr;gap:28px}.original-record-copy{padding:23px}.original-record-copy h3{font-size:22px}.home-recent-records{gap:24px}.home-recent-record{grid-template-columns:115px minmax(0,1fr);gap:17px}.home-recent-record h3{font-size:17px;margin-block:7px}.home-recent-record .home-record-meta{font-size:10px}.recent-description{font-size:12px}.home-recent-record .home-link{font-size:12px;min-height:30px;margin-top:5px}.gallery-stage{grid-template-columns:1fr;gap:0}.gallery-story{padding-top:23px}.gallery-story h3{font-size:23px;margin:12px 0}.gallery-story>p:not(.gallery-location){font-size:14px;line-height:1.95}.gallery-story>.home-link{margin-top:15px}.home-gallery .home-heading{flex-direction:row;align-items:center}.gallery-position{font-size:12px;white-space:nowrap}.gallery-choices{grid-template-columns:repeat(3,minmax(0,1fr));gap:15px 12px;margin-top:22px}.gallery-choices span{font-size:11px}.route-layout{grid-template-columns:1fr;gap:30px}.route-intro figure{margin:22px 0 13px}.route-days summary{grid-template-columns:55px minmax(0,1fr) 18px;gap:12px;padding:18px 0}.route-days h3{font-size:15px}.route-day{font-size:20px}.route-days details>p{font-size:13px;padding:0 5px 23px 67px}.home-useful-links{grid-template-columns:1fr;gap:0;padding-block:19px 25px}.home-useful-links>a{padding-block:23px;gap:17px}.home-useful-links>a+a{border-top:1px solid var(--home-line)}.home-useful-links h2{font-size:20px}.home-useful-links p{font-size:12px}}
@media(prefers-reduced-motion:reduce){.home-lower *{transition:none!important}}
</style>
