import api from '../api/axios'

export const getFriends =
  async () => {
    const response =
      await api.get('/friends')

    return response.data
  }

export const sendFriendRequest =
  async (userId) => {
    const response =
      await api.post(
        `/friends/request/${userId}`
      )

    return response.data
  }

export const getFriendRequests =
  async () => {
    const response =
      await api.get(
        '/friends/requests'
      )

    return response.data
  }

export const acceptFriendRequest =
  async (requestId) => {
    const response =
      await api.put(
        `/friends/accept/${requestId}`
      )

    return response.data
  }

export const rejectFriendRequest =
  async (requestId) => {
    const response =
      await api.put(
        `/friends/reject/${requestId}`
      )

    return response.data
  }
