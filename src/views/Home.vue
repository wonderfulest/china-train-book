<template>
  <div class="home">
    <section class="hero-section" :style="{ backgroundImage: 'url(/src/assets/high-speed-train.jpg)' }">
      <div class="hero-content">
        <div class="slogan-container">
          <transition name="fade" mode="out-in">
            <h1 :key="currentSlogan" class="slogan">{{ slogans[currentIndex] }}</h1>
          </transition>
        </div>
      </div>
      <div class="search-container">
        <SearchCard   @timetable="handleSearchCardSubmit" />
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

const from = ref('')
const to = ref('')
const date = ref(new Date().toISOString().split('T')[0])
const fromStation = ref(null)
const toStation = ref(null)

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

const currentIndex = ref(0)
const timer = ref(null)

const handleSearchCardSubmit = (searchParams) => {
  window.location.href = `/trains/order/${searchParams.orderId}/timetable`
}

onMounted(async () => {
  await cityStore.initializeCityData()
  timer.value = setInterval(rotateSlogan, 5000) // 每5秒切换一次
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})

const rotateSlogan = () => {
  currentIndex.value = (currentIndex.value + 1) % slogans.length
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
</script>

<style scoped>
.home {
  font-family: Arial, sans-serif;
  color: var(--text-color-dark);
}

.hero-section {
  min-height: 42vh; 
  width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8));
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 900px;
  padding: 0 20px;
  margin-bottom: 30px;
}

.hero-content h1 {
  color: var(--text-color-light);
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 30px;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.search-container {
  width: 100%;
  max-width: 1000px;
  position: relative;
  z-index: 1;
  padding: 24px;
  margin-top: 0;
  background-color: transparent;
  border-radius: 8px;
  --search-bg-color: rgba(255, 255, 255, var(--transparency-light));
  --search-box-shadow: var(--shadow-medium);
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
    min-height: 50vh;
    padding: 60px 0;
  }
  
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .benefits-container {
    flex-direction: column;
  }
  
  .search-container {
    margin-top: 0;
  }
}

.slogan-container {
  height: 60px; /* 固定高度避免切换时的跳动 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.slogan {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
  padding: 0 20px;
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
</style>
