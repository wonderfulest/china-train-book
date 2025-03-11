<template>
  <div class="home">
    <section class="hero-section" :style="{ backgroundImage: 'url(/src/assets/pic-banner01.webp)' }">
      <div class="search-container">
        <SearchCard />
      </div>
    </section>
    <FeatureSection />
    <PopularRoutes />
  </div>
</template>

<script setup>
import SearchCard from '@/components/Home/SearchCard.vue'
import FeatureSection from '@/components/Home/FeatureSection.vue'
import PopularRoutes from '@/components/Home/PopularRoutes.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCityStore } from '@/stores/city'

const router = useRouter()
const cityStore = useCityStore()

const from = ref('')
const to = ref('')
const date = ref(new Date().toISOString().split('T')[0])
const fromStation = ref(null)
const toStation = ref(null)

onMounted(async () => {
  await cityStore.initializeCityData()
})

const querySearch = async (queryString, cb) => {
  const results = cityStore.searchCities(queryString)
  cb(results)
}

const handleSearch = () => {
  router.push({
    path: '/trains/timetable',
    query: {
      from: fromStation.value?.stationCode,
      to: toStation.value?.stationCode,
      date: date.value
    }
  })
}
</script>

<style scoped>
.hero-section {
  min-height: 100vh;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}

.search-container {
  width: 100%;
  max-width: 800px;
  position: relative;
  z-index: 1;
  padding: 0 24px;
}

@media (max-width: 768px) {
  .hero-section {
    min-height: auto;
    padding: 40px 0;
  }
}
</style>
