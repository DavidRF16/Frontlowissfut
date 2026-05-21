import api from '../api/axios'

export const getMessages =
  async (userId) => {
    const response = await api.get(
      `/messages/${userId}`
    )

    return response.data
  }