<template>
  <footer class="page-footer">
    <div class="footer-inner">
      <div class="footer-brand"><ConservationIcon name="river"/><div><h4>智护碧水·数绘洞庭</h4><p>巡护档案 · 现场影像 · 自然教育</p><small>岳阳市江豚保护协会 · 保护记录与公众科普</small></div></div>
      <div class="footer-column"><h5>看见守护</h5><router-link to="/records">护江档案</router-link><router-link to="/oral-history">护江者说</router-link><router-link to="/shoreline">岸线寻访</router-link></div>
      <div class="footer-column"><h5>一起参与</h5><router-link to="/education">童护长江</router-link><router-link to="/resources">资料与工具</router-link><router-link to="/association">认识协会</router-link><router-link to="/about">共建团队</router-link></div>
      <div class="footer-column footer-thanks"><h5>致谢链接</h5><a href="https://mp.weixin.qq.com/s/iHJuXuHhOnBTDJ47u81afw" target="_blank" rel="noopener noreferrer">蓓蕾教育机构</a><a href="https://lyj.yueyang.gov.cn/6983/65985/content_1999390.html" target="_blank" rel="noopener noreferrer">东洞庭湖保护区</a><a href="https://www.yueyang.gov.cn/yyast/31417/73083/73084/content_2283526.html" target="_blank" rel="noopener noreferrer">岳阳市江豚保护协会</a><a href="https://www.yyx.gov.cn/37584/38146/38301/index.htm" target="_blank" rel="noopener noreferrer">岳阳县渔政执法局</a><a href="https://www.junshan.gov.cn/32415/57873/57877/57889/index.htm" target="_blank" rel="noopener noreferrer">君山区团委</a></div>
      <div class="footer-qr"><a class="footer-qr-link" :href="siteUrl" target="_blank" rel="noopener noreferrer" aria-label="扫码或点击访问智护碧水·数绘洞庭平台"><img :src="qrCodeSrc" alt="智护碧水·数绘洞庭网站二维码" loading="lazy"/></a><span>扫码，继续看见守护</span></div>
    </div>
    <div class="footer-bottom"><p>© {{ year }} 智护碧水·数绘洞庭</p><p>平台建设：湖北大学计算机学院“数智护江·绿美长江”暑期社会实践团队</p></div>
  </footer>
</template>
<script setup>
import ConservationIcon from './ConservationIcon.vue'
const qrCodeSrc = `${import.meta.env.BASE_URL}img/site-qr.png`
const siteUrl = 'https://zjcvibe.xyz/'
const year = new Date().getFullYear()
</script>
<style scoped>
.page-footer{background:#153e34;color:#edf1e9;padding:56px 30px 22px}.footer-inner{max-width:var(--max-width);margin:auto;display:grid;grid-template-columns:2fr 1fr 1fr 1fr auto;gap:30px}.footer-brand{display:flex;gap:15px}.footer-brand>svg{width:42px;height:42px;color:#a8c4a9;flex-shrink:0}.footer-brand h4{font-size:20px;letter-spacing:1px}.footer-brand p{font-size:13px;color:#bfd0c4;margin:9px 0 17px}.footer-brand small{font-size:11px;color:#91ae9c}.footer-column h5{font-size:13px;margin-bottom:13px}.footer-column a{display:block;color:#adc5b7;font-size:12px;margin-bottom:9px}.footer-column a:hover{color:#fff}.footer-qr-link{display:block}.footer-qr img{display:block;width:88px;padding:5px;background:white}.footer-qr span{font-size:10px;color:#adc5b7;display:block;margin-top:9px}.footer-bottom{max-width:var(--max-width);margin:35px auto 0;border-top:1px solid #ffffff1f;padding-top:21px;display:flex;justify-content:space-between;gap:20px;font-size:10px;color:#93b09f}
@media(max-width:750px){.page-footer{padding:38px 22px 20px}.footer-inner{grid-template-columns:1fr 1fr;gap:30px}.footer-brand{grid-column:1/-1}.footer-qr{grid-column:1/-1;display:flex;align-items:center;gap:16px}.footer-qr img{width:70px}.footer-bottom{flex-direction:column;gap:7px}}
</style>
