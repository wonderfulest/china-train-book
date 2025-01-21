<template>
  <div class="international-trains">
    <div class="hero-section">
      <h1>International Train Routes</h1>
      <p>Connect China with neighboring countries by rail</p>
    </div>

    <div class="content-container">
      <div class="routes-section">
        <h2>Available International Routes</h2>
        
        <div class="route-cards">
          <div v-for="route in internationalRoutes" :key="route.id" class="route-card">
            <div class="route-image">
              <img :src="route.image" :alt="route.name">
            </div>
            <div class="route-content">
              <h3>{{ route.name }}</h3>
              <div class="route-details">
                <p><strong>Duration:</strong> {{ route.duration }}</p>
                <p><strong>Frequency:</strong> {{ route.frequency }}</p>
                <p><strong>From:</strong> {{ route.price }} CNY</p>
              </div>
              <div class="route-description" v-html="route.description"></div>
              <el-button type="primary" @click="searchRoute(route)">Check Availability</el-button>
            </div>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h2>Important Information</h2>
        <el-collapse v-model="activeCollapse">
          <el-collapse-item v-for="(info, index) in travelInfo" :key="index" :title="info.title" :name="index">
            <div v-html="info.content"></div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InternationalTrains',
  data() {
    return {
      activeCollapse: ['0'],
      internationalRoutes: [
        {
          id: 1,
          name: 'China - Laos Railway',
          image: '../assets/images/china-laos.jpg',
          duration: '10 hours',
          frequency: 'Daily',
          price: 980,
          description: `
            <p>The China-Laos Railway connects Kunming with Vientiane, passing through beautiful landscapes and important cities:</p>
            <ul>
              <li>Kunming → Mohan (China)</li>
              <li>Boten → Vientiane (Laos)</li>
            </ul>
          `,
          from: 'Kunming',
          to: 'Vientiane'
        },
        {
          id: 2,
          name: 'Trans-Mongolian Railway',
          image: '../assets/images/trans-mongolian.jpg',
          duration: '30 hours',
          frequency: 'Twice weekly',
          price: 2600,
          description: `
            <p>Connect Beijing with Ulaanbaatar through the historic Trans-Mongolian route:</p>
            <ul>
              <li>Scenic journey through the Gobi Desert</li>
              <li>Modern trains with sleeping compartments</li>
            </ul>
          `,
          from: 'Beijing',
          to: 'Ulaanbaatar'
        },
        {
          id: 3,
          name: 'Vietnam Express',
          image: '../assets/images/vietnam-train.jpg',
          duration: '8 hours',
          frequency: 'Daily',
          price: 720,
          description: `
            <p>Travel from Nanning to Hanoi on this convenient international service:</p>
            <ul>
              <li>Modern air-conditioned carriages</li>
              <li>Border crossing assistance included</li>
            </ul>
          `,
          from: 'Nanning',
          to: 'Hanoi'
        }
      ],
      travelInfo: [
        {
          title: 'Visa Requirements',
          content: `
            <p>Make sure you have the following:</p>
            <ul>
              <li>Valid passport (at least 6 months)</li>
              <li>Necessary visas for all countries</li>
              <li>Return/onward travel tickets</li>
              <li>Completed immigration forms</li>
            </ul>
          `
        },
        {
          title: 'Border Crossing Procedures',
          content: `
            <p>During international train journeys:</p>
            <ul>
              <li>Immigration checks at both borders</li>
              <li>Keep passport and tickets easily accessible</li>
              <li>Follow instructions from border officials</li>
              <li>Some stops may last 1-2 hours</li>
            </ul>
          `
        },
        {
          title: 'Baggage Information',
          content: `
            <ul>
              <li>Weight limit: 20-25kg per person</li>
              <li>Size restrictions vary by route</li>
              <li>Label all luggage clearly</li>
              <li>Keep valuables with you</li>
            </ul>
          `
        }
      ]
    }
  },
  methods: {
    searchRoute(route) {
      this.$router.push({
        path: '/search',
        query: {
          from: route.from,
          to: route.to,
          date: new Date().toISOString().split('T')[0]
        }
      })
    }
  }
}
</script>

<style scoped>
.international-trains {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('../assets/images/international-train.jpg') no-repeat center center;
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

.routes-section {
  margin-bottom: 60px;
}

h2 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.route-cards {
  display: grid;
  gap: 30px;
}

.route-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 300px 1fr;
}

.route-image {
  height: 100%;
}

.route-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.route-content {
  padding: 30px;
}

.route-content h3 {
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
}

.route-details {
  margin-bottom: 20px;
  color: #666;
}

.route-details p {
  margin-bottom: 10px;
}

.route-description {
  margin-bottom: 20px;
  color: #666;
}

.route-description ul {
  padding-left: 20px;
  margin-top: 10px;
}

.route-description li {
  margin-bottom: 5px;
}

.info-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 968px) {
  .route-card {
    grid-template-columns: 1fr;
  }

  .route-image {
    height: 200px;
  }

  .hero-section {
    height: 300px;
  }

  .hero-section h1 {
    font-size: 32px;
  }
}
</style>
