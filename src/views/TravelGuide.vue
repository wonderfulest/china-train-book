<template>
  <div class="travel-guide">
    <div class="page-header">
      <h1>Travel Guide</h1>
      <p class="subtitle">Essential guides and tips for train travel in China</p>
    </div>

    <div class="content-container">
      <div class="main-content">
        <div class="article-grid">
          <div v-for="article in articles" :key="article.id" class="article-card">
            <router-link :to="article.link" class="article-link">
              <div class="article-image">
                <img :src="article.image" :alt="article.title">
              </div>
              <div class="article-content">
                <h2>{{ article.title }}</h2>
                <div class="article-meta">
                  <span class="category">{{ article.category }}</span>
                  <span class="separator">•</span>
                  <span class="date">{{ article.date }}</span>
                </div>
                <p class="article-excerpt">{{ article.excerpt }}</p>
              </div>
            </router-link>
          </div>
        </div>

        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="100"
            :current-page="currentPage"
            @current-change="handlePageChange"
          />
        </div>
      </div>

      <div class="sidebar">
        <div class="search-box">
          <h3>Search</h3>
          <div class="search-input">
            <el-input v-model="searchQuery" placeholder="Search...">
              <template #append>
                <el-button @click="handleSearch">Search</el-button>
              </template>
            </el-input>
          </div>
        </div>

        <div class="recent-posts">
          <h3>Recent Posts</h3>
          <ul>
            <li v-for="post in recentPosts" :key="post.id">
              <router-link :to="post.link">{{ post.title }}</router-link>
            </li>
          </ul>
        </div>

        <div class="categories">
          <h3>Categories</h3>
          <ul>
            <li v-for="category in categories" :key="category.id">
              <router-link :to="category.link">
                {{ category.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <div class="archives">
          <h3>Archives</h3>
          <ul>
            <li v-for="archive in archives" :key="archive.id">
              <router-link :to="archive.link">
                {{ archive.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TravelGuide',
  data() {
    return {
      currentPage: 1,
      searchQuery: '',
      articles: [
        {
          id: 1,
          title: 'How to travel by train from China to Laos?',
          image: '/images/china-laos-train.jpg',
          category: 'Travel Guide',
          date: 'January 15, 2025',
          excerpt: 'The first international connection railway from China to Laos. This article will tell you what you need to know about booking procedures.',
          link: '/guide/china-to-laos'
        },
        {
          id: 2,
          title: 'Hong Kong West Kowloon Station',
          image: '/images/hk-kowloon.jpg',
          category: 'Station Guide',
          date: 'January 12, 2025',
          excerpt: 'Your complete guide to Hong Kong West Kowloon Station',
          link: '/guide/hk-kowloon-station'
        },
        {
          id: 3,
          title: 'Beijing to Shanghai High-speed Train',
          image: '/images/beijing-shanghai.jpg',
          category: 'Route Guide',
          date: 'January 10, 2025',
          excerpt: 'Everything you need to know about taking the high-speed train from Beijing to Shanghai',
          link: '/guide/beijing-shanghai'
        }
      ],
      recentPosts: [
        { id: 1, title: 'How to claim ticket refund', link: '/guide/ticket-refund' },
        { id: 2, title: 'China Railway Regulations', link: '/guide/regulations' },
        { id: 3, title: 'Best time to book tickets', link: '/guide/booking-tips' }
      ],
      categories: [
        { id: 1, name: 'Travel Guide', link: '/category/travel-guide' },
        { id: 2, name: 'Station Guide', link: '/category/station-guide' },
        { id: 3, name: 'Route Guide', link: '/category/route-guide' }
      ],
      archives: [
        { id: 1, name: 'March 2025', link: '/archive/2025/03' },
        { id: 2, name: 'February 2025', link: '/archive/2025/02' },
        { id: 3, name: 'January 2025', link: '/archive/2025/01' }
      ]
    }
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page
      // TODO: Implement pagination logic
    },
    handleSearch() {
      // TODO: Implement search functionality
      console.log('Searching for:', this.searchQuery)
    }
  }
}
</script>

<style scoped>
.travel-guide {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 36px;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 18px;
}

.content-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 40px;
}

.article-grid {
  display: grid;
  gap: 30px;
}

.article-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.article-card:hover {
  transform: translateY(-5px);
}

.article-link {
  text-decoration: none;
  color: inherit;
}

.article-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.article-content {
  padding: 20px;
}

.article-content h2 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}

.article-meta {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.article-meta .separator {
  margin: 0 8px;
}

.article-excerpt {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.sidebar > div {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.sidebar h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar ul li {
  margin-bottom: 10px;
}

.sidebar ul li a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.sidebar ul li a:hover {
  color: #ff3366;
}

.pagination {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

@media (max-width: 1024px) {
  .content-container {
    grid-template-columns: 1fr;
  }

  .sidebar {
    order: -1;
  }
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 28px;
  }

  .article-image img {
    height: 160px;
  }
}
</style>
