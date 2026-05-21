import api from '../api/axios'

export const getProfile =
  async () => {
    const response =
      await api.get(
        '/users/profile'
      )

    return response.data
  }

export const getUserProfile =
  async (userId) => {
    const response =
      await api.get(
        `/users/profile/${userId}`
      )

    return response.data
  }

export const updateProfileImage =
  async (formData) => {
    const response =
      await api.put(
        '/users/profile/image',
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      )

    return response.data
  }

export const updateInventoryPrivacy =
  async (isPrivateInventory) => {
    const response =
      await api.put(
        '/users/profile/privacy',
        {
          isPrivateInventory,
        }
      )

    return response.data
  }
