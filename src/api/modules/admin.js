import request from '../request'

// Get all cookies with expiration status
export const getCookies = () => {
  return request({
    url: '/cookies',
    method: 'get'
  })
}

// Create new cookie
export const createCookie = (cookieValue, label) => {
  return request({
    url: '/cookies',
    method: 'post',
    data: { cookieValue, label }
  })
}

// Update cookie
export const updateCookie = (id, cookieValue, label) => {
  return request({
    url: `/cookies/update/${id}`,
    method: 'post',
    data: { cookieValue, label }
  })
}

// Delete cookie
export const deleteCookie = (id) => {
  return request({
    url: `/cookies/delete/${id}`,
    method: 'get'
  })
}

// Check single cookie expiration
export const checkCookieExpired = (id) => {
  return request({
    url: `/cookies/${id}/check-expired`,
    method: 'get'
  })
}

// Get least used cookie
export const getLeastUsedCookie = () => {
  return request({
    url: '/cookies/least-used',
    method: 'get'
  })
}
