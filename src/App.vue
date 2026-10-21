<template>
  <div id="app-container">
    <a v-if="!isAdminRoute" class="skip-to-content" href="#page-main" @click.prevent="focusMain">跳到主要内容</a>
    <NavBar v-if="!isAdminRoute" />
    <main id="page-main" tabindex="-1" class="main-content" :class="{ 'admin-content': isAdminRoute, 'inner-page': !isAdminRoute && route.path !== '/' }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <PageFooter v-if="!isAdminRoute" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import PageFooter from './components/PageFooter.vue'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
function focusMain() {
  const main = document.getElementById('page-main')
  main?.focus({ preventScroll: true })
  main?.scrollIntoView({ block: 'start' })
}
</script>

<style>
.admin-content {
  margin-top: 0 !important;
}
</style>
