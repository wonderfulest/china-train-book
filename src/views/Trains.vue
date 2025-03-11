<template>
  <div class="trains-page">
    <!-- Hero Section -->
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

    <!-- Why Travel by Train Section -->
    <div class="why-train-section">
      <h2>Why Travel by Train in China?</h2>
      <div class="benefits">
        <div class="benefit-item">
          <img src="../assets/icons/speed.svg" alt="Fast">
          <h3>Fast</h3>
          <p>Up to 350 km/h</p>
        </div>
        <div class="benefit-item">
          <img src="../assets/icons/comfort.svg" alt="Comfortable">
          <h3>Comfortable</h3>
          <p>Spacious seating</p>
        </div>
        <div class="benefit-item">
          <img src="../assets/icons/convenience.svg" alt="Convenient">
          <h3>Convenient</h3>
          <p>City center to city center</p>
        </div>
      </div>
    </div>

    <!-- FAQ Accordion -->
    <div class="faq-section">
      <h2>Frequently Asked Questions</h2>
      <el-collapse v-model="activeCollapse">
        <el-collapse-item v-for="(faq, index) in faqs" :key="index" :title="faq.question" :name="index">
          <div v-html="faq.answer"></div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- Popular Routes -->
    <div class="popular-routes">
      <h2>Popular Train Routes</h2>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="High Speed" name="highspeed">
          <div class="route-grid">
            <div v-for="route in highSpeedRoutes" :key="route.id" class="route-item">
              <router-link :to="route.link">{{ route.name }}</router-link>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Normal Speed" name="normal">
          <div class="route-grid">
            <div v-for="route in normalRoutes" :key="route.id" class="route-item">
              <router-link :to="route.link">{{ route.name }}</router-link>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="International" name="international">
          <div class="route-grid">
            <div v-for="route in internationalRoutes" :key="route.id" class="route-item">
              <router-link :to="route.link">{{ route.name }}</router-link>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Trains',
  data() {
    return {
      searchForm: {
        from: '',
        to: '',
        date: ''
      },
      activeCollapse: ['0'],
      activeTab: 'highspeed',
      faqs: [
        {
          question: 'How to buy train tickets in China?',
          answer: `
            <p>You can buy train tickets through our platform following these steps:</p>
            <ol>
              <li>Search for your desired route and date</li>
              <li>Select your preferred train and class</li>
              <li>Fill in passenger information</li>
              <li>Make payment</li>
              <li>Receive e-ticket confirmation</li>
            </ol>
          `
        },
        {
          question: 'What documents do I need?',
          answer: `
            <p>Required documents for booking and boarding:</p>
            <ul>
              <li>Valid passport</li>
              <li>Visa (if applicable)</li>
              <li>Booking confirmation</li>
            </ul>
          `
        },
        {
          question: 'What are the different train types?',
          answer: `
            <p>China offers several types of trains:</p>
            <ul>
              <li>G - High-speed (300-350 km/h)</li>
              <li>D - Fast (250 km/h)</li>
              <li>Z - Direct Express</li>
              <li>T - Express</li>
              <li>K - Fast</li>
            </ul>
          `
        }
      ],
      highSpeedRoutes: [
        { id: 1, name: 'Beijing → Shanghai', link: '/route/beijing-shanghai' },
        { id: 2, name: 'Beijing → Guangzhou', link: '/route/beijing-guangzhou' },
        { id: 3, name: 'Shanghai → Hangzhou', link: '/route/shanghai-hangzhou' }
      ],
      normalRoutes: [
        { id: 1, name: 'Beijing → Xian', link: '/route/beijing-xian' },
        { id: 2, name: 'Shanghai → Kunming', link: '/route/shanghai-kunming' },
        { id: 3, name: 'Guangzhou → Guilin', link: '/route/guangzhou-guilin' }
      ],
      internationalRoutes: [
        { id: 1, name: 'Beijing → Hong Kong', link: '/route/beijing-hongkong' },
        { id: 2, name: 'Guangzhou → Vientiane', link: '/route/guangzhou-vientiane' },
        { id: 3, name: 'Shanghai → Moscow', link: '/route/shanghai-moscow' }
      ]
    }
  },
  methods: {
    searchTrains() {
      // TODO: Implement train search
      console.log('Searching trains with:', this.searchForm)
      this.$router.push({
        path: '/trains/timetable',
        query: {
          from: this.searchForm.from,
          to: this.searchForm.to,
          date: this.searchForm.date
        }
      })
    }
  }
}
</script>

<style scoped>
.trains-page {
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

.why-train-section {
  padding: 60px 20px;
  text-align: center;
  background: #f8f9fa;
}

.benefits {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1200px;
  margin: 40px auto 0;
}

.benefit-item {
  padding: 20px;
}

.benefit-item img {
  width: 64px;
  height: 64px;
  margin-bottom: 20px;
}

.benefit-item h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}

.benefit-item p {
  color: #666;
}

.faq-section {
  max-width: 800px;
  margin: 60px auto;
  padding: 0 20px;
}

.faq-section h2 {
  text-align: center;
  margin-bottom: 30px;
}

.popular-routes {
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 20px;
}

.popular-routes h2 {
  text-align: center;
  margin-bottom: 30px;
}

.route-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.route-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  text-align: center;
}

.route-item a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
}

.route-item a:hover {
  color: #ff3366;
}

@media (max-width: 768px) {
  .benefits {
    grid-template-columns: 1fr;
  }

  .route-grid {
    grid-template-columns: 1fr;
  }

  .hero-section {
    height: 300px;
  }

  .search-container {
    padding: 20px;
  }
}
</style>
