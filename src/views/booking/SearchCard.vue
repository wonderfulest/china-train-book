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
                    <span v-html="city.displayPinyin"></span>
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
                    <span v-html="city.displayPinyin"></span>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCityStore } from '@/stores/city'
import { useBookingStore } from '@/stores/bookingProcess'
import { storeToRefs } from 'pinia'
import { Location, Van, Right } from '@element-plus/icons-vue'
import { createOrderSearch } from '@/api/modules/orders'
import { ElMessage } from 'element-plus'

const router = useRouter()
const emit = defineEmits(['search'])

const cityStore = useCityStore()
const { allCities, hotCities } = storeToRefs(cityStore)

// 本地城市列表
const cities = computed(() => allCities.value)
const localHotCities = computed(() => hotCities.value)

const from = ref('')
const to = ref('')
const date = ref(new Date().toISOString().split('T')[0])
const fromStation = ref(null)
const toStation = ref(null)
const searchQuery = ref('')

// 高亮匹配文本的函数
const highlightMatch = (text, query) => {
  if (!query) return text
  
  // 转换为小写进行匹配
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  
  // 如果没有匹配到，直接返回原文本
  const index = lowerText.indexOf(lowerQuery)
  if (index === -1) return text
  
  // 保持原文本的大小写，只添加高亮样式
  const before = text.slice(0, index)
  const match = text.slice(index, index + query.length)
  const after = text.slice(index + query.length)
  console.log(before, match, after)
  return before + `<span class="highlight">${match}</span>` + after
}

const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7 || time.getTime() > Date.now() + 8.64e7 * 30
}

const handleSearch = async () => {
  if (!fromStation.value || !toStation.value || !date.value) {
    ElMessage.warning('请填写所有搜索字段')
    return
  }

  try {
    // 调用订单搜索接口
    const response = await createOrderSearch({
      from: fromStation.value.stationCode,
      to: toStation.value.stationCode,
      date: date.value,
      isStudent: false
    })

    if (response.code === '0' && response.data?.uuid) {
      // 保存订单ID到store中
      const bookingStore = useBookingStore()
      bookingStore.setOrderId(response.data.uuid)
      
      // 保存搜索参数
      bookingStore.setSearchParams({
        from: fromStation.value.stationCode,
        to: toStation.value.stationCode,
        date: date.value
      })

      // 跳转到时刻表页面
      router.push(`/trains/order/${response.data.uuid}/timetable`)
    } else {
      ElMessage.error('搜索失败，请稍后重试')
    }
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败，请稍后重试')
  }
}

const handleSelect = (item) => {
  const activeElement = document.activeElement
  if (activeElement.id === 'from') {
    fromStation.value = item
    from.value = item.pingYin
  } else if (activeElement.id === 'to') {
    toStation.value = item
    to.value = item.pingYin
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
  searchQuery.value = queryString
  if (!queryString) {
    const suggestions = []
    
    // Add hot cities section
    if (localHotCities.value.length > 0) {
      suggestions.push({
        label: 'Hot Cities',
        cities: localHotCities.value.map(city => ({
          ...city,
          pingYin: city.pingYin.charAt(0).toUpperCase() + city.pingYin.slice(1).toLowerCase(),
          displayPinyin: city.pingYin.charAt(0).toUpperCase() + city.pingYin.slice(1).toLowerCase()
        }))
      })
    }

    // Group other cities by pinyin first letter
    const groupedCities = {}
    cities.value.forEach(city => {
      const firstLetter = city.pingYin[0].toUpperCase()
      if (!groupedCities[firstLetter]) {
        groupedCities[firstLetter] = []
      }
      const formattedPinyin = city.pingYin.charAt(0).toUpperCase() + city.pingYin.slice(1).toLowerCase()
      groupedCities[firstLetter].push({
        ...city,
        pingYin: formattedPinyin,
        displayPinyin: formattedPinyin
      })
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
    const searchStr = queryString.toLowerCase()
    const results = cities.value.filter(city => {
      return city.name.toLowerCase().includes(searchStr) ||
             city.pingYin.toLowerCase().includes(searchStr) ||
             city.pingYinShort.toLowerCase().includes(searchStr)
    }).map(city => {
      const formattedPinyin = city.pingYin.charAt(0).toUpperCase() + city.pingYin.slice(1).toLowerCase()
      return {
        ...city,
        pingYin: formattedPinyin,
        displayPinyin: highlightMatch(formattedPinyin, queryString)
      }
    })

    cb([{ label: 'Search Results', cities: results }])
  }
}

const handleFocus = async () => {
  if (cities.value.length === 0) {
    try {
      await cityStore.initializeCities()
    } catch (error) {
      console.error('Failed to initialize cities:', error)
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

:deep(.el-date-editor.el-input),
:deep(.el-date-editor .el-input__wrapper) {
  width: 100%;
  height: 48px;
}

:deep(.el-date-editor .el-input__wrapper) {
  padding: 4px 15px;
}

:deep(.el-date-editor .el-input__inner) {
  height: 40px;
  font-size: 16px;
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
  padding: 8px 16px;
  font-size: 14px;
  color: #999;
  background-color: #f5f7fa;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
}

.suggestion-item {
  cursor: pointer;
  padding: 8px 16px;
  display: block;
  color: var(--el-text-color-primary);
  font-size: 14px;
}

.suggestion-item:hover {
  background-color: var(--el-color-primary-light-9);
}

:deep(.highlight) {
  font-weight: bold !important;
  text-decoration: underline !important;
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
