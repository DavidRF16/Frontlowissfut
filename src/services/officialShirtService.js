import api from '../api/axios'

export const getOfficialShirts =
  async () => {
    const response =
      await api.get(
        '/official-shirts'
      )

    return response.data
  }

export const createOfficialShirt =
  async (formData) => {
    const response =
      await api.post(
        '/official-shirts',
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

export const deleteOfficialShirt =
  async (id) => {
    const response =
      await api.delete(
        `/official-shirts/${id}`
      )

    return response.data
  }
