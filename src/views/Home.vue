<template>
  <div class="home">
    <div class="hero-section" :style="{ backgroundImage: 'url(/src/assets/pic-banner01.webp)' }">
      <div class="search-container">
        <el-card class="search-card">
          <div class="card-header">
            <img src="/src/assets/crh-logo.png" alt="CRH Logo" class="crh-logo">
            <h2 class="search-title">Book Your Train Journey in China</h2>
            <p class="search-subtitle">Fast, Easy and Reliable Booking Service</p>
          </div>
          <div class="booking-header">
            <div class="booking-icon">
              <el-icon><Van /></el-icon>
              <span>Train Tickets</span>
            </div>
          </div>
          <el-form label-position="top" class="search-form">
            <div class="form-row">
              <el-form-item label="From" class="form-item">
                <el-autocomplete
                  v-model="from"
                  :fetch-suggestions="querySearch"
                  placeholder="Enter departure city"
                  class="full-width"
                  :trigger-on-focus="true"
                  popper-class="city-autocomplete"
                  @focus="handleFocus"
                  id="from"
                >
                  <template #prefix>
                    <el-icon><Location /></el-icon>
                  </template>
                  <template #default="{ item }">
                    <div class="suggestion-group">
                      <div class="suggestion-group-label">{{ item.label }}</div>
                      <div class="suggestion-list">
                        <div v-for="city in item.cities" 
                             :key="city.stationCode" 
                             class="suggestion-item"
                             @click.stop="handleSelect(city)">
                          <span class="city-pinyin">{{ city.pingYin }}</span>
                          <span class="city-name">{{ city.name }}</span>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-autocomplete>
              </el-form-item>
              <div class="exchange-button">
                <el-button circle @click="exchangeCities">
                  <el-icon><Right class="exchange-icon" /></el-icon>
                </el-button>
              </div>
              <el-form-item label="To" class="form-item">
                <el-autocomplete
                  v-model="to"
                  :fetch-suggestions="querySearch"
                  placeholder="Enter destination city"
                  class="full-width"
                  :trigger-on-focus="true"
                  popper-class="city-autocomplete"
                  @focus="handleFocus"
                  id="to"
                >
                  <template #prefix>
                    <el-icon><Location /></el-icon>
                  </template>
                  <template #default="{ item }">
                    <div class="suggestion-group">
                      <div class="suggestion-group-label">{{ item.label }}</div>
                      <div class="suggestion-list">
                        <div v-for="city in item.cities" 
                             :key="city.stationCode" 
                             class="suggestion-item"
                             @click.stop="handleSelect(city)">
                          <span class="city-pinyin">{{ city.pingYin }}</span>
                          <span class="city-name">{{ city.name }}</span>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-autocomplete>
              </el-form-item>
            </div>
            <el-form-item label="Departure Date">
              <el-date-picker
                v-model="date"
                type="date"
                placeholder="Select date"
                class="full-width"
                :disabled-date="disabledDate"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-button type="danger" class="search-button" @click="handleSearch">
              Search Trains
            </el-button>
          </el-form>
        </el-card>
      </div>
    </div>

    <div class="features-section">
      <div class="section-container">
        <h2 class="section-title">Why Choose Us</h2>
        <p class="section-subtitle">Experience the best train booking service in China</p>
        <el-row :gutter="30">
          <el-col :xs="24" :sm="12" :md="6">
            <div class="feature-item">
              <el-icon class="feature-icon"><Timer /></el-icon>
              <h3>Fast Booking</h3>
              <p>Book your tickets in minutes with our streamlined process</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="feature-item">
              <el-icon class="feature-icon"><Service /></el-icon>
              <h3>24/7 Support</h3>
              <p>Get help anytime with our dedicated English customer service</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="feature-item">
              <el-icon class="feature-icon"><Star /></el-icon>
              <h3>Best Price</h3>
              <p>Guaranteed official prices with no hidden charges</p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="feature-item">
              <el-icon class="feature-icon"><User /></el-icon>
              <h3>Travel Guide</h3>
              <p>Comprehensive guides and tips for your China journey</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="popular-routes">
      <div class="section-container">
        <h2 class="section-title">Popular Routes</h2>
        <p class="section-subtitle">Discover China's most traveled train routes</p>
        <el-row :gutter="30">
          <el-col :xs="24" :sm="12" :md="8" v-for="route in popularRoutes" :key="route.id">
            <el-card class="route-card" @click="handleRouteClick(route)" :body-style="{ padding: '0' }">
              <div class="route-image" :style="{ backgroundImage: `url(${route.image})` }">
                <div class="route-overlay">
                  <span class="route-duration">{{ route.duration }}</span>
                </div>
              </div>
              <div class="route-info">
                <div class="route-cities">
                  <span class="from">{{ route.from }}</span>
                  <el-icon><Right /></el-icon>
                  <span class="to">{{ route.to }}</span>
                </div>
                <div class="route-details">
                  <span class="price">From {{ route.price }} CNY</span>
                </div>
                <p class="route-description">{{ route.description }}</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Location, 
  Van,
  Timer, 
  Service, 
  Star, 
  User, 
  Right
} from '@element-plus/icons-vue'
import axios from 'axios'

