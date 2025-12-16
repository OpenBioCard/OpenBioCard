import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createHead } from '@vueuse/head'
import './style.css'
import App from './App.vue'
import i18n from './i18n'

// 导入页面组件
import Index from './pages/index.vue'
import UserProfile from './pages/[username].vue'

console.log('main.js loaded')

// 创建路由
const routes = [
  { path: '/', component: Index },
  { path: '/frontend', component: Index },
  { path: '/:username', component: UserProfile, beforeEnter: (to, from) => {
    // 排除保留路由
    if (['signup', 'signin', 'delete', 'admin', 'init-admin', 'frontend'].includes(to.params.username)) {
      return false
    }
  }}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
const head = createHead()
app.use(head)
app.use(router)
app.use(i18n)
app.mount('#app')
console.log('app mounted')
