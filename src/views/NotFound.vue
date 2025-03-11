<template>
  <div class="not-found-page">
    <div class="content">
      <h1>Epic 404 - Article Not Found</h1>
      <p class="message">This is embarrassing. We can't find what you were looking for.</p>
      <p class="suggestion">Whatever you were looking for was not found, but maybe try looking again or search using the form below.</p>
      
      <div class="search-form">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search ..." 
          @keyup.enter="handleSearch"
        >
        <button @click="handleSearch">Search</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  data() {
    return {
      searchQuery: ''
    }
  },
  methods: {
    handleSearch() {
      if (this.searchQuery.trim()) {
        // Navigate to search results page with query
        this.$router.push({
          name: 'TimeTable',
          query: { q: this.searchQuery }
        })
      }
    }
  }
}
</script>

<style scoped>
.not-found-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.content {
  max-width: 600px;
  text-align: center;
}

h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
}

.message {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1rem;
}

.suggestion {
  color: #666;
  margin-bottom: 2rem;
}

.search-form {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

input {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
  font-size: 1rem;
}

button {
  padding: 0.5rem 1.5rem;
  background-color: #ff3366;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #e62e5c;
}
</style>
