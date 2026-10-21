import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import './assets/styles/global.css'
import './assets/styles/conservation.css'
import './assets/styles/river-theme.css'
import './assets/styles/inner-pages.css'
import './assets/styles/page-refinements.css'
import waterRipple from './directives/waterRipple'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(ElementPlus)
app.directive('ripple', waterRipple)
app.use(router)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
