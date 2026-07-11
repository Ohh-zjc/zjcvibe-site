<template>
  <header class="navbar">
    <div class="navbar-inner">
      <router-link to="/" class="logo">
        <span class="logo-icon">🌊</span>
        <span class="logo-text">智护碧水·数绘洞庭</span>
      </router-link>
      
      <nav class="nav-links" :class="{ 'nav-open': mobileMenuOpen }">
        <router-link to="/" @click="closeMenu">首页</router-link>
        <router-link to="/oral-history" @click="closeMenu">护江者说</router-link>
        <router-link to="/shoreline" @click="closeMenu">岸线寻访</router-link>
        <router-link to="/dashboard" @click="closeMenu">数据看板</router-link>
        <router-link to="/education" @click="closeMenu">童护长江</router-link>
        <router-link to="/about" @click="closeMenu">关于</router-link>
      </nav>

      <button class="mobile-toggle" @click="mobileMenuOpen = !mobileMenuOpen">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)
const closeMenu = () => { mobileMenuOpen.value = false }
</script>

<style scoped>
.navbar {
  position: fixed; top: 0; left: 0; right: 0; height: 64px;
  background: rgba(255,255,255,0.95); backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border); z-index: 1000;
}
.navbar-inner {
  max-width: var(--max-width); margin: 0 auto; height: 100%;
  display: flex; align-items: center; justify-content: space-between; padding: 0 20px;
}
.logo { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 18px; color: var(--primary-dark); text-decoration: none; }
.logo-icon { font-size: 24px; }
.nav-links { display: flex; gap: 4px; }
.nav-links a {
  padding: 8px 16px; border-radius: 8px; color: var(--text-secondary);
  font-size: 15px; transition: all 0.2s;
}
.nav-links a:hover, .nav-links a.router-link-exact-active {
  color: var(--primary); background: var(--bg-light);
}
.mobile-toggle { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
.mobile-toggle span { display: block; width: 24px; height: 2px; background: var(--text-primary); border-radius: 2px; }
@media (max-width: 768px) {
  .mobile-toggle { display: flex; }
  .nav-links { display: none; position: absolute; top: 64px; left: 0; right: 0; background: #fff; flex-direction: column; padding: 12px; box-shadow: var(--shadow-lg); }
  .nav-links.nav-open { display: flex; }
  .nav-links a { padding: 12px 16px; }
}
</style>
