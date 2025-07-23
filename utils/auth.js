// Authentication utility functions for managing user login state

export const auth = {
  // Check if user is logged in
  isLoggedIn: () => {
    if (typeof window === 'undefined') return false
    const token = localStorage.getItem('authToken')
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    return !!(token && isLoggedIn === 'true')
  },

  // Get authentication token
  getToken: () => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('authToken')
  },

  // Get user data
  getUserData: () => {
    if (typeof window === 'undefined') return null
    try {
      const userData = localStorage.getItem('userData')
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  },

  // Get specific user info
  getUserId: () => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('userId')
  },

  getUsername: () => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('username')
  },

  getUserEmail: () => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('userEmail')
  },

  getUserFullName: () => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('userFullName')
  },

  // Logout function
  logout: async () => {
    if (typeof window === 'undefined') return
    
    console.log('Auth: Starting logout process...')
    
    try {
      // Get the auth token for the request
      const token = auth.getToken()
      const headers = {
        'Content-Type': 'application/json',
      }
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Token ${token}`
      }
      
      // Call Django logout API to invalidate server-side session and token
      const response = await fetch('/api/auth/logout', {
        method: 'GET',
        headers: headers,
        credentials: 'include', // Include cookies for Django logout
      })
      
      console.log('Auth: Django logout response:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Auth: Logout successful:', data)
      } else {
        console.log('Auth: Django logout failed, but continuing with local cleanup')
      }
    } catch (error) {
      console.error('Auth: Error calling logout API:', error)
      console.log('Auth: Continuing with local cleanup despite API error')
    }
    
    // Clear all authentication data from localStorage
    console.log('Auth: Clearing localStorage...')
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userFullName')
    localStorage.removeItem('loginTime')
    localStorage.removeItem('isLoggedIn')
    
    // Trigger events to notify components of logout
    console.log('Auth: Triggering logout events...')
    window.dispatchEvent(new Event('storage'))
    window.dispatchEvent(new Event('authStateChanged'))
    
    // Small delay to ensure events are processed
    setTimeout(() => {
      console.log('Auth: Redirecting to login page...')
      window.location.href = '/login'
    }, 100)
  },

  // Check if token is expired (optional - you can implement token expiry logic)
  isTokenExpired: () => {
    if (typeof window === 'undefined') return true
    
    const loginTime = localStorage.getItem('loginTime')
    if (!loginTime) return true
    
    // Check if login is older than 24 hours (adjust as needed)
    const loginDate = new Date(loginTime)
    const now = new Date()
    const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60)
    
    return hoursDiff > 24
  },

  // Auto logout if token expired
  checkAndAutoLogout: () => {
    if (typeof window === 'undefined') return
    
    if (auth.isLoggedIn() && auth.isTokenExpired()) {
      auth.logout()
    }
  },

  // Get authorization header for API requests
  getAuthHeaders: () => {
    const token = auth.getToken()
    return token ? { 'Authorization': `Token ${token}` } : {}
  },
}

// Auto check for expired token on page load
if (typeof window !== 'undefined') {
  auth.checkAndAutoLogout()
}

export default auth
