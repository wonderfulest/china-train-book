<template>
  <div class="search-results">
    <div class="search-header">
      <div class="search-params">
        <div class="param">
          <label>From</label>
          <el-autocomplete
            id="from-search"
            v-model="from"
            :fetch-suggestions="querySearch"
            placeholder="Enter departure city"
            class="full-width"
            :trigger-on-focus="true"
            popper-class="city-autocomplete"
            @select="handleSelect"
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
        </div>
        <div class="exchange-button">
          <el-icon class="swap-icon" @click="swapLocations"><Switch /></el-icon>
        </div>
        <div class="param">
          <label>To</label>
          <el-autocomplete
            id="to-search"
            v-model="to"
            :fetch-suggestions="querySearch"
            placeholder="Enter destination city"
            class="full-width"
            :trigger-on-focus="true"
            popper-class="city-autocomplete"
            @select="handleSelect"
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
        </div>
        <div class="param">
          <label>Date</label>
          <el-date-picker 
            v-model="date" 
            type="date" 
            placeholder="Select Date"
            :disabled-date="disabledDate"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :shortcuts="dateShortcuts"
            style="width: 100%"
          />
        </div>
        <el-button type="primary" class="search-btn" @click="searchTrains">Search</el-button>
      </div>
      <div class="filters">
        <div class="filter-group">
          <label>Train Type:</label>
          <el-select v-model="trainType" placeholder="All Trains" class="filter-select">
            <el-option label="All Trains" value="" />
            <el-option label="High Speed G" value="G" />
            <el-option label="High Speed D" value="D" />
            <el-option label="Normal K" value="K" />
          </el-select>
        </div>
        <div class="filter-group">
          <label>Depart Times:</label>
          <el-select v-model="departTime" placeholder="All Times" class="filter-select">
            <el-option label="All Times" value="" />
            <el-option label="Morning (6:00-12:00)" value="morning" />
            <el-option label="Afternoon (12:00-18:00)" value="afternoon" />
            <el-option label="Evening (18:00-24:00)" value="evening" />
          </el-select>
        </div>
        <div class="filter-group">
          <label>Depart Stations:</label>
          <el-select v-model="departStation" placeholder="All Stations" class="filter-select">
            <el-option label="All Stations" value="" />
            <el-option label="Shanghai Hongqiao" value="hongqiao" />
            <el-option label="Shanghai" value="shanghai" />
          </el-select>
        </div>
      </div>
    </div>

    <div class="results-list">
      <el-empty v-if="!loading && trains.length === 0" description="No trains found" />
      <el-skeleton v-if="loading" :rows="3" animated />
      
      <template v-if="!loading && trains.length > 0">
        <div class="list-header">
          <div class="col train">Train</div>
          <div class="col departure">Departure</div>
          <div class="col duration">Duration</div>
          <div class="col arrival">Arrival</div>
          <div class="col action"></div>
        </div>
        
        <div v-for="train in trains" :key="train.id">
          <div class="train-item">
            <div class="col train">
              <div class="train-number">{{ train.number }}</div>
              <div class="train-type">{{ train.type }}</div>
            </div>
            <div class="col departure">
              <div class="time">{{ train.departTime }}</div>
              <div class="station">{{ train.departStation }}</div>
            </div>
            <div class="col duration">
              <div class="duration-time">{{ train.duration }}</div>
              <div class="duration-line"></div>
            </div>
            <div class="col arrival">
              <div class="time">{{ train.arrivalTime }}</div>
              <div class="station">{{ train.arrivalStation }}</div>
            </div>
            <div class="col action">
              <el-button type="primary" size="small" @click="expandDetails(train)">
                {{ train.expanded ? 'Hide' : 'Details' }}
              </el-button>
            </div>
          </div>
          <div v-if="train.expanded" class="train-details">
            <div v-for="seat in train.seats" :key="seat.type" class="seat-detail">
              <div class="seat-info">
                <div class="seat-type">{{ seat.type }}</div>
                <div class="amenities">
                  <img v-for="amenity in seat.amenities" 
                       :key="amenity"
                       :src="`/src/assets/amenities/${amenity}.png`" 
                       :alt="amenity"
                       class="amenity-icon" />
                </div>
              </div>
              <div class="seat-status">{{ seat.status }}</div>
              <div class="seat-price" @click="goToCreateOrder(train, seat)" style="cursor: pointer">
                <span class="currency">USD</span>
                <span class="amount">{{ convertToUSD(seat.price) }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Switch, Location } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getTicketList } from '@/api/modules/train'
