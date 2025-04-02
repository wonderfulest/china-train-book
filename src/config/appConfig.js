// PayPal 配置
export const PAYPAL_CONFIG = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: 'USD'
}

// 社交媒体配置
export const SOCIAL_MEDIA = {
  // whatsapp: {
  //   url: 'https://wa.me/your_whatsapp_number',
  //   icon: 'mdi:whatsapp',
  //   name: 'WhatsApp'
  // },
  instagram: {
    url: 'https://www.instagram.com/chinatrainbook/',
    icon: 'mdi:instagram',
    name: 'Instagram'
  },
  facebook: {
    url: 'https://www.facebook.com/profile.php?id=61574944138155',
    icon: 'mdi:facebook',
    name: 'Facebook'
  }
}
