<template>
  <div class="china-train-guide">
    <div class="page-header">
      <h1>China Train Guide</h1>
      <p class="subtitle">Everything you need to know about train travel in China</p>
    </div>

    <div class="content-container">
      <div class="article-grid">
        <article v-for="article in articles" :key="article.id" class="guide-article">
          <div class="article-image">
            <img :src="article.image" :alt="article.title">
          </div>
          <div class="article-content">
            <h2>{{ article.title }}</h2>
            <div class="article-meta">
              <span class="date">{{ article.date }}</span>
              <span class="read-time">{{ article.readTime }} min read</span>
            </div>
            <p class="article-excerpt">{{ article.excerpt }}</p>
            <router-link :to="article.link" class="read-more">Read More →</router-link>
          </div>
        </article>
      </div>

      <aside class="sidebar">
        <div class="quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li v-for="link in quickLinks" :key="link.id">
              <router-link :to="link.url">{{ link.title }}</router-link>
            </li>
          </ul>
        </div>

        <div class="train-types">
          <h3>Train Types in China</h3>
          <div v-for="type in trainTypes" :key="type.code" class="train-type">
            <h4>{{ type.code }} - {{ type.name }}</h4>
            <p>{{ type.description }}</p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChinaTrainGuide',
  data() {
    return {
      articles: [
        {
          id: 1,
          title: 'Understanding Chinese Train Numbers',
          image: '../assets/images/train-numbers.jpg',
          date: 'January 20, 2025',
          readTime: 5,
          excerpt: 'Learn how to decode Chinese train numbers and what they mean for your journey.',
          link: '/guide/train-numbers'
        },
        {
          id: 2,
          title: 'Classes and Seat Types on Chinese Trains',
          image: '../assets/images/train-classes.jpg',
          date: 'January 18, 2025',
          readTime: 8,
          excerpt: 'A comprehensive guide to different seat classes and sleeping berths on Chinese trains.',
          link: '/guide/seat-classes'
        },
        {
          id: 3,
          title: 'How to Read Chinese Train Tickets',
          image: '../assets/images/train-ticket.jpg',
          date: 'January 15, 2025',
          readTime: 6,
          excerpt: 'Everything you need to know about reading and understanding your Chinese train ticket.',
          link: '/guide/reading-tickets'
        }
      ],
      quickLinks: [
        {
          id: 1,
          title: 'Train Types Guide',
          url: '/guide/train-types'
        },
        {
          id: 2,
          title: 'Booking Process',
          url: '/guide/booking-process'
        },
        {
          id: 3,
          title: 'Station Guide',
          url: '/guide/stations'
        },
        {
          id: 4,
          title: 'Travel Tips',
          url: '/guide/travel-tips'
        }
      ],
      trainTypes: [
        {
          code: 'G',
          name: 'High-Speed',
          description: 'Fastest trains running at 300-350 km/h'
        },
        {
          code: 'D',
          name: 'Fast Speed',
          description: 'Second fastest category, running at 250 km/h'
        },
        {
          code: 'Z',
          name: 'Direct Express',
          description: 'Non-stop service between major cities'
        },
        {
          code: 'T',
          name: 'Express',
          description: 'Regular express service with limited stops'
        },
        {
          code: 'K',
          name: 'Fast',
          description: 'Regular service with more stops'
        }
      ]
    }
  }
}
</script>

<style scoped>
.china-train-guide {
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('../assets/images/west-kowloon-station.jpg') no-repeat center center;
  background-size: cover;
  color: white;
  text-align: center;
  padding: 60px 20px;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 36px;
  margin-bottom: 16px;
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 40px;
}

.article-grid {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.guide-article {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 300px 1fr;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  padding: 24px;
}

.article-content h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 12px;
}

.article-meta {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
}

.article-meta span:not(:last-child)::after {
  content: '•';
  margin: 0 8px;
}

.article-excerpt {
  color: #666;
  margin-bottom: 16px;
  line-height: 1.6;
}

.read-more {
  color: #ff3366;
  text-decoration: none;
  font-weight: 500;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.sidebar > div {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.sidebar h3 {
  color: #333;
  margin-bottom: 16px;
  font-size: 20px;
}

.quick-links ul {
  list-style: none;
  padding: 0;
}

.quick-links li {
  margin-bottom: 12px;
}

.quick-links a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.quick-links a:hover {
  color: #ff3366;
}

.train-type {
  margin-bottom: 20px;
}

.train-type h4 {
  color: #333;
  margin-bottom: 8px;
}

.train-type p {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .content-container {
    grid-template-columns: 1fr;
  }

  .guide-article {
    grid-template-columns: 1fr;
  }

  .article-image {
    height: 200px;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 20px;
  }

  .page-header h1 {
    font-size: 28px;
  }
}
</style>