import { getExchangeRate } from '@/api/modules/exchange'
import { useCityStore } from '@/stores/city'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const cityStore = useCityStore()
const { allCities, hotCities } = storeToRefs(cityStore)

// 转换城市数据格式
const cities = computed(() => allCities.value.map(station => ({
  value: station.pingYin,
  name: station.pingYin,
  stationCode: station.stationCode,
  label: `${station.name} - ${station.pingYin}`
})))

const localHotCities = computed(() => hotCities.value.map(station => ({
  value: station.pingYin,
  name: station.pingYin,
  stationCode: station.stationCode,
  label: `${station.name} - ${station.pingYin}`
})))

const from = ref('')
const to = ref('')
const fromStation = ref(null)
const toStation = ref(null)
const date = ref('')
const trainType = ref('')
const departTime = ref('')
const departStation = ref('')
const trains = ref([])
const loading = ref(false)
const searchQuery = ref('')
const exchangeRate = ref(null)

// 获取汇率
const fetchExchangeRate = async () => {
  try {
    // const response = await getExchangeRate('CNY', 'USD')
    const response =  {
      code: '0',
      message: null,
      data: {
        exchangeRate: {
          fromCurrencyCode: 'CNY',
          fromCurrencyName: 'Chinese Yuan',
          toCurrencyCode: 'USD',
          toCurrencyName: 'United States Dollar',
          exchangeRate: '0.13810000',
          lastRefreshed: '',
          timeZone: 'UTC',
          bidPrice: '0.13809000',
          askPrice: '0.13810000'
        }
      }
    }
    if (response.code === '0' && response.data?.exchangeRate) {
      // 加上千分之五的汇差
      const rate = parseFloat(response.data.exchangeRate.exchangeRate)
      exchangeRate.value = rate * (1 - 0.005)
    }
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error)
    ElMessage.error('Failed to load exchange rate data')
  }
}

const initialize = async () => {
  loading.value = true
  try {
    await Promise.all([
      fetchExchangeRate(),
      cityStore.initializeCityData()
    ])
    
    // 如果URL中有参数，查找对应的车站信息
    const { from: fromCode, to: toCode, date: dateStr } = route.query
    
    if (fromCode) {
      const station = cities.value.find(c => c.stationCode === fromCode)
      if (station) {
        fromStation.value = station
        from.value = station.value
      }
    }
    
    if (toCode) {
      const station = cities.value.find(c => c.stationCode === toCode)
      if (station) {
        toStation.value = station
        to.value = station.value
      }
    }
    
    if (dateStr) {
      try {
        // 将日期字符串解析为 YYYY-MM-DD 格式
        const parsedDate = new Date(dateStr)
        if (!isNaN(parsedDate.getTime())) {
          date.value = parsedDate.toISOString().split('T')[0]
        } else {
          date.value = new Date().toISOString().split('T')[0]
        }
      } catch {
        date.value = new Date().toISOString().split('T')[0]
      }
    } else {
      date.value = new Date().toISOString().split('T')[0]
    }

    // 如果有完整的查询参数，自动搜索
    if (fromStation.value && toStation.value && date.value) {
      searchTrains()
    }
  } catch (error) {
    console.error('Failed to initialize:', error)
    ElMessage.error('Failed to load data')
  } finally {
    loading.value = false
  }
}

