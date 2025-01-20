import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
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

app.use(router)
app.use(ElementPlus)
app.mount('#app')
