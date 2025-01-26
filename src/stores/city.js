import { defineStore } from 'pinia'
import { getAllCity, getHotCity } from '@/api/modules/train'

export const useCityStore = defineStore('city', {
  state: () => ({
    allCities: [],
    hotCities: [],
    loading: false,
    error: null,
    initialized: false
  }),

  getters: {
    cityOptions: (state) => {
      if (!state.allCities.length) return []

      // Group cities by pinyin first letter
      const groupedCities = {}
      state.allCities.forEach(city => {
        const firstLetter = city.pingYin[0].toUpperCase()
        if (!groupedCities[firstLetter]) {
          groupedCities[firstLetter] = []
        }
        groupedCities[firstLetter].push(city)
      })

      const suggestions = []

      // Add hot cities section if available
      if (state.hotCities.length > 0) {
        suggestions.push({
          label: '热门城市',
          cities: state.hotCities
        })
      }

      // Add grouped cities
      Object.entries(groupedCities)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([letter, cities]) => {
          suggestions.push({
            label: letter,
            cities: cities
          })
        })

      return suggestions
    },

    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null
  },

  actions: {
    async initializeCityData() {
      if (this.initialized) return

      this.loading = true
      this.error = null

      try {
        // Fetch all cities and hot cities in parallel
        const [allCitiesResponse, hotCitiesResponse] = await Promise.all([
          getAllCity(),
          getHotCity()
        ])

        // Transform the data
        this.allCities = allCitiesResponse.result.stations.map(station => ({
          name: station.name,
          stationCode: station.stationCode,
          pingYin: station.pingYin,
          pingYinShort: station.pingYinShort
        }))

        this.hotCities = hotCitiesResponse.result.stations.map(station => ({
          name: station.name,
          stationCode: station.stationCode,
          pingYin: station.pingYin,
          pingYinShort: station.pingYinShort
        }))

        this.initialized = true
      } catch (error) {
        console.error('Failed to fetch city data:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    searchCities(query) {
      if (!query) return this.cityOptions

      const results = this.allCities.filter(city => {
        return city.name.toLowerCase().includes(query.toLowerCase()) ||
               city.pingYin.toLowerCase().includes(query.toLowerCase()) ||
               city.pingYinShort.toLowerCase().includes(query.toLowerCase())
      })

      return [{
        label: 'Search Results',
        cities: results
      }]
    }
  }
})
