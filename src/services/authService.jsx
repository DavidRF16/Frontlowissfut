import api from '../api/axios'

export const registerUser = async (data) => {
  const response = await api.post(
    '/auth/register',
    data
  )

  return response.data
}

export const loginUser = async (data) => {
  const response = await api.post(
    '/auth/login',
    data
  )

  return response.data
}

export const checkAuthAvailability =
  async ({ username, email }) => {
    const response = await api.get(
      '/auth/availability',
      {
        params: {
          username,
          email,
        },
      }
    )

    return response.data
  }

export const verifyEmail =
  async (token) => {
    const response =
      await api.post(
        '/auth/verify-email',
        {
          token,
        }
      )

    return response.data
  }
