<template>
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
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Location, Van, Right } from '@element-plus/icons-vue'
import { getAllCity, getHotCity } from '@/api/modules/train'

const router = useRouter()
const emit = defineEmits(['search'])

const from = ref('')
const to = ref('')
const date = ref(new Date().toISOString().split('T')[0])
const cities = ref([])
const hotCities = ref([])
const fromStation = ref(null)
const toStation = ref(null)

const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7 || time.getTime() > Date.now() + 8.64e7 * 30
}

const handleSearch = () => {
  if (!fromStation.value || !toStation.value || !date.value) {
    ElMessage.warning('Please fill in all search fields')
    return
  }

  router.push({
    path: '/search',
    query: {
      from: fromStation.value.stationCode,
      to: toStation.value.stationCode,
      date: date.value
    }
  })
}

const handleSelect = (item) => {
  const activeElement = document.activeElement
  if (activeElement.id === 'from') {
    fromStation.value = item
    from.value = item.name
  } else if (activeElement.id === 'to') {
    toStation.value = item
    to.value = item.name
  }
}

const exchangeCities = () => {
  const tempValue = from.value
  from.value = to.value
  to.value = tempValue

  const tempStation = { ...fromStation.value }
  fromStation.value = { ...toStation.value }
  toStation.value = tempStation
}

const querySearch = (queryString, cb) => {
  if (!queryString) {
    const suggestions = []
    
    // Add hot cities section
    if (hotCities.value.length > 0) {
      suggestions.push({
        label: '热门城市',
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
    Object.entries(groupedCities)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([letter, cities]) => {
        suggestions.push({
          label: letter,
          cities: cities
        })
      })

    cb(suggestions)
  } else {
    const results = cities.value.filter(city => {
      return city.name.toLowerCase().includes(queryString.toLowerCase()) ||
             city.pingYin.toLowerCase().includes(queryString.toLowerCase()) ||
             city.pingYinShort.toLowerCase().includes(queryString.toLowerCase())
    })

    cb([{ label: 'Search Results', cities: results }])
  }
}

const handleFocus = async () => {
  if (cities.value.length === 0) {
    try {
      // 获取所有城市
      const response = await getAllCity()
      cities.value = response.result.stations.map(station => ({
        name: station.name,
        stationCode: station.stationCode,
        pingYin: station.pingYin,
        pingYinShort: station.pingYinShort
      }))
      
      // 获取热门城市
      const hotResponse = await getHotCity()
      hotCities.value = hotResponse.result.stations.map(station => ({
        name: station.name,
        stationCode: station.stationCode,
        pingYin: station.pingYin,
        pingYinShort: station.pingYinShort
      }))
    } catch (error) {
      console.error('Failed to fetch stations:', error)
    }
  }
}
</script>

<style scoped>
.search-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
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

:deep(.el-card__body) {
  padding: 0;
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

.full-width {
  width: 100%;
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
}

@media (min-width: 769px) and (max-width: 1024px) {
  .search-card {
    padding: 32px;
  }
}
</style>
