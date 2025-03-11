<template>
  <div class="mainland-trains">
    <!-- Reusing the content from Trains.vue since this is the main trains page -->
    <div class="hero-section">
      <div class="search-container">
        <el-form :model="searchForm" class="search-form">
          <el-row :gutter="20">
            <el-col :span="7">
              <el-form-item>
                <el-input v-model="searchForm.from" placeholder="From" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item>
                <el-input v-model="searchForm.to" placeholder="To" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item>
                <el-date-picker
                  v-model="searchForm.date"
                  type="date"
                  placeholder="Select Date"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" @click="searchTrains">Search</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <div class="content-container">
      <h1>China Mainland Train Routes</h1>
      
      <div class="route-categories">
        <div class="category">
          <h2>High-Speed Trains (G/D)</h2>
          <div class="route-list">
            <div v-for="route in highSpeedRoutes" :key="route.id" class="route-item">
              <h3>{{ route.name }}</h3>
              <div class="route-details">
                <span>Duration: {{ route.duration }}</span>
                <span>From {{ route.price }} CNY</span>
              </div>
              <el-button type="primary" @click="searchRoute(route)">Check Schedule</el-button>
            </div>
          </div>
        </div>

        <div class="category">
          <h2>Regular Trains (K/T/Z)</h2>
          <div class="route-list">
            <div v-for="route in regularRoutes" :key="route.id" class="route-item">
              <h3>{{ route.name }}</h3>
              <div class="route-details">
                <span>Duration: {{ route.duration }}</span>
                <span>From {{ route.price }} CNY</span>
              </div>
              <el-button type="primary" @click="searchRoute(route)">Check Schedule</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChinaMainlandTrains',
  data() {
    return {
      searchForm: {
        from: '',
        to: '',
        date: ''
      },
      highSpeedRoutes: [
        {
          id: 1,
          name: 'Beijing → Shanghai',
          duration: '4h 28m',
          price: 553,
          from: 'Beijing',
          to: 'Shanghai'
        },
        {
          id: 2,
          name: 'Beijing → Guangzhou',
          duration: '8h 20m',
          price: 862,
          from: 'Beijing',
          to: 'Guangzhou'
        },
        {
          id: 3,
          name: 'Shanghai → Hangzhou',
          duration: '45m',
          price: 73,
          from: 'Shanghai',
          to: 'Hangzhou'
        }
      ],
      regularRoutes: [
        {
          id: 4,
          name: 'Beijing → Xi\'an',
          duration: '11h 30m',
          price: 309,
          from: 'Beijing',
          to: 'Xi\'an'
        },
        {
          id: 5,
          name: 'Shanghai → Kunming',
          duration: '19h 45m',
          price: 499,
          from: 'Shanghai',
          to: 'Kunming'
        },
        {
          id: 6,
          name: 'Guangzhou → Guilin',
          duration: '7h 30m',
          price: 199,
          from: 'Guangzhou',
          to: 'Guilin'
        }
      ]
    }
  },
  methods: {
    searchTrains() {
      this.$router.push({
        path: '/trains/timetable',
        query: {
          from: this.searchForm.from,
          to: this.searchForm.to,
          date: this.searchForm.date
        }
      })
    },
    searchRoute(route) {
      this.$router.push({
        path: '/trains/timetable',
        query: {
          from: route.from,
          to: route.to,
          date: this.searchForm.date || new Date().toISOString().split('T')[0]
        }
      })
    }
  }
}
</script>

<style scoped>
.mainland-trains {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('../assets/images/west-kowloon-station.jpg') no-repeat center center;
  background-size: cover;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

.search-container {
  background: rgba(0, 0, 0, 0.7);
  padding: 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 1000px;
  margin: 0 20px;
}

.content-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.content-container h1 {
  text-align: center;
  margin-bottom: 40px;
  color: #333;
}

.route-categories {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.category h2 {
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ff3366;
}

.route-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.route-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.route-item h3 {
  color: #333;
  margin-bottom: 15px;
}

.route-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #666;
}

@media (max-width: 768px) {
  .hero-section {
    height: 300px;
  }

  .search-container {
    padding: 20px;
  }

  .route-list {
    grid-template-columns: 1fr;
  }
}
</style>
