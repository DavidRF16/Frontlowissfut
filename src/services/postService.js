import api from '../api/axios'

export const createPost = async (
  formData
) => {
  const response = await api.post(
    '/posts',
    formData
  )

  return response.data
}
export const getPosts = async () => {
  const response = await api.get('/posts')

  return response.data
}

export const deletePost =
  async (id) => {
    const response =
      await api.delete(
        `/posts/${id}`
      )

    return response.data
  }

export const likePost =
  async (id) => {
    const response =
      await api.put(
        `/posts/like/${id}`
      )

    return response.data
  }

export const createComment =
  async (postId, text) => {
    const response =
      await api.post(
        `/posts/${postId}/comments`,
        {
          text,
        }
      )

    return response.data
  }

export const deleteComment =
  async (commentId) => {
    const response =
      await api.delete(
        `/posts/comments/${commentId}`
      )

    return response.data
  }
