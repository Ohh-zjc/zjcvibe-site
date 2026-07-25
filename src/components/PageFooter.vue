<template>
  <footer class="page-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="footer-logo">🌊</span>
        <div>
          <h4>智护碧水·数绘洞庭</h4>
          <p>湖北大学计算机学院2026年暑期社会实践</p>
        </div>
      </div>
      
      <div class="footer-links">
        <div class="footer-col">
          <h5>页面导航</h5>
          <router-link to="/">首页</router-link>
          <router-link to="/oral-history">护江者说</router-link>
          <router-link to="/shoreline">岸线寻访</router-link>
        </div>
        <div class="footer-col">
          <h5>&nbsp;</h5>
          <router-link to="/dashboard">数据看板</router-link>
          <router-link to="/education">童护长江</router-link>
          <router-link to="/about">关于本项目</router-link>
        </div>
        <div class="footer-col">
          <h5>致谢</h5>
          <a href="https://mp.weixin.qq.com/s/iHJuXuHhOnBTDJ47u81afw" target="_blank" rel="noopener noreferrer">蓓蕾教育机构</a>
          <a href="https://lyj.yueyang.gov.cn/6983/65985/content_1999390.html" target="_blank" rel="noopener noreferrer">东洞庭湖保护区</a>
          <a href="https://www.yueyang.gov.cn/yyast/31417/73083/73084/content_2283526.html" target="_blank" rel="noopener noreferrer">岳阳市江豚保护协会</a>
          <a href="https://www.yyx.gov.cn/37584/38146/38301/index.htm" target="_blank" rel="noopener noreferrer">岳阳县渔政执法局</a>
          <a href="https://www.junshan.gov.cn/32415/57873/57877/57889/index.htm" target="_blank" rel="noopener noreferrer">君山区团委</a>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="footer-qr">
        <a
          class="footer-qr-link"
          :href="siteUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="扫码或点击访问智护碧水·数绘洞庭平台"
        >
          <img class="footer-qr-image" :src="qrCodeSrc" alt="访问智护碧水·数绘洞庭平台的二维码" />
        </a>
      </div>
      <p>&copy; 2026 湖北大学计算机学院 · 智护碧水小分队</p>
      <p class="footer-deploy">部署于 Cloudflare Pages</p>
    </div>
  </footer>
</template>

<script setup>
const siteUrl = 'https://zjcvibe.xyz/'
const qrCodeSrc = `${import.meta.env.BASE_URL}img/site-qr.png`
</script>

<style scoped>
.page-footer {
  background: var(--primary-dark);
  color: rgba(255,255,255,0.9);
  padding: 48px 20px 24px;
}

.footer-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}

.footer-brand {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.footer-logo { font-size: 36px; }

.footer-brand h4 {
  font-size: 18px;
  margin-bottom: 4px;
}

.footer-brand p {
  font-size: 13px;
  opacity: 0.7;
}

.footer-links {
  display: flex;
  gap: 48px;
}

.footer-col h5 {
  font-size: 14px;
  margin-bottom: 12px;
  opacity: 0.8;
}

.footer-col a,
.footer-col span {
  display: block;
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 6px;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-col a:hover { color: #fff; }

.footer-bottom {
  max-width: var(--max-width);
  margin: 32px auto 0;
  padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,0.15);
  text-align: center;
}

.footer-qr {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.footer-qr-link {
  display: block;
  text-decoration: none;
}

.footer-qr-image {
  width: 104px;
  height: 104px;
  display: block;
  padding: 5px;
  background: #fff;
  border: 1px solid rgba(255,255,255,0.45);
  image-rendering: pixelated;
}

.footer-qr-link:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 5px;
}

.footer-bottom p {
  font-size: 13px;
  opacity: 0.6;
}

.footer-deploy { font-size: 12px; margin-top: 4px; opacity: 0.4; }

@media (max-width: 768px) {
  .footer-inner { flex-direction: column; gap: 24px; }
  .footer-links { gap: 24px; flex-wrap: wrap; }
}
</style>
