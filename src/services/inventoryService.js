import api from '../api/axios'

export const addToInventory =
  async (
    officialShirtId,
    details = {}
  ) => {
    const response =
      await api.post(
        '/inventory',
        {
          officialShirtId,
          ...details,
        }
      )

    return response.data
  }

export const getInventory =
  async () => {
    const response =
      await api.get('/inventory')

    return response.data
  }

export const getUserInventory =
  async (userId) => {
    const response =
      await api.get(
        `/inventory/user/${userId}`
      )

    return response.data
  }

export const deleteInventoryShirt =
  async (id) => {
    const response =
      await api.delete(
        `/inventory/${id}`
      )

    return response.data
  }