onMounted(initialize)

const formatDateTime = (dateStr) => {
  const date = new Date(dateStr)
  return {
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

const searchTrains = async () => {
  if (!fromStation.value || !toStation.value || !date.value) {
    ElMessage.warning('Please fill in all search fields')
    return
  }

  // 更新URL参数
  router.push({
    path: '/search',
    query: {
      from: fromStation.value.stationCode,
      to: toStation.value.stationCode,
      date: date.value
    }
  })

  loading.value = true
  try {
    const response = await getTicketList({
      fromStationCode: fromStation.value.stationCode,
      toStationCode: toStation.value.stationCode,
      fromDate: date.value,
      isStudent: false
    })

    console.log(response.data.tickets)

    // 转换API响应以匹配UI格式
    trains.value = response.data.tickets.map(train => {
      // 处理座位信息
      const seats = []
      if (train.swzPrice) {
        seats.push({
          type: 'Business Class',
          price: train.swzPrice,
          status: train.swzNum === '有' ? 'Available' : 
                 train.swzNum === '0' ? 'Sold out' : 
                 `${train.swzNum} left`,
          amenities: ['wifi', 'power', 'meal']
        })
      }
      if (train.ydzPrice) {
        seats.push({
          type: 'First Class',
          price: train.ydzPrice,
          status: train.ydzNum === '有' ? 'Available' : 
                 train.ydzNum === '0' ? 'Sold out' : 
                 `${train.ydzNum} left`,
          amenities: ['wifi', 'power']
        })
      }
      if (train.edzPrice) {
        seats.push({
          type: 'Second Class',
          price: train.edzPrice,
          status: train.edzNum === '有' ? 'Available' : 
                 train.edzNum === '0' ? 'Sold out' : 
                 `${train.edzNum} left`,
          amenities: ['wifi', 'power']
        })
      }

      // 查找出发和到达站的拼音名称
      const fromStationObj = cities.value.find(c => c.stationCode === train.fromStation)
      const toStationObj = cities.value.find(c => c.stationCode === train.toStation)

      console.log(fromStationObj, toStationObj)

      return {
        id: train.trainNo,
        number: train.trainCode,
        type: train.trainType === 'G' ? 'High-speed G' : 
              train.trainType === 'D' ? 'High-speed D' : 'Normal K',
        departTime: train.fromTime,
        departStation: fromStationObj ? fromStationObj.pingYin : train.fromStation,
        duration: train.runTime,
        arrivalTime: train.toTime,
        arrivalStation: toStationObj ? toStationObj.pingYin : train.toStation,
        expanded: false,
        canBook: train.canBook,
        seats: seats
      }
    })

    // 应用筛选条件
    if (trainType.value) {
      trains.value = trains.value.filter(train => train.number.startsWith(trainType.value))
    }

    if (departTime.value) {
      trains.value = trains.value.filter(train => {
        const hour = parseInt(train.departTime.split(':')[0])
        switch (departTime.value) {
          case 'morning':
            return hour >= 6 && hour < 12
          case 'afternoon':
            return hour >= 12 && hour < 18
          case 'evening':
            return hour >= 18 || hour < 6
          default:
            return true
        }
      })
    }

    if (departStation.value) {
      trains.value = trains.value.filter(train => 
        train.departStation.toLowerCase().includes(departStation.value.toLowerCase())
      )
    }

  } catch (error) {
    console.error('Error fetching trains:', error)
    ElMessage.error('Failed to fetch train schedules. Please try again.')
  } finally {
    loading.value = false
  }
}

// 添加对筛选条件的监听
watch([trainType, departTime, departStation], () => {
  if (trains.value.length > 0) {
    searchTrains()
  }
})

const handleSelect = (item) => {
  const activeElement = document.activeElement
  if (activeElement.id === 'from-search') {
    fromStation.value = item
    from.value = item.pingYin
  } else if (activeElement.id === 'to-search') {
    toStation.value = item
    to.value = item.pingYin
  }
}

const swapLocations = () => {
  const tempValue = from.value
  from.value = to.value
  to.value = tempValue

  const tempStation = { ...fromStation.value }
  fromStation.value = { ...toStation.value }
  toStation.value = tempStation
}

const expandDetails = (train) => {
  train.expanded = !train.expanded
}

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
  return before + `<span class="highlight">${match}</span>` + after
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

// Watch for route query changes
watch(
  () => route.query,
  (newQuery) => {
    const shouldSearch = Object.keys(newQuery).length > 0
    
    if (newQuery.from) {
      const station = cities.value.find(c => c.stationCode === newQuery.from)
      if (station) {
        fromStation.value = station
        from.value = station.value
      }
    }
    
    if (newQuery.to) {
      const station = cities.value.find(c => c.stationCode === newQuery.to)
      if (station) {
        toStation.value = station
        to.value = station.value
      }
    }
    
    if (newQuery.date) {
      try {
        // 将日期字符串解析为 YYYY-MM-DD 格式
        const parsedDate = new Date(newQuery.date)
        if (!isNaN(parsedDate.getTime())) {
          date.value = parsedDate.toISOString().split('T')[0]
        } else {
          date.value = new Date().toISOString().split('T')[0]
        }
      } catch {
        date.value = new Date().toISOString().split('T')[0]
      }
    }
    
    if (shouldSearch && fromStation.value && toStation.value && date.value) {
      searchTrains()
    }
  },
  { immediate: true }
)

const dateShortcuts = [
  {
    text: 'Today',
    value: new Date()
  },
  {
    text: 'Tomorrow',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24)
      return date
    }
  },
  {
    text: 'A week later',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
      return date
    }
  }
]

