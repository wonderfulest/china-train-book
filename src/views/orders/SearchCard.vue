<template>
  <div class="search-container">
    <div class="search-form-row">
      <!-- 日期选择 -->
      <div class="date-picker-container" @click="openDatePicker">
        <div class="date-display">
          <div class="date-number">{{ formatDateNumber(date) }}</div>
          <div class="date-month">{{ formatDateMonth(date) }}</div>
        </div>
        <el-date-picker
          ref="datePicker"
          v-model="date"
          type="date"
          placeholder="选择日期"
          :disabled-date="disabledDate"
          format="DD MMM"
          value-format="YYYY-MM-DD"
          style="position: absolute; opacity: 0;"
        />
      </div>
      
      <!-- 城市选择区域 -->
      <div class="cities-container">
        <!-- 出发城市 -->
        <div class="city-input">
          <el-autocomplete
            v-model="from"
            :fetch-suggestions="querySearch"
            placeholder="Beijing"
            class="city-autocomplete-input"
            :trigger-on-focus="true"
            popper-class="city-autocomplete"
            @focus="handleFocus"
            id="from"
            clearable
          >
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
        </div>
        
        <!-- 交换按钮 -->
        <div class="exchange-button">
          <el-button circle @click="exchangeCities" class="exchange-btn">
            <el-icon><Right class="exchange-icon" /></el-icon>
          </el-button>
        </div>
        
        <!-- 到达城市 -->
        <div class="city-input">
          <el-autocomplete
            v-model="to"
            :fetch-suggestions="querySearch"
            placeholder="Xian"
            class="city-autocomplete-input"
            :trigger-on-focus="true"
            popper-class="city-autocomplete"
            @focus="handleFocus"
            id="to"
            clearable
          >
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
        </div>
      </div>
      
      <!-- 搜索按钮 -->
      <el-button type="warning" class="search-button" @click="handleSearch">
        Search Trains
      </el-button>
    </div>
  </div>
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

// 格式化日期为数字（日）
const formatDateNumber = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.getDate()
}

// 格式化日期为月份（Mar）
const formatDateMonth = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[date.getMonth()]
}

// 打开日期选择器
const datePicker = ref(null)
const openDatePicker = () => {
  datePicker.value?.focus()
}

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
.search-container {
  width: 100%;
  padding: 10px;
}

.search-form-row {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
  padding: 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  height: 70px;
}

/* 日期选择容器 */
.date-picker-container {
  width: 70px;
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 8px 0 0 8px;
  padding: 0;
}

.date-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.date-number {
  font-size: 24px;
  font-weight: bold;
  line-height: 1;
}

.date-month {
  font-size: 14px;
  color: #666;
}

/* 城市选择区域 */
.cities-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
  height: 100%;
}

.city-autocomplete-input {
  width: 100%;
}

:deep(.el-input__wrapper) {
  box-shadow: none !important;
  padding: 0;
  border: none;
}

:deep(.el-input__inner) {
  height: 32px;
  font-size: 18px;
  font-weight: 500;
  color: #333;
  background-color: transparent;
  padding: 0;
}


.from-flag {
  background-color: #e6002d;
}

.to-flag {
  background-color: #e6002d;
}

/* 城市输入框样式 */
.city-input {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
}

.city-autocomplete-input {
  width: 100%;
}

/* 交换按钮样式 */
.exchange-button {
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0 10px;
}

.exchange-btn {
  width: 30px;
  height: 30px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border: none;
  color: #666;
}

.exchange-icon {
  transform: rotate(90deg);
  font-size: 14px;
}

:deep(.el-input__wrapper) {
  box-shadow: none !important;
  padding: 0;
  border: none;
  background-color: transparent;
}

:deep(.el-input__inner) {
  height: 32px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  background-color: transparent;
  padding: 0;
}

:deep(.el-input__suffix) {
  display: flex;
  align-items: center;
}

/* 日期选择器样式 */
.date-picker-container {
  cursor: pointer;
}

/* 搜索按钮样式 */
.search-button {
  height: 70px;
  border-radius: 0 8px 8px 0;
  margin: 0;
  padding: 0 20px;
  font-size: 16px;
  font-weight: 600;
  background-color: #ffb800;
  border: none;
  color: #fff;
  min-width: 140px;
}

.search-button:hover {
  background-color: #ffa500;
  transition: all 0.3s ease;
}

/* 自动完成下拉菜单样式 */
:deep(.city-autocomplete) {
  padding: 10px;
  border-radius: 4px;
}

.suggestion-group {
  margin-bottom: 10px;
}

.suggestion-group-label {
  padding: 5px 10px;
  font-size: 13px;
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
  padding: 8px 10px;
  display: block;
  color: #333;
  font-size: 14px;
}

.suggestion-item:hover {
  background-color: #f5f7fa;
}

:deep(.highlight) {
  font-weight: bold !important;
  color: #e6002d !important;
}

@media (max-width: 768px) {
  .search-form-row {
    flex-direction: column;
    height: auto;
    padding: 10px;
    gap: 15px;
  }
  
  .date-picker-container {
    width: 100%;
    height: 50px;
    border-radius: 8px;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
  }
  
  .cities-container {
    width: 100%;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 10px;
  }
  
  .search-button {
    width: 100%;
    border-radius: 8px;
    height: 50px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .search-card {
    padding: 0;
  }
}
</style>
