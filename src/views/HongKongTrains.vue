<template>
  <div class="hongkong-trains">
    <div class="hero-section">
      <h1>Hong Kong High-Speed Rail</h1>
      <p>Direct trains from Hong Kong to mainland China</p>
    </div>

    <div class="content-container">
      <div class="search-section">
        <h2>Search Hong Kong Trains</h2>
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

      <div class="info-section">
        <div class="station-info">
          <h2>West Kowloon Station</h2>
          <img src="../assets/images/west-kowloon-station.jpg" alt="West Kowloon Station">
          <div class="info-content">
            <h3>Station Information</h3>
            <ul>
              <li>Address: Austin Road West, Jordan, Hong Kong</li>
              <li>MTR Access: Austin Station (West Rail Line)</li>
              <li>Operating Hours: 6:30 AM - 11:30 PM</li>
            </ul>
          </div>
        </div>

        <div class="routes-info">
          <h2>Popular Routes</h2>
          <div class="route-list">
            <div v-for="route in popularRoutes" :key="route.id" class="route-item">
              <h3>{{ route.name }}</h3>
              <div class="route-details">
                <p>Duration: {{ route.duration }}</p>
                <p>From HKD {{ route.price }}</p>
                <p>{{ route.frequency }}</p>
              </div>
              <el-button type="primary" @click="searchRoute(route)">Check Schedule</el-button>
            </div>
          </div>
        </div>

        <div class="travel-info">
          <h2>Important Information</h2>
          <el-collapse v-model="activeCollapse">
            <el-collapse-item v-for="(info, index) in travelInfo" :key="index" :title="info.title" :name="index">
              <div v-html="info.content"></div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HongKongTrains',
  data() {
    return {
      searchForm: {
        from: '',
        to: '',
        date: ''
      },
      activeCollapse: ['0'],
      popularRoutes: [
        {
          id: 1,
          name: 'Hong Kong → Guangzhou South',
          duration: '48 minutes',
          price: 215,
          frequency: '34 trains daily',
          from: 'Hong Kong',
          to: 'Guangzhou South'
        },
        {
          id: 2,
          name: 'Hong Kong → Shenzhen North',
          duration: '19 minutes',
          price: 75,
          frequency: '45 trains daily',
          from: 'Hong Kong',
          to: 'Shenzhen North'
        },
        {
          id: 3,
          name: 'Hong Kong → Shanghai',
          duration: '8 hours 17 minutes',
          price: 1008,
          frequency: '6 trains daily',
          from: 'Hong Kong',
          to: 'Shanghai'
        }
      ],
      travelInfo: [
        {
          title: 'Required Documents',
          content: `
            <ul>
              <li>Valid passport</li>
              <li>China visa (if required)</li>
              <li>Train ticket</li>
              <li>Completed arrival/departure cards</li>
            </ul>
          `
        },
        {
          title: 'Immigration Process',
          content: `
            <p>You'll need to go through both Hong Kong and mainland China immigration:</p>
            <ol>
              <li>Hong Kong exit immigration</li>
              <li>Mainland China entry immigration</li>
              <li>Both checkpoints are within West Kowloon Station</li>
            </ol>
          `
        },
        {
          title: 'Baggage Information',
          content: `
            <ul>
              <li>Maximum 20kg per person</li>
              <li>Maximum dimensions: 130cm x 70cm x 50cm</li>
              <li>Baggage screening required</li>
            </ul>
          `
        }
      ]
    }
  },
  methods: {
    searchTrains() {
      this.$router.push({
        path: '/search',
        query: {
          from: this.searchForm.from,
          to: this.searchForm.to,
          date: this.searchForm.date
        }
      })
    },
    searchRoute(route) {
      this.$router.push({
        path: '/search',
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
.hongkong-trains {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('../assets/images/west-kowloon-station.jpg') no-repeat center center;
  background-size: cover;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

.hero-section h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.search-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.search-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.info-section {
  display: grid;
  gap: 40px;
}

.station-info img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin: 20px 0;
}

.info-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.info-content ul {
  list-style: none;
  padding: 0;
}

.info-content li {
  margin-bottom: 10px;
  color: #666;
}

.route-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
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
  margin-bottom: 15px;
  color: #666;
}

.route-details p {
  margin-bottom: 5px;
}

.travel-info {
  margin-top: 20px;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .hero-section {
    height: 300px;
  }

  .hero-section h1 {
    font-size: 32px;
  }

  .route-list {
    grid-template-columns: 1fr;
  }
}
</style>