const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7 || time.getTime() > Date.now() + 8.64e7 * 30 // 禁用今天之前和30天后的日期
}

// 转换价格从人民币到美元
const convertToUSD = (cnyPrice) => {
  if (!exchangeRate.value || !cnyPrice) return 0
  const usdPrice = parseFloat(cnyPrice) * exchangeRate.value
  return Math.ceil(usdPrice) // 向上取整到两位小数
}

// 跳转到创建订单页面
const goToCreateOrder = (train, seat) => {
  router.push({
    name: 'CreateOrder',
    query: {
      trainId: train.id,
      trainNo: train.number,
      from: train.departStation,
      to: train.arrivalStation,
      date: date.value,
      seatType: seat.type,
      price: seat.price,
      departTime: train.departTime,
      arriveTime: train.arrivalTime,
      duration: train.duration
    }
  })
}
</script>

<style scoped>
.search-results {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
  width: 60%;
  margin: 0 auto;
}

.search-header {
  background: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.search-params {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 16px;
  max-width: 1200px;
  margin-left: 0;
  width: 100%;
}

.param {
  flex: 1;
  position: relative;
  min-width: 20px;
  max-width: calc(33.33% - 8px); 
  width: calc(33.33% - 8px);
  
  :deep(.el-autocomplete) {
    display: block;
    width: 100%;
  }

  :deep(.el-input) {
    width: 100%;
  }

  :deep(.el-input__wrapper) {
    width: 100%;
    box-sizing: border-box;
  }

  :deep(.el-autocomplete-suggestion) {
    width: 100% !important;
    min-width: unset !important;
    box-sizing: border-box;
  }

  :deep(.el-popper) {
    width: 100% !important;
    min-width: unset !important;
  }
}

.exchange-button {
  display: flex;
  align-items: flex-end;
  padding-bottom: 8px;
  flex: 0 0 auto;
  margin: 0 -6px; 
}

.search-btn {
  height: 40px;
  padding: 0 20px;
  font-weight: normal;
  border-radius: 4px;
  flex: 0 0 auto;
  margin-left: auto; 
}

:deep(.city-autocomplete) {
  width: 100% !important;
  min-width: unset !important;
  
  .el-autocomplete-suggestion__wrap {
    padding: 0;
    max-height: 300px;
  }
  
  .el-scrollbar__view {
    padding: 0;
  }

  .suggestion-list {
    max-height: 200px;
    overflow-y: auto;
  }
}

.full-width {
  width: 100%;
}

.suggestion-group {
  padding: 8px 0;
}

.suggestion-group-label {
  padding: 0 12px;
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.suggestion-list {
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-item:hover {
  background-color: #f5f7fa;
}

:deep(.highlight) {
  font-weight: bold !important;
  text-decoration: underline !important;
}

.filters {
  display: flex;
  padding-top: 16px;
  border-top: 1px solid #EBEEF5;
  gap: 12px;
  max-width: 1200px;
  width: 100%;
  margin-left: 0;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: calc(33.33% - 8px);
  width: calc(33.33% - 8px);
}

.filter-group label {
  white-space: nowrap;
  font-size: 14px;
  color: #606266;
}

.filter-select {
  flex: 1;
  width: 100%;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-select .el-input__wrapper) {
  width: 100%;
  box-sizing: border-box;
}

:deep(.el-select .el-input__inner) {
  height: 30px;
  line-height: 30px;
  font-size: 13px;
}

:deep(.el-select__popper) {
  border-radius: 4px;
}

:deep(.el-select-dropdown__item) {
  font-size: 13px;
  padding: 0 12px;
  height: 32px;
  line-height: 32px;
}

.results-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.list-header {
  display: flex;
  padding: 12px 24px;
  border-bottom: 1px solid #EBEEF5;
  color: #909399;
  font-size: 14px;
}

.train-item {
  display: flex;
  padding: 16px 24px;
  border-bottom: 1px solid #EBEEF5;
  transition: background-color 0.3s;
}

.train-item:hover {
  background-color: #F5F7FA;
}

.col {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.col.train {
  flex: 0.8;
}

.col.action {
  flex: 0.5;
  align-items: flex-end;
}

.train-number {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.train-type {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.time {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.station {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.duration {
  text-align: center;
}

.duration-time {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.duration-line {
  height: 2px;
  background: #DCDFE6;
  position: relative;
  margin: 0 16px;
}

.duration-line::before,
.duration-line::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #DCDFE6;
  top: -2px;
}

.duration-line::before {
  left: -3px;
}

.duration-line::after {
  right: -3px;
}

.train-details {
  margin: 0;
  padding: 16px 24px;
  background: #f8f9fa;
  border-bottom: 1px solid #EBEEF5;
}

.seat-detail {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-radius: 6px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.seat-detail:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.seat-info {
  flex: 1;
}

.seat-type {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}

.amenities {
  display: flex;
  gap: 8px;
}

.amenity-icon {
  width: 20px;
  height: 20px;
  opacity: 0.7;
}

.seat-status {
  flex: 1;
  text-align: center;
  color: #909399;
  font-size: 14px;
  text-transform: uppercase;
}

.seat-price {
  flex: 0.5;
  text-align: right;
  background: #ff4081;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
}

.currency {
  font-size: 12px;
  margin-right: 2px;
}

.amount {
  font-size: 16px;
}

@media (max-width: 768px) {
  .search-results {
    width: 95%;
    padding: 16px;
  }
  
  .search-params,
  .filters {
    flex-direction: column;
  }
  
  .swap-icon {
    right: 8px;
    bottom: 12px;
  }
  
  .train-item {
    flex-wrap: wrap;
  }
  
  .col {
    flex: 50% !important;
    margin-bottom: 16px;
  }
  
  .col.action {
    flex: 100% !important;
    align-items: stretch;
  }
  
  .seat-detail {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .seat-status,
  .seat-price {
    width: 100%;
    text-align: center;
  }

  .amenities {
    justify-content: center;
  }
}
</style>
