import axios from 'axios'

import useAuthStore from '../store/authStore'

const apiBaseUrl =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3000'

const API_URL = apiBaseUrl.endsWith('/api')
  ? apiBaseUrl
  : `${apiBaseUrl.replace(/\/$/, '')}/api`

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        'token'
      )

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`
    }

    return config
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401
    ) {
      useAuthStore
        .getState()
        .logout()
    }

    return Promise.reject(error)
  }
)

export default api