const router = useRouter()
const from = ref('')
const to = ref('')
const date = ref(new Date().toISOString().split('T')[0])

const cities = ref([])
const hotCities = ref([])
const pageSize = 6
const currentPages = ref({})
const dropdownVisible = ref(false)

const fromStation = ref(null)
const toStation = ref(null)

onMounted(async () => {
  try {
    // Fetch all cities
    const response = await axios.post('http://api.chinatrainbook.com/train/getAllCity', {})
    cities.value = response.data.result.stations.map(station => ({
      name: station.name,
      stationCode: station.stationCode,
      pingYin: station.pingYin,
      pingYinShort: station.pingYinShort
    }))
    
    // Fetch hot cities
    const hotResponse = await axios.post('http://api.chinatrainbook.com/train/getHotCity', {})
    console.log(hotResponse.data.result.stations[0])

    hotCities.value = hotResponse.data.result.stations.map(station => ({
      name: station.name,
      stationCode: station.stationCode,
      pingYin: station.pingYin,
      pingYinShort: station.pingYinShort
    }))

    // Initialize pages
    currentPages.value = { hot: 1 }
  } catch (error) {
    console.error('Failed to fetch stations:', error)
  }
})

const querySearch = (queryString, cb) => {
  if (!queryString) {
    const suggestions = []
    
    // Add hot cities section
    if (hotCities.value.length > 0) {
      suggestions.push({
        label: '热门城市',
        groupKey: 'hot',
        cities: hotCities.value
      })
    }

    // Group other cities by pinyin first letter
    const groupedCities = {}
    cities.value.forEach(city => {
      const firstLetter = city.pingYin[0].toUpperCase()
      if (!groupedCities[firstLetter]) {
        groupedCities[firstLetter] = []
      }
      groupedCities[firstLetter].push(city)
    })

    // Add grouped cities
    Object.keys(groupedCities).sort().forEach(letter => {
      suggestions.push({
        label: letter.toUpperCase(),
        groupKey: letter,
        cities: groupedCities[letter]
      })
    })

    cb(suggestions)
  } else {
    // When searching, filter cities
    const results = cities.value.filter(city => 
      city.name.toLowerCase().includes(queryString.toLowerCase()) ||
      city.pingYin.toLowerCase().includes(queryString.toLowerCase()) ||
      city.pingYinShort.toLowerCase().includes(queryString.toLowerCase())
    )
    
    if (results.length > 0) {
      cb([{
        label: '搜索结果',
        groupKey: 'search',
        cities: results,
        isSearchResult: true
      }])
    } else {
      cb([])
    }
  }
}

