import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import OralHistory from '../views/OralHistory.vue'
import OralHistoryDetail from '../views/OralHistoryDetail.vue'
import Shoreline from '../views/Shoreline.vue'
import Dashboard from '../views/Dashboard.vue'
import Education from '../views/Education.vue'
import About from '../views/About.vue'
import PracticeLogDetail from '../views/PracticeLogDetail.vue'
import Login from '../views/admin/Login.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'
import AdminOverview from '../views/admin/Overview.vue'
import InterviewsManager from '../views/admin/InterviewsManager.vue'
import GeoManager from '../views/admin/GeoManager.vue'
import DashboardManager from '../views/admin/DashboardManager.vue'
import EducationManager from '../views/admin/EducationManager.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/oral-history', name: 'OralHistory', component: OralHistory },
  { path: '/oral-history/:id', name: 'OralHistoryDetail', component: OralHistoryDetail },
  { path: '/shoreline', name: 'Shoreline', component: Shoreline },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/education', name: 'Education', component: Education },
  { path: '/about', name: 'About', component: About },
  { path: '/practice-log/:id', name: 'PracticeLogDetail', component: PracticeLogDetail },

  // 管理员路由
  { path: '/admin/login', name: 'AdminLogin', component: Login },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'AdminOverview', component: AdminOverview },
      { path: 'interviews', name: 'AdminInterviews', component: InterviewsManager },
      { path: 'geo', name: 'AdminGeo', component: GeoManager },
      { path: 'dashboard', name: 'AdminDashboard', component: DashboardManager },
      { path: 'education', name: 'AdminEducation', component: EducationManager },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() { return { top: 0 } },
})

// 路由守卫：未登录跳转登录页
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 延迟引用避免循环依赖
    import('../stores/auth').then(({ useAuthStore }) => {
      const auth = useAuthStore()
      if (!auth.isLoggedIn) {
        next('/admin/login')
      } else {
        next()
      }
    })
  } else if (to.path === '/admin/login') {
    import('../stores/auth').then(({ useAuthStore }) => {
      const auth = useAuthStore()
      if (auth.isLoggedIn) {
        next('/admin')
      } else {
        next()
      }
    })
  } else {
    next()
  }
})

export default router
