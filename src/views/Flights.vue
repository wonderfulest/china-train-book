<template>
  <div class="flights">
    <div class="hero-section">
      <h1>China Flights</h1>
      <p>Domestic and International Flights in China</p>
    </div>

    <div class="content-container">
      <div class="search-section">
        <h2>Search Flights</h2>
        <el-form :model="searchForm" class="search-form">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchForm.from" placeholder="From" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="searchForm.to" placeholder="To" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-date-picker
                  v-model="searchForm.departDate"
                  type="date"
                  placeholder="Depart Date"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-date-picker
                  v-model="searchForm.returnDate"
                  type="date"
                  placeholder="Return Date (Optional)"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item>
                <el-select v-model="searchForm.passengers" placeholder="Passengers">
                  <el-option
                    v-for="n in 9"
                    :key="n"
                    :label="n + ' Passenger' + (n > 1 ? 's' : '')"
                    :value="n"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select v-model="searchForm.class" placeholder="Class">
                  <el-option label="Economy" value="economy" />
                  <el-option label="Business" value="business" />
                  <el-option label="First" value="first" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" @click="searchFlights">Search Flights</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="popular-routes">
        <h2>Popular Flight Routes</h2>
        <div class="route-grid">
          <div v-for="route in popularRoutes" :key="route.id" class="route-card">
            <div class="route-header">
              <h3>{{ route.from }} → {{ route.to }}</h3>
              <span class="price">From CNY {{ route.price }}</span>
            </div>
            <div class="route-details">
              <p>Flight Time: {{ route.duration }}</p>
              <p>{{ route.frequency }} flights daily</p>
            </div>
            <el-button type="primary" @click="searchRoute(route)">Check Flights</el-button>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h2>Flight Information</h2>
        <el-collapse v-model="activeCollapse">
          <el-collapse-item v-for="(info, index) in flightInfo" :key="index" :title="info.title" :name="index">
            <div v-html="info.content"></div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Flights',
  data() {
    return {
      searchForm: {
        from: '',
        to: '',
        departDate: '',
        returnDate: '',
        passengers: 1,
        class: 'economy'
      },
      activeCollapse: ['0'],
      popularRoutes: [
        {
          id: 1,
          from: 'Beijing',
          to: 'Shanghai',
          price: 580,
          duration: '2h 15m',
          frequency: 45
        },
        {
          id: 2,
          from: 'Guangzhou',
          to: 'Beijing',
          price: 890,
          duration: '3h 25m',
          frequency: 32
        },
        {
          id: 3,
          from: 'Shanghai',
          to: 'Shenzhen',
          price: 750,
          duration: '2h 45m',
          frequency: 28
        },
        {
          id: 4,
          from: 'Beijing',
          to: 'Hong Kong',
          price: 1280,
          duration: '3h 45m',
          frequency: 15
        }
      ],
      flightInfo: [
        {
          title: 'Baggage Allowance',
          content: `
            <h4>Domestic Flights</h4>
            <ul>
              <li>Economy: 20kg checked + 5kg carry-on</li>
              <li>Business: 30kg checked + 10kg carry-on</li>
              <li>First: 40kg checked + 10kg carry-on</li>
            </ul>
            <h4>International Flights</h4>
            <ul>
              <li>Economy: 23kg checked + 7kg carry-on</li>
              <li>Business: 32kg checked + 10kg carry-on</li>
              <li>First: 40kg checked + 10kg carry-on</li>
            </ul>
          `
        },
        {
          title: 'Check-in Information',
          content: `
            <ul>
              <li>Domestic flights: Check-in closes 45 minutes before departure</li>
              <li>International flights: Check-in closes 60 minutes before departure</li>
              <li>Online check-in available 24-48 hours before departure</li>
              <li>Airport counter check-in opens 3 hours before departure</li>
            </ul>
          `
        },
        {
          title: 'Required Documents',
          content: `
            <h4>Domestic Flights</h4>
            <ul>
              <li>Valid ID card or passport</li>
              <li>Booking confirmation</li>
            </ul>
            <h4>International Flights</h4>
            <ul>
              <li>Valid passport</li>
              <li>Necessary visas</li>
              <li>Booking confirmation</li>
              <li>Return/onward travel tickets (if required)</li>
            </ul>
          `
        }
      ]
    }
  },
  methods: {
    searchFlights() {
      console.log('Searching flights with:', this.searchForm)
      // TODO: Implement flight search
    },
    searchRoute(route) {
      this.searchForm.from = route.from
      this.searchForm.to = route.to
      this.searchFlights()
    }
  }
}
</script>

<style scoped>
.flights {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('../assets/images/china-flights.jpg') no-repeat center center;
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

.popular-routes {
  margin-bottom: 40px;
}

h2 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.route-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.route-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.route-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.route-header h3 {
  color: #333;
  font-size: 18px;
}

.price {
  color: #ff3366;
  font-weight: 500;
}

.route-details {
  color: #666;
  margin-bottom: 15px;
}

.route-details p {
  margin-bottom: 5px;
}

.info-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .hero-section {
    height: 300px;
  }

  .hero-section h1 {
    font-size: 32px;
  }

  .route-grid {
    grid-template-columns: 1fr;
  }
}
</style>
