import api from '../api/axios'

export const addToWishlist =
  async (officialShirtId) => {
    const response =
      await api.post(
        '/wishlist',
        {
          officialShirtId,
        }
      )

    return response.data
  }

export const getWishlist =
  async () => {
    const response =
      await api.get('/wishlist')

    return response.data
  }
export const deleteWishlistShirt =
  async (id) => {
    const response =
      await api.delete(
        `/wishlist/${id}`
      )

    return response.data
  }
