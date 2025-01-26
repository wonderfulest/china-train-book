<template>
  <section class="popular-routes">
    <div class="section-container">
      <h2 class="section-title">Popular Routes</h2>
      <p class="section-subtitle">Discover the most popular train routes across China</p>
      <div class="routes-grid">
        <div class="route-card" v-for="route in popularRoutes" :key="route.id">
          <div class="route-image" :style="{ backgroundImage: `url(${route.image})` }">
            <div class="route-overlay">
              <div class="route-info">
                <div class="route-cities">
                  <span>{{ route.from }}</span>
                  <el-icon><Right /></el-icon>
                  <span>{{ route.to }}</span>
                </div>
                <div class="route-details">
                  <span class="route-duration">
                    <el-icon><Timer /></el-icon>
                    {{ route.duration }}
                  </span>
                  <span class="route-price">
                    <el-icon><Tickets /></el-icon>
                    From ¥{{ route.price }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Right, Timer, Tickets } from '@element-plus/icons-vue'

const popularRoutes = [
  {
    id: 1,
    from: 'Beijing',
    to: 'Shanghai',
    duration: '4h 28m',
    price: 553,
    image: '/src/assets/routes/beijing-shanghai.jpg'
  },
  {
    id: 2,
    from: 'Guangzhou',
    to: 'Shenzhen',
    duration: '30m',
    price: 75,
    image: '/src/assets/routes/guangzhou-shenzhen.jpg'
  },
  {
    id: 3,
    from: 'Shanghai',
    to: 'Hangzhou',
    duration: '45m',
    price: 73,
    image: '/src/assets/routes/shanghai-hangzhou.jpg'
  },
  {
    id: 4,
    from: 'Beijing',
    to: 'Xian',
    duration: '5h 35m',
    price: 515,
    image: '/src/assets/routes/beijing-xian.jpg'
  }
]
</script>

<style scoped>
.popular-routes {
  background-color: var(--background-color-alt);
  position: relative;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 24px;
}

.section-title {
  text-align: center;
  color: var(--text-color);
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.section-subtitle {
  text-align: center;
  color: var(--text-color-secondary);
  font-size: 20px;
  margin-bottom: 64px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.routes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.route-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  background: white;
  height: 100%;
}

.route-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.route-image {
  height: 240px;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: transform 0.4s ease;
}

.route-card:hover .route-image {
  transform: scale(1.05);
}

.route-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.7));
  display: flex;
  align-items: flex-end;
  padding: 24px;
}

.route-info {
  color: white;
  width: 100%;
}

.route-cities {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.route-details {
  display: flex;
  gap: 16px;
  font-size: 14px;
}

.route-duration,
.route-price {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 768px) {
  .section-container {
    padding: 60px 16px;
  }

  .section-title {
    font-size: 32px;
  }

  .section-subtitle {
    font-size: 18px;
    margin-bottom: 40px;
  }

  .routes-grid {
    grid-template-columns: 1fr;
  }

  .route-card {
    margin-bottom: 24px;
  }

  .route-image {
    height: 200px;
  }

  .route-cities {
    font-size: 18px;
  }

  .route-details {
    font-size: 13px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .section-container {
    padding: 80px 24px;
  }

  .route-image {
    height: 220px;
  }
}
</style>
