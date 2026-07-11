<template>
  <div id="app-container">
    <NavBar v-if="!isAdminRoute" />
    <main class="main-content" :class="{ 'admin-content': isAdminRoute }">
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
</script>

<style>
.admin-content {
  margin-top: 0 !important;
}
</style>
