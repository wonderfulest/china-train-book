<template>
  <div class="search-results">
    <div class="search-header">
      <div class="search-params">
        <div class="param">
          <label>From</label>
          <el-input v-model="from" placeholder="Shanghai" />
          <el-icon class="swap-icon" @click="swapLocations"><Switch /></el-icon>
        </div>
        <div class="param">
          <label>To</label>
          <el-input v-model="to" placeholder="Beijing" />
        </div>
        <div class="param">
          <label>Date</label>
          <el-date-picker v-model="date" type="date" placeholder="Select Date" />
        </div>
        <el-button type="primary" class="search-btn" @click="search">Search</el-button>
      </div>
      <div class="filters">
        <div class="filter-group">
          <label>Train Type:</label>
          <el-select v-model="trainType" placeholder="All Trains">
            <el-option label="All Trains" value="" />
            <el-option label="High Speed G" value="G" />
            <el-option label="High Speed D" value="D" />
            <el-option label="Normal K" value="K" />
          </el-select>
        </div>
        <div class="filter-group">
          <label>Depart Times:</label>
          <el-select v-model="departTime" placeholder="All Times">
            <el-option label="All Times" value="" />
            <el-option label="Morning (6:00-12:00)" value="morning" />
            <el-option label="Afternoon (12:00-18:00)" value="afternoon" />
            <el-option label="Evening (18:00-24:00)" value="evening" />
          </el-select>
        </div>
        <div class="filter-group">
          <label>Depart Stations:</label>
          <el-select v-model="departStation" placeholder="All Stations">
            <el-option label="All Stations" value="" />
            <el-option label="Shanghai Hongqiao" value="hongqiao" />
            <el-option label="Shanghai" value="shanghai" />
          </el-select>
        </div>
      </div>
    </div>

    <div class="results-list">
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
            <div class="seat-price">
              <span class="currency">USD</span>
              <span class="amount">{{ seat.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Switch } from '@element-plus/icons-vue'

const from = ref('Shanghai')
const to = ref('Beijing')
const date = ref(new Date())
const trainType = ref('')
const departTime = ref('')
const departStation = ref('')

const trains = ref([
  {
    id: 1,
    number: 'G104',
    type: 'High-speed G',
    departTime: '06:27',
    departStation: 'Shanghai Hongqiao',
    duration: '6:45',
    arrivalTime: '13:12',
    arrivalStation: 'Beijing South',
    expanded: false,
    seats: [
      {
        type: '1st class seat',
        price: 150,
        status: 'sold out',
        amenities: ['wifi', 'power', 'meal']
      },
      {
        type: '2nd class seat',
        price: 90,
        status: 'sold out',
        amenities: ['wifi', 'power', 'snack']
      },
      {
        type: 'Business seat',
        price: 295,
        status: 'sold out',
        amenities: ['wifi', 'power', 'meal']
      }
    ]
  },
  {
    id: 2,
    number: 'G102',
    type: 'High-speed G',
    departTime: '06:37',
    departStation: 'Shanghai Hongqiao',
    duration: '6:01',
    arrivalTime: '12:38',
    arrivalStation: 'Beijing South',
    expanded: false,
    seats: [
      {
        type: '1st class seat',
        price: 150,
        status: 'sold out',
        amenities: ['wifi', 'power', 'meal']
      },
      {
        type: '2nd class seat',
        price: 90,
        status: 'sold out',
        amenities: ['wifi', 'power', 'snack']
      },
      {
        type: 'Business seat',
        price: 295,
        status: 'sold out',
        amenities: ['wifi', 'power', 'meal']
      }
    ]
  },
  {
    id: 3,
    number: 'G2',
    type: 'High-speed G',
    departTime: '07:00',
    departStation: 'Shanghai',
    duration: '4:36',
    arrivalTime: '11:36',
    arrivalStation: 'Beijing South',
    expanded: false,
    seats: [
      {
        type: '1st class seat',
        price: 150,
        status: 'sold out',
        amenities: ['wifi', 'power', 'meal']
      },
      {
        type: '2nd class seat',
        price: 90,
        status: 'sold out',
        amenities: ['wifi', 'power', 'snack']
      },
      {
        type: 'Business seat',
        price: 295,
        status: 'sold out',
        amenities: ['wifi', 'power', 'meal']
      }
    ]
  }
])

const swapLocations = () => {
  const temp = from.value
  from.value = to.value
  to.value = temp
}

const search = () => {
  // Implement search logic
}

const expandDetails = (train) => {
  train.expanded = !train.expanded
}
</script>

<style scoped>
.search-results {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.search-header {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.search-params {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 24px;
}

.param {
  flex: 1;
  position: relative;
}

.param label {
  display: block;
  margin-bottom: 8px;
  color: #606266;
  font-size: 14px;
}

.swap-icon {
  position: absolute;
  right: -28px;
  bottom: 12px;
  cursor: pointer;
  color: #409EFF;
}

.search-btn {
  height: 40px;
  padding: 0 32px;
}

.filters {
  display: flex;
  gap: 24px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  color: #606266;
  font-size: 14px;
  white-space: nowrap;
}

.results-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.list-header {
  display: flex;
  padding: 16px 24px;
  border-bottom: 1px solid #EBEEF5;
  color: #909399;
  font-size: 14px;
}

.train-item {
  display: flex;
  padding: 24px;
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
  padding: 24px;
  background: #f8f9fa;
  border-bottom: 1px solid #EBEEF5;
}

.seat-detail {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
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
