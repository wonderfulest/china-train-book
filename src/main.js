import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/styles/reset.css'
import '@/assets/styles/theme.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { Icon } from '@iconify/vue'
import { inject } from '@vercel/analytics'
import { initGoogleAnalytics, trackPageView } from './utils/analytics'
import './style.css'

// Initialize analytics
inject()
initGoogleAnalytics()

// Track page views
router.afterEach((to) => {
  trackPageView(to.fullPath)
})

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 全局注册 Iconify 的 Icon 组件
app.component('Icon', Icon)

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
