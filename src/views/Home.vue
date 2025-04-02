<template>
  <div class="home">
    <section class="hero-section" :style="{ backgroundImage: `url(/assets/heros/${currentHero})` }">
      <div class="hero-content">
        <transition name="fade" mode="out-in">
          <h1 :key="currentSlogan" class="slogan">{{ slogans[currentSloganIndex] }}</h1>
        </transition>
        <!-- 搜索卡片 -->
        <div class="search-card-wrapper">
          <SearchCard />
        </div>
      </div>
      
      <div class="hero-indicators">
        <span 
          v-for="(_, index) in heroImages" 
          :key="index"
          :class="['indicator', { active: index === currentHeroIndex }]"
          @click="setHero(index)"
        ></span>
      </div>
    </section>
    <section class="benefits-section">
      <div class="benefits-container">
        <div class="benefit-item">
          <h3>The Most Convenient Way to Book Train Tickets Online</h3>
          <ul>
            <li>Trains leave a 96% smaller carbon footprint than planes</li>
            <li>Helpful customer service team ready to assist you</li>
            <li>More than 10 convenient payment methods are available</li>
          </ul>
        </div>
        <div class="benefit-item">
          <h3>Trusted by leisure & business travelers worldwide</h3>
          <div class="review-link">
            <el-button type="primary">Read reviews</el-button>
          </div>
        </div>
      </div>
    </section>
    <FeatureSection />
    <PopularRoutes />
    <Transition name="fade">
      <div v-if="showTips" class="contact-tips">
        <div class="tip-item">
          <Icon icon="mdi:message" width="20" height="20" />
          <span>Need immediate help? Chat with us in real-time</span>
        </div>
        <div class="tip-item">
          <Icon icon="mdi:share-variant" width="20" height="20" />
          <span>Follow us on social media for latest updates</span>
        </div>
        <div class="tip-arrow"></div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import SearchCard from '@/views/orders/SearchCard.vue'
import FeatureSection from '@/components/Home/FeatureSection.vue'
import PopularRoutes from '@/components/Home/PopularRoutes.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCityStore } from '@/stores/city'

const router = useRouter()
const cityStore = useCityStore()


const date = ref(new Date().toISOString().split('T')[0])
const fromStation = ref(null)
const toStation = ref(null)

// 英雄图片列表
const heroImages = [
  '01.jpeg',
  '02.png',
  '03.jpeg',
  '04.jpeg',
  '05.jpeg'
]

const currentHeroIndex = ref(0)
const currentHero = ref(heroImages[0])
const heroTimer = ref(null)

const slogans = [
  "Experience China by Rail - Your Journey Begins Here",
  "Fast, Reliable, and Eco-friendly Travel Across China",
  "Connect with Cities, Connect with Culture - Travel by Train",
  "Smart Travel Choice: Book Your Train Tickets Online",
  "Discover China's Beauty Through Its Railway Network",
  "Safe, Comfortable, and Punctual - That's Train Travel",
  "Your Gateway to Hassle-free Train Travel in China",
  "Modern Trains, Timeless Experiences - Book Now",
  "Take the Train. It's More Convenient and It's Better for Our Planet",
  "Sustainable Travel for a Better Tomorrow - Choose Trains"
]

const currentSloganIndex = ref(0)
const sloganTimer = ref(null)

const showTips = ref(false)
let tipTimer = null

const handleSearchCardSubmit = (searchParams) => {
  window.location.href = `/trains/order/${searchParams.orderId}/timetable`
}

onMounted(async () => {
  await cityStore.initializeCityData()
  // 启动图片轮播
  heroTimer.value = setInterval(rotateHero, 8000) // 每8秒切换一次图片
  // 启动标语轮播
  sloganTimer.value = setInterval(rotateSlogan, 5000) // 每5秒切换一次标语
  // 延迟 1 秒后显示提示
  setTimeout(showContactTips, 1000)
})

