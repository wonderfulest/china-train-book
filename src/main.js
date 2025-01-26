import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/styles/reset.css'
import '@/assets/styles/variables.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
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

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(ElementPlus)
app.mount('#app')
