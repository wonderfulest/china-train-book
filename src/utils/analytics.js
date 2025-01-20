// Google Analytics Configuration
export const initGoogleAnalytics = () => {
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-W4SMC2YTKL'
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', 'G-W4SMC2YTKL')

  // Make gtag available globally
  window.gtag = gtag
}

// Track page views
export const trackPageView = (path) => {
  if (window.gtag) {
    window.gtag('config', 'G-W4SMC2YTKL', {
      page_path: path
    })
  }
}