onUnmounted(() => {
  // 清理定时器
  if (heroTimer.value) clearInterval(heroTimer.value)
  if (sloganTimer.value) clearInterval(sloganTimer.value)
  if (tipTimer) clearTimeout(tipTimer)
})

const rotateHero = () => {
  currentHeroIndex.value = (currentHeroIndex.value + 1) % heroImages.length
  currentHero.value = heroImages[currentHeroIndex.value]
}

const setHero = (index) => {
  currentHeroIndex.value = index
  currentHero.value = heroImages[index]
  // 重置定时器
  if (heroTimer.value) {
    clearInterval(heroTimer.value)
    heroTimer.value = setInterval(rotateHero, 8000)
  }
}

const rotateSlogan = () => {
  currentSloganIndex.value = (currentSloganIndex.value + 1) % slogans.length
}

const querySearch = async (queryString, cb) => {
  const results = cityStore.searchCities(queryString)
  cb(results)
}

const handleSearch = () => {
  router.push({
    path: '/trains/timetable',
    query: {
      from: fromStation.value?.stationCode,
      to: toStation.value?.stationCode,
      date: date.value
    }
  })
}

// 显示提示
const showContactTips = () => {
  showTips.value = true
  // 3秒后自动隐藏
  if (tipTimer) clearTimeout(tipTimer)
  tipTimer = setTimeout(() => {
    showTips.value = false
  }, 3000)
}
</script>

<style scoped>
.home {
  font-family: Arial, sans-serif;
  color: var(--text-color-dark);
}

.hero-section {
  position: relative;
  height: 600px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: background-image 1s ease-in-out;
}

.hero-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  padding: 20px;
}

.hero-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}

.search-card-wrapper {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  z-index: 2; /* 确保搜索卡片在最上层 */
}

.benefits-section {
  background-color: var(--bg-color-grey);
  padding: 60px 20px;
}

.benefits-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.benefit-item {
  flex: 1;
  background-color: var(--bg-color-light);
  padding: 30px;
  border-radius: 8px;
  box-shadow: var(--shadow-light);
}

.benefit-item h3 {
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--text-color-dark);
  margin-bottom: 20px;
  line-height: 1.3;
}

.benefit-item ul {
  padding-left: 20px;
  margin-bottom: 0;
}

.benefit-item li {
  margin-bottom: 12px;
  font-size: 1.1rem;
  color: var(--text-color-dark);
  line-height: 1.5;
}

.review-link {
  margin-top: 30px;
}

.review-link .el-button {
  background-color: var(--bg-color-dark);
  border-color: var(--bg-color-dark);
  font-size: 1.1rem;
  padding: 12px 24px;
  border-radius: 4px;
}

.review-link .el-button:hover {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

@media (max-width: 768px) {
  .hero-section {
    height: auto;
    min-height: 500px;
  }

  .hero-content {
    padding: 40px 10px;
  }

  .slogan {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .search-card-wrapper {
    width: 95%;
  }
}

.slogan {
  margin-bottom: 40px; /* 为搜索卡片留出空间 */
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* 淡入淡出效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .slogan {
    font-size: 1.5rem;
    padding: 0 10px;
  }
  
  .slogan-container {
    height: 80px;
  }
}

.contact-tips {
  position: fixed;
  right: 85px;
  bottom: 120px;
  background: rgba(255, 255, 255, 0.98);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  max-width: 250px;
  z-index: 999;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  color: #333;
}

.tip-item:first-child {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

/* 添加箭头 */
.tip-arrow {
  position: absolute;
  right: -6px;
  bottom: 20px;
  width: 12px;
  height: 12px;
  background: white;
  transform: rotate(45deg);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

@media (max-width: 768px) {
  .contact-tips {
    right: 70px;
    bottom: 140px;
    max-width: 200px;
    font-size: 12px;
  }
}
</style>

