import { create } from 'zustand'

import {
  disconnectSocket,
} from '../services/socket'

const readStoredUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem('user')
    )
  } catch (error) {
    localStorage.removeItem('user')
    return null
  }
}

const useAuthStore = create((set) => ({
  user: readStoredUser(),

  token: localStorage.getItem('token') || null,

  setAuth: ({ user, token }) => {
    localStorage.setItem(
      'user',
      JSON.stringify(user)
    )

    localStorage.setItem('token', token)

    set({
      user,
      token,
    })
  },

  updateUser: (user) => {
    localStorage.setItem(
      'user',
      JSON.stringify(user)
    )

    set({
      user,
    })
  },

  logout: () => {
    disconnectSocket()

    localStorage.removeItem('user')

    localStorage.removeItem('token')

    set({
      user: null,
      token: null,
    })
  },
}))

export default useAuthStore
