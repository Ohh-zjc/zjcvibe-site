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
          <span>城陵矶水文站</span>
          <span>东洞庭湖保护区</span>
          <span>江豚保护协会</span>
          <span>岳阳县渔政执法局</span>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="footer-qr">
        <div class="qr-placeholder">
          <el-icon :size="48"><FullScreen /></el-icon>
          <span>扫码访问</span>
        </div>
      </div>
      <p>&copy; 2026 湖北大学计算机学院 · 智护碧水小分队</p>
      <p class="footer-deploy">部署于 GitHub Pages</p>
    </div>
  </footer>
</template>

<script setup>
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

.qr-placeholder {
  width: 80px;
  height: 80px;
  border: 2px dashed rgba(255,255,255,0.3);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 11px;
  color: rgba(255,255,255,0.4);
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