const handleFocus = () => {
  dropdownVisible.value = true
  querySearch('', (suggestions) => {
    const dropdown = document.querySelector('.el-autocomplete-suggestion')
    if (dropdown && dropdown.__vue__) {
      dropdown.__vue__.suggestions = suggestions
    }
  })
}

const popularRoutes = ref([
  { 
    id: 1, 
    from: 'Beijing', 
    to: 'Shanghai', 
    duration: '4h 30m', 
    price: '553',
    image: '/src/assets/beijing-shanghai.jpg',
    description: 'Travel between China\'s two largest cities on the world-class high-speed rail'
  },
  { 
    id: 2, 
    from: 'Shanghai', 
    to: 'Hangzhou', 
    duration: '45m', 
    price: '75',
    image: '/src/assets/shanghai-hangzhou.jpg',
    description: 'Visit the beautiful West Lake and experience the charm of Hangzhou'
  },
  { 
    id: 3, 
    from: 'Beijing', 
    to: 'Xi\'an', 
    duration: '5h 30m', 
    price: '515',
    image: '/src/assets/beijing-xian.jpg',
    description: 'Explore the ancient Terracotta Warriors and taste authentic Chinese cuisine'
  }
])

const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7
}

const handleSearch = () => {
  router.push({
    path: '/search',
    query: {
      from: fromStation.value?.stationCode,
      to: toStation.value?.stationCode,
      date: date.value
    }
  })
}

const handleRouteClick = (route) => {
  from.value = route.from
  to.value = route.to
  date.value = new Date().toISOString().split('T')[0]
  handleSearch()
}

const exchangeCities = () => {
  // 交换显示值
  const tempDisplay = from.value
  from.value = to.value
  to.value = tempDisplay

  // 交换完整数据
  const tempStation = { ...fromStation.value }
  fromStation.value = { ...toStation.value }
  toStation.value = tempStation
}

const handleSelect = (item) => {
  const activeElement = document.activeElement
  console.log('handleSelect:', item, activeElement.id)
  if (activeElement.id === 'from') {
    from.value = item.name
    fromStation.value = {
      name: item.name,
      stationCode: item.stationCode,
      pingYin: item.pingYin,
      pingYinShort: item.pingYinShort
    }
  } else if (activeElement.id === 'to') {
    to.value = item.name
    toStation.value = {
      name: item.name,
      stationCode: item.stationCode,
      pingYin: item.pingYin,
      pingYinShort: item.pingYinShort
    }
  }
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background-color);
}

:deep(.el-input__wrapper) {
  padding: 4px 15px;
}

:deep(.el-input__inner) {
  height: 40px;
  font-size: 16px;
}

:deep(.el-date-editor.el-input) {
  height: 48px;
}

:deep(.el-date-editor .el-input__wrapper) {
  height: 48px;
}

:deep(.el-input__prefix) {
  align-items: center;
  height: 100%;
}

.hero-section {
  min-height: 100vh;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4));
}

.search-container {
  width: 100%;
  max-width: 1000px;
  position: relative;
  z-index: 1;
  padding: 0 24px;
}

.search-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-header {
  text-align: center;
  margin-bottom: 40px;
}

