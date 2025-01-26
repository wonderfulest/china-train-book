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
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { getAllCity, getHotCity } from '@/api/modules/train'

const router = useRouter()
const from = ref('')
const to = ref('')
const date = ref(new Date().toISOString().split('T')[0])

const cities = ref([])
const hotCities = ref([])
const pageSize = 6
const currentPages = ref({})
const dropdownVisible = ref(false)

const fromStation = ref(null)
const toStation = ref(null)

onMounted(async () => {
  try {
    // 获取所有城市
    const response = await getAllCity()
    cities.value = response.result.stations.map(station => ({
      name: station.name,
      stationCode: station.stationCode,
      pingYin: station.pingYin,
      pingYinShort: station.pingYinShort
    }))
    
    // 获取热门城市
    const hotResponse = await getHotCity()
    hotCities.value = hotResponse.result.stations.map(station => ({
      name: station.name,
      stationCode: station.stationCode,
      pingYin: station.pingYin,
      pingYinShort: station.pingYinShort
    }))

    // Initialize pages
    currentPages.value = { hot: 1 }
  } catch (error) {
    console.error('Failed to fetch stations:', error)
  }
})

const querySearch = (queryString, cb) => {
  if (!queryString) {
    const suggestions = []
    
    // Add hot cities section
    if (hotCities.value.length > 0) {
      suggestions.push({
        label: '热门城市',
        groupKey: 'hot',
        cities: hotCities.value
      })
    }

    // Group other cities by pinyin first letter
    const groupedCities = {}
    cities.value.forEach(city => {
      const firstLetter = city.pingYin[0].toUpperCase()
      if (!groupedCities[firstLetter]) {
        groupedCities[firstLetter] = []
      }
      groupedCities[firstLetter].push(city)
    })

    // Add grouped cities
    Object.keys(groupedCities).sort().forEach(letter => {
      suggestions.push({
        label: letter.toUpperCase(),
        groupKey: letter,
        cities: groupedCities[letter]
      })
    })

    cb(suggestions)
  } else {
    // When searching, filter cities
    const results = cities.value.filter(city => 
      city.name.toLowerCase().includes(queryString.toLowerCase()) ||
      city.pingYin.toLowerCase().includes(queryString.toLowerCase()) ||
      city.pingYinShort.toLowerCase().includes(queryString.toLowerCase())
    )
    
    if (results.length > 0) {
      cb([{
        label: '搜索结果',
        groupKey: 'search',
        cities: results,
        isSearchResult: true
      }])
    } else {
      cb([])
    }
  }
}

const handleSearch = () => {
  router.push({
    path: '/search',
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
