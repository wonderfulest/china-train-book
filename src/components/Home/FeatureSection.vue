<template>
  <section class="features-section">
    <div class="section-container">
      <h2 class="section-title">Why Choose Us</h2>
      <p class="section-subtitle">Experience hassle-free train travel in China with our comprehensive booking service</p>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-content">
            <div class="feature-icon">
              <el-icon><Timer /></el-icon>
            </div>
            <div class="feature-text">
              <h3 class="feature-title">Real-time Availability</h3>
              <p class="feature-description">
                Get instant access to train schedules and seat availability across China
              </p>
            </div>
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-content">
            <div class="feature-icon">
              <el-icon><CreditCard /></el-icon>
            </div>
            <div class="feature-text">
              <h3 class="feature-title">Secure Payment</h3>
              <p class="feature-description">
                Multiple payment options with secure transaction processing
              </p>
            </div>
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-content">
            <div class="feature-icon">
              <el-icon><Service /></el-icon>
            </div>
            <div class="feature-text">
              <h3 class="feature-title">24/7 Support</h3>
              <p class="feature-description">
                Round-the-clock customer service in multiple languages
              </p>
            </div>
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-content">
            <div class="feature-icon">
              <el-icon><Discount /></el-icon>
            </div>
            <div class="feature-text">
              <h3 class="feature-title">Best Price Guarantee</h3>
              <p class="feature-description">
                Competitive pricing with no hidden fees or charges
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Timer, CreditCard, Service, Discount } from '@element-plus/icons-vue'
</script>

<style scoped>
.features-section {
  background: var(--card-background);
  position: relative;
  padding: var(--spacing-16) 0;
}

.features-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-color), transparent);
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-6);
}

.section-title {
  text-align: center;
  color: var(--text-color);
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--spacing-4);
  line-height: 1.2;
}

.section-subtitle {
  text-align: center;
  color: var(--text-color-secondary);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-12);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-6);
}

.feature-card {
  background: var(--background-color);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  transition: var(--transition-transform);
  border: 1px solid var(--border-color);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.feature-content {
  display: flex;
  align-items: center;
  padding: var(--spacing-8);
  gap: var(--spacing-6);
}

.feature-icon {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  background: var(--primary-color-light);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-transform);
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
  background: var(--primary-color);
}

.feature-icon :deep(svg) {
  font-size: 32px;
  color: var(--primary-color);
  transition: var(--transition-colors);
}

.feature-card:hover .feature-icon :deep(svg) {
  color: white;
}

.feature-text {
  flex: 1;
}

.feature-title {
  color: var(--text-color);
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-2);
}

.feature-description {
  color: var(--text-color-secondary);
  line-height: 1.6;
  font-size: var(--font-size-base);
  margin: 0;
}

@media (max-width: 768px) {
  .features-section {
    padding: var(--spacing-12) 0;
  }

  .section-container {
    padding: 0 var(--spacing-4);
  }

  .section-title {
    font-size: var(--font-size-3xl);
  }

  .section-subtitle {
    font-size: var(--font-size-base);
    margin-bottom: var(--spacing-8);
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }

  .feature-content {
    padding: var(--spacing-6);
    gap: var(--spacing-4);
  }

  .feature-icon {
    width: 48px;
    height: 48px;
  }

  .feature-icon :deep(svg) {
    font-size: 24px;
  }

  .feature-title {
    font-size: var(--font-size-lg);
  }

  .feature-description {
    font-size: var(--font-size-sm);
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .section-container {
    padding: 0 var(--spacing-8);
  }

  .features-grid {
    gap: var(--spacing-4);
  }

  .feature-content {
    padding: var(--spacing-6);
  }
}
</style>