.crh-logo {
  height: 72px;
  width: auto;
  margin-bottom: 24px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.search-title {
  color: var(--text-color);
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.2;
}

.search-subtitle {
  color: var(--text-color-secondary);
  font-size: 18px;
  max-width: 600px;
  margin: 0 auto;
}

.booking-header {
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.booking-icon {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  color: var(--primary-color);
  font-weight: 600;
}

.form-row {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.form-item {
  flex: 1;
}

.exchange-button {
  display: flex;
  align-items: flex-end;
  padding-bottom: 32px;
}

.exchange-button .el-button {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transition: all 0.3s ease;
}

.exchange-button .el-button:hover {
  background: var(--primary-color);
  color: white;
  transform: rotate(180deg);
}

.exchange-icon {
  transform: rotate(90deg);
  transition: all 0.3s ease;
}

.search-button {
  width: 100%;
  height: 56px;
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(45deg, var(--primary-color), #ff1a43);
  border: none;
  margin-top: 24px;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 56, 92, 0.3);
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 24px;
}

.section-title {
  text-align: center;
  color: var(--text-color);
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.section-subtitle {
  text-align: center;
  color: var(--text-color-secondary);
  font-size: 20px;
  margin-bottom: 64px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.features-section {
  background: white;
  position: relative;
}

.features-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-color), transparent);
}

.feature-item {
  text-align: center;
  padding: 40px 32px;
  background: white;
  border-radius: 24px;
  height: 100%;
  transition: all 0.4s ease;
  border: 1px solid var(--border-color);
}

.feature-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border-color: transparent;
}

.feature-icon {
  font-size: 48px;
  color: var(--primary-color);
  margin-bottom: 24px;
  transition: all 0.4s ease;
}

.feature-item:hover .feature-icon {
  transform: scale(1.1);
}

.feature-item h3 {
  color: var(--text-color);
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
}

.feature-item p {
  color: var(--text-color-secondary);
  line-height: 1.6;
  font-size: 16px;
}

.popular-routes {
  background: var(--background-color);
  position: relative;
}

.route-card {
  height: 100%;
  transition: all 0.4s ease;
  border: none;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  background: white;
}

.route-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.route-image {
  height: 240px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.route-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  padding: 10px 16px;
  border-radius: 24px;
}

.route-duration {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.route-info {
  padding: 32px;
}

.route-cities {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.route-cities .from,
.route-cities .to {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.2;
}

.route-details {
  margin-bottom: 16px;
}

.route-details .price {
  color: var(--primary-color);
  font-size: 18px;
  font-weight: 600;
}

.route-description {
  color: var(--text-color-secondary);
  font-size: 15px;
  line-height: 1.6;
}

:deep(.city-autocomplete) {
  padding: 16px;
}

:deep(.city-autocomplete .el-scrollbar__view) {
  padding: 0;
}

:deep(.city-autocomplete .el-autocomplete-suggestion__wrap) {
  margin: 0;
  padding: 0;
}

:deep(.city-autocomplete .el-autocomplete-suggestion__list) {
  padding: 0;
  margin: 0;
}

.suggestion-group {
  margin-bottom: 16px;
}

.suggestion-group-label {
  padding: 0 16px;
  font-size: 14px;
  color: #999;
  margin-bottom: 8px;
}

.suggestion-list {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  padding: 0 16px;
}

.suggestion-item {
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.suggestion-item:hover {
  background-color: var(--el-color-primary-light-9);
}

.city-pinyin {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.city-name {
  font-size: 14px;
  color: var(--el-text-color-primary);
  font-weight: 500;
}

@media (max-width: 768px) {
  .hero-section {
    min-height: auto;
    padding: 120px 16px 60px;
  }
  
  .search-card {
    padding: 24px;
    border-radius: 16px;
  }
  
  .search-title {
    font-size: 28px;
  }
  
  .search-subtitle {
    font-size: 16px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .exchange-button {
    align-items: center;
    padding: 16px 0;
  }
  
  .exchange-icon {
    transform: rotate(0deg);
  }
  
  .section-container {
    padding: 60px 16px;
  }
  
  .section-title {
    font-size: 32px;
  }
  
  .section-subtitle {
    font-size: 18px;
    margin-bottom: 40px;
  }
  
  .feature-item,
  .route-card {
    margin-bottom: 24px;
  }
  
  .route-cities .from,
  .route-cities .to {
    font-size: 20px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .section-container {
    padding: 80px 24px;
  }
  
  .search-card {
    padding: 32px;
  }
}

@media (min-width: 1025px) {
  .route-card:hover .route-image {
    transform: scale(1.05);
    transition: transform 0.4s ease;
  }
}
</style>
