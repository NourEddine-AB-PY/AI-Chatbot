// ✅ SECURE: API utility for authenticated requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : 'http://localhost:5000/api'

// Helper function for authenticated API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions = {
    credentials: 'include', // Always include cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  }
  
  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  }
  
  try {
    const response = await fetch(url, config)
    
    // Handle 401/403 errors (unauthorized/forbidden)
    if (response.status === 401 || response.status === 403) {
      // Clear any stored user data
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      
      // Redirect to login
      window.location.href = '/login'
      return null
    }
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed')
    }
    
    return data
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

// Specific API functions
export const authAPI = {
  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  signup: (userData) => apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  logout: () => apiCall('/auth/logout', {
    method: 'POST'
  }),
  
  me: () => apiCall('/auth/me')
}

export const userAPI = {
  getSettings: () => apiCall('/user-settings'),
  updateSettings: (settings) => apiCall('/user-settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  })
}

export const conversationsAPI = {
  getList: () => apiCall('/conversations/list'),
  getStats: () => apiCall('/conversations/stats'),
  getOverTime: () => apiCall('/conversations/over-time'),
  getByBot: () => apiCall('/conversations/by-bot'),
  getAnalytics: () => apiCall('/conversations/analytics'),
  getResponseTime: () => apiCall('/conversations/response-time'),
  getActiveIntegrations: () => apiCall('/conversations/active-integrations'),
  sendMessage: (data) => apiCall('/conversations/', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getConversation: (businessId, phoneNumber) => apiCall(`/conversations/${businessId}/${phoneNumber}`),
  debug: () => apiCall('/conversations/debug')
}

export const botsAPI = {
  getList: () => apiCall('/bots'),
  create: (botData) => apiCall('/bots', {
    method: 'POST',
    body: JSON.stringify(botData)
  }),
  update: (id, botData) => apiCall(`/bots/${id}`, {
    method: 'PUT',
    body: JSON.stringify(botData)
  }),
  delete: (id) => apiCall(`/bots/${id}`, {
    method: 'DELETE'
  }),
  toggle: (id) => apiCall(`/bots/${id}/toggle`, {
    method: 'PATCH'
  }),
  updateSettings: (id, settings) => apiCall(`/bots/${id}/settings`, {
    method: 'PATCH',
    body: JSON.stringify(settings)
  })
} 