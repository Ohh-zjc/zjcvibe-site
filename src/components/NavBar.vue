<template>
  <header class="navbar">
    <div class="navbar-inner">
      <router-link to="/" class="site-brand" @click="closeMenu">
        <span class="brand-mark"><ConservationIcon name="river" /></span>
        <span><strong>智护碧水<span>·</span>数绘洞庭</strong><small>洞庭湖 · 长江生态守护平台</small></span>
      </router-link>
      <nav id="main-navigation" class="nav-links" :class="{ 'nav-open': mobileMenuOpen }" aria-label="网站主导航">
        <router-link v-for="link in links" :key="link.to" v-ripple :to="link.to" @click="closeMenu">{{ link.label }}</router-link>
      </nav>
      <button class="mobile-toggle" :aria-expanded="mobileMenuOpen" aria-controls="main-navigation" :aria-label="mobileMenuOpen ? '收起导航' : '展开导航'" @click="mobileMenuOpen = !mobileMenuOpen"><span></span><span></span><span></span></button>
    </div>
  </header>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ConservationIcon from './ConservationIcon.vue'
const mobileMenuOpen = ref(false)
const closeMenu = () => { mobileMenuOpen.value = false }
const route = useRoute()
watch(() => route.path, closeMenu)
const links = [
  { to: '/', label: '首页' }, { to: '/records', label: '护江档案' },
  { to: '/oral-history', label: '护江者说' }, { to: '/shoreline', label: '岸线寻访' },
  { to: '/dashboard', label: '数据看板' }, { to: '/education', label: '童护长江' },
  { to: '/association', label: '认识协会' }, { to: '/resources', label: '资料工具' },
  { to: '/about', label: '共建团队' },
]
</script>
<style scoped>
.navbar{position:fixed;inset:0 0 auto;height:var(--nav-height);z-index:1000;background:rgba(249,250,246,.96);backdrop-filter:blur(18px);border-bottom:1px solid var(--border)}
.navbar-inner{max-width:1320px;height:100%;margin:auto;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 30px}
.site-brand{display:flex;align-items:center;gap:12px;white-space:nowrap;color:var(--primary-dark)}
.site-brand strong{font-size:19px;letter-spacing:.8px;font-weight:750;display:block;line-height:1.45}.site-brand strong span{padding:0 4px;color:#8ca998}.site-brand small{display:block;font-size:10px;letter-spacing:2px;color:var(--text-secondary);margin-top:2px}
.brand-mark{width:41px;height:41px;border:1px solid #a7bdb0;border-radius:50%;display:grid;place-items:center;background:#e9efe6}.brand-mark svg{width:27px;height:27px}
.nav-links{display:flex;align-items:center;gap:2px}.nav-links a{position:relative;padding:24px 10px;color:#526259;font-size:13px;white-space:nowrap;transition:color .2s}.nav-links a:hover,.nav-links a.router-link-active:not([href$='#/']),.nav-links a.router-link-exact-active{color:var(--primary-dark)}
.nav-links a.router-link-exact-active:after,.nav-links a.router-link-active:not([href$='#/']):after{content:'';position:absolute;bottom:14px;left:11px;right:11px;height:2px;background:var(--primary)}
.mobile-toggle{display:none;border:0;background:none;padding:10px;cursor:pointer}.mobile-toggle span{display:block;width:23px;height:2px;background:var(--primary);margin:5px 0}
@media(max-width:1100px){.mobile-toggle{display:block}.nav-links{display:none;position:absolute;top:var(--nav-height);left:0;right:0;background:#fafbf7;padding:12px 22px 22px;box-shadow:0 12px 20px #214e3910;grid-template-columns:repeat(2,1fr);gap:0}.nav-links.nav-open{display:grid}.nav-links a{padding:13px 10px}.nav-links a:after{display:none}.navbar-inner{padding:0 20px}}
@media(max-width:420px){.site-brand strong{font-size:16px}.site-brand small{font-size:9px;letter-spacing:1px}.brand-mark{width:34px;height:34px}.navbar-inner{gap:8px;padding:0 16px}}
</style>
