import {
  useEffect,
  useState,
} from 'react'

import toast from 'react-hot-toast'

import {
  Lock,
  Image,
  Heart,
  MessageCircle,
  Send,
  ShieldCheck,
  Shirt,
  Trash2,
  Trophy,
  Users,
  X,
} from 'lucide-react'

import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  getPosts,
  likePost,
} from '../../services/postService'

import {
  getUserInventory,
} from '../../services/inventoryService'

import {
  getUserProfile,
} from '../../services/userService'

import Card from '../../components/ui/Card'

import Button from '../../components/ui/Button'

import Textarea from '../../components/ui/Textarea'

import PublicInventoryModal from '../../components/shirts/PublicInventoryModal'

import useAuthStore from '../../store/authStore'

const getId = (value) =>
  typeof value === 'string'
    ? value
    : value?._id

const canDeletePost = (post, user) =>
  Boolean(
    user?.isAdmin ||
      getId(post.user) === user?._id
  )

const canDeleteComment = (
  comment,
  user
) =>
  Boolean(
    user?.isAdmin ||
      getId(comment.user) === user?._id
  )

const getInitials = (username) =>
  username
    ?.slice(0, 2)
    .toUpperCase() || 'LF'

function Forum() {
  const { user } = useAuthStore()

  const [content, setContent] =
    useState('')

  const [image, setImage] =
    useState(null)

  const [posts, setPosts] =
    useState([])

  const [
    commentTexts,
    setCommentTexts,
  ] = useState({})

  const [
    pendingDelete,
    setPendingDelete,
  ] = useState(null)
  const [
    viewedProfile,
    setViewedProfile,
  ] = useState(null)
  const [
    viewedInventory,
    setViewedInventory,
  ] = useState(null)

  const fetchPosts =
    async () => {
      try {
        const data =
          await getPosts()

        setPosts(data)
      } catch (error) {
        toast.error(
          'No se pudieron cargar las publicaciones'
        )
      }
    }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleSubmit =
    async (e) => {
      e.preventDefault()

      try {
        if (
          !content.trim() &&
          !image
        ) {
          toast.error(
            'Escribe algo o sube una imagen'
          )

          return
        }

        const formData =
          new FormData()

        formData.append(
          'text',
          content
        )

        if (image) {
          formData.append(
            'image',
            image
          )
        }

        const post =
          await createPost(
            formData
          )

        setContent('')
        setImage(null)

        setPosts((prev) => [
          post,
          ...prev,
        ])

        toast.success(
          'Publicado'
        )
      } catch (error) {
        toast.error(
          'Error al publicar'
        )
      }
    }

  const handleLike =
    async (postId) => {
      try {
        const updatedPost =
          await likePost(postId)

        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? updatedPost
              : post
          )
        )
      } catch (error) {
        toast.error(
          'No se pudo actualizar el like'
        )
      }
    }

  const handleDeletePost =
    async (post) => {
      try {
        await deletePost(post._id)

        setPosts((prev) =>
          prev.filter(
            (item) =>
              item._id !== post._id
          )
        )

        toast.success(
          'Publicación eliminada'
        )
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            'No se pudo eliminar'
        )
      }
    }

  const handleDeleteComment =
    async (postId, comment) => {
      try {
        await deleteComment(
          comment._id
        )

        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  comments:
                    post.comments.filter(
                      (item) =>
                        item._id !==
                        comment._id
                    ),
                }
              : post
          )
        )

        toast.success(
          'Comentario eliminado'
        )
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            'No se pudo eliminar'
        )
      }
    }

  const requestDeletePost =
    (post) => {
      setPendingDelete({
        type: 'post',
        title: 'Eliminar publicación',
        message:
          'Esta publicación se eliminará de forma permanente.',
        post,
      })
    }

  const requestDeleteComment =
    (postId, comment) => {
      setPendingDelete({
        type: 'comment',
        title: 'Eliminar comentario',
        message:
          'Este comentario se eliminará de forma permanente.',
        postId,
        comment,
      })
    }

  const handleViewProfile =
    async (profileUser) => {
      const userId = getId(profileUser)

      if (!userId) return

      try {
        const data =
          await getUserProfile(userId)

        setViewedProfile(data)
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            'No se pudo ver el perfil'
        )
      }
    }

  const handleViewInventory =
    async (profileUser) => {
      const userId = getId(profileUser)

      if (!userId) return

      try {
        const shirts =
          await getUserInventory(userId)

        setViewedInventory({
          user: profileUser,
          shirts,
        })
        return true
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            'No se puede ver'
        )
        return false
      }
    }

  const handleConfirmDelete =
    async () => {
      if (!pendingDelete) return

      const deleteTarget =
        pendingDelete

      setPendingDelete(null)

      if (deleteTarget.type === 'post') {
        await handleDeletePost(
          deleteTarget.post
        )
        return
      }

      await handleDeleteComment(
        deleteTarget.postId,
        deleteTarget.comment
      )
    }

  const handleCommentSubmit =
    async (e, postId) => {
      e.preventDefault()

      const text =
        commentTexts[postId]?.trim()

      if (!text) {
        toast.error(
          'Escribe un comentario'
        )
        return
      }

      try {
        const updatedPost =
          await createComment(
            postId,
            text
          )

        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? updatedPost
              : post
          )
        )

        setCommentTexts((prev) => ({
          ...prev,
          [postId]: '',
        }))

        toast.success(
          'Comentario publicado'
        )
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            'No se pudo comentar'
        )
      }
    }

  return (
    <div className='page-stack mx-auto max-w-5xl'>
      <header className='page-header rounded-lg border border-white/10 bg-[#10151f] shadow-xl shadow-black/10'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <h1 className='text-2xl font-black text-white sm:text-3xl'>
            Foro
          </h1>

          <span className='w-fit rounded-md bg-violet-600/20 px-3 py-1 text-xs font-bold text-violet-100'>
            {posts.length} publicaciones
          </span>
        </div>
      </header>

      <Card>
        <form
          onSubmit={
            handleSubmit
          }
        >
          <Textarea
            rows={4}
            placeholder='¿Qué quieres compartir?'
            value={content}
            onChange={(e) =>
              setContent(
                e.target.value
              )
            }
          />

          <div className='mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <label className='flex min-w-0 cursor-pointer items-center gap-2 text-zinc-400 transition-all hover:text-white'>
              <Image size={20} />
              <span className='truncate'>
                {image
                  ? image.name
                  : 'Imagen'}
              </span>
              <input
                type='file'
                accept='image/*'
                hidden
                onChange={(e) =>
                  setImage(
                    e.target.files?.[0] ||
                      null
                  )
                }
              />
            </label>

            <Button type='submit' className='sm:w-auto'>
              Publicar
            </Button>
          </div>
        </form>
      </Card>

      <div className='flex flex-col gap-7'>
        {posts.map((post) => (
          <Card key={post._id}>
            <div className='mb-6 flex items-start gap-4'>
              <div className='grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-violet-600 text-sm font-black text-white'>
                {post.user
                  ?.profileImage ? (
                  <img
                    src={
                      post.user
                        .profileImage
                    }
                    alt=''
                    className='h-full w-full object-cover'
                  />
                ) : (
                  getInitials(
                    post.user
                      ?.username
                  )
                )}
              </div>

              <div className='min-w-0'>
                <button
                  type='button'
                  onClick={() =>
                    handleViewProfile(
                      post.user
                    )
                  }
                  className='break-words text-lg font-bold text-white transition hover:text-violet-300'
                >
                  {
                    post.user
                      ?.username
                  }
                </button>

                <p
                  className='mt-1 break-all font-mono text-xs text-zinc-500'
                  title='ID de usuario para añadir amigos'
                >
                  ID: {getId(post.user)}
                </p>
              </div>

              {canDeletePost(
                post,
                user
              ) && (
                <button
                  type='button'
                  onClick={() =>
                    requestDeletePost(
                      post
                    )
                  }
                  className='ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 text-zinc-400 transition hover:border-red-400/60 hover:bg-red-500/10 hover:text-red-200'
                  aria-label='Eliminar publicación'
                >
                  <Trash2 size={17} />
                </button>
              )}
            </div>

            <p className='break-words text-lg leading-8 text-zinc-200'>
              {post.text}
            </p>

            {post.image && (
              <img
                src={post.image}
                alt=''
                className='mx-auto mt-6 max-h-[340px] w-auto max-w-full rounded-lg object-contain sm:max-h-[420px]'
              />
            )}

            <div className='mt-7 flex flex-wrap items-center gap-6 text-zinc-400'>
              <button
                type='button'
                onClick={() =>
                  handleLike(post._id)
                }
                className={`flex items-center gap-2 transition-all hover:text-red-400 ${
                  post.likes?.some(
                    (id) =>
                      getId(id) ===
                      user?._id
                  )
                    ? 'text-red-400'
                    : ''
                }`}
              >
                <Heart size={20} />
                {post.likes?.length || 0}
              </button>

              <button
                type='button'
                className='flex items-center gap-2 transition-all hover:text-purple-400'
              >
                <MessageCircle size={20} />
                {post.comments?.length || 0}
              </button>
            </div>

            <div className='mt-6 border-t border-white/10 pt-5'>
              <div className='stack-xs'>
                {post.comments?.map(
                  (comment) => (
                    <div
                      key={comment._id}
                      className='rounded-lg bg-white/[0.03] px-4 py-3'
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div className='flex min-w-0 items-start gap-3'>
                          <div className='grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-violet-600/70 text-xs font-black text-white'>
                            {comment.user
                              ?.profileImage ? (
                              <img
                                src={
                                  comment.user
                                    .profileImage
                                }
                                alt=''
                                className='h-full w-full object-cover'
                              />
                            ) : (
                              getInitials(
                                comment.user
                                  ?.username
                              )
                            )}
                          </div>

                          <div className='min-w-0'>
                            <button
                              type='button'
                              onClick={() =>
                                handleViewProfile(
                                  comment.user
                                )
                              }
                              className='text-sm font-bold text-white transition hover:text-violet-300'
                            >
                              {comment.user
                                ?.username ||
                                'Usuario'}
                            </button>
                            <p
                              className='mt-0.5 break-all font-mono text-xs text-zinc-500'
                              title='ID de usuario para añadir amigos'
                            >
                              ID:{' '}
                              {getId(
                                comment.user
                              )}
                            </p>
                            <p className='mt-1 break-words text-sm leading-6 text-zinc-300'>
                              {comment.text}
                            </p>
                          </div>
                        </div>

                        {canDeleteComment(
                          comment,
                          user
                        ) && (
                          <button
                            type='button'
                            onClick={() =>
                              requestDeleteComment(
                                post._id,
                                comment
                              )
                            }
                            className='grid h-8 w-8 shrink-0 place-items-center rounded-lg text-zinc-500 transition hover:bg-red-500/10 hover:text-red-200'
                            aria-label='Eliminar comentario'
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>

              <form
                onSubmit={(e) =>
                  handleCommentSubmit(
                    e,
                    post._id
                  )
                }
                className='mt-5 flex gap-3'
              >
                <input
                  value={
                    commentTexts[
                      post._id
                    ] || ''
                  }
                  onChange={(e) =>
                    setCommentTexts(
                      (prev) => ({
                        ...prev,
                        [post._id]:
                          e.target
                            .value,
                      })
                    )
                  }
                  maxLength={400}
                  placeholder='Escribe un comentario'
                  className='h-11 min-w-0 flex-1 rounded-lg border border-white/10 bg-[#181820] px-4 text-sm text-white outline-none transition focus:border-purple-500'
                />

                <button
                  type='submit'
                  className='inline-flex h-11 shrink-0 items-center justify-center rounded-lg bg-purple-600 px-4 text-white transition hover:bg-purple-700'
                  aria-label='Enviar comentario'
                >
                  <Send size={17} />
                </button>
              </form>
            </div>
          </Card>
        ))}
      </div>

      {pendingDelete && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm'>
          <section
            role='dialog'
            aria-modal='true'
            aria-labelledby='delete-dialog-title'
            className='w-full max-w-md rounded-lg border border-white/10 bg-[#10151f] p-6 shadow-2xl shadow-black/50'
          >
            <h2
              id='delete-dialog-title'
              className='text-xl font-black text-white'
            >
              {pendingDelete.title}
            </h2>
            <p className='mt-3 text-sm leading-6 text-slate-400'>
              {pendingDelete.message}
            </p>

            <div className='mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
              <button
                type='button'
                onClick={() =>
                  setPendingDelete(null)
                }
                className='h-11 rounded-lg border border-white/10 px-5 text-sm font-bold text-slate-300 transition hover:bg-white/5 hover:text-white'
              >
                Cancelar
              </button>
              <button
                type='button'
                onClick={handleConfirmDelete}
                className='h-11 rounded-lg bg-red-600 px-5 text-sm font-bold text-white transition hover:bg-red-500'
              >
                Eliminar
              </button>
            </div>
          </section>
        </div>
      )}

      {viewedInventory && (
        <PublicInventoryModal
          owner={viewedInventory.user}
          shirts={viewedInventory.shirts}
          onClose={() =>
            setViewedInventory(null)
          }
        />
      )}

      {viewedProfile && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4'>
          <section className='max-h-[calc(100vh-3rem)] w-full max-w-4xl overflow-y-auto rounded-lg border border-white/10 bg-[#10151f] p-5 shadow-2xl shadow-black/50 sm:p-6'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex min-w-0 items-center gap-4'>
                <div className='grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-lg bg-violet-600 text-3xl font-black text-white sm:h-32 sm:w-32'>
                  {viewedProfile.user
                    .profileImage ? (
                    <img
                      src={
                        viewedProfile.user
                          .profileImage
                      }
                      alt=''
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    getInitials(
                      viewedProfile.user
                        .username
                    )
                  )}
                </div>

                <div className='min-w-0'>
                  <h2 className='break-words text-2xl font-black text-white sm:text-3xl'>
                    {
                      viewedProfile.user
                        .username
                    }
                  </h2>
                  <p className='mt-2 break-all rounded-lg border border-white/10 bg-[#0b0f17] px-3 py-2 text-xs text-slate-500'>
                    ID:{' '}
                    {
                      viewedProfile.user
                        ._id
                    }
                  </p>
                </div>
              </div>

              <button
                type='button'
                onClick={() =>
                  setViewedProfile(null)
                }
                className='grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-red-400/60 hover:text-red-200'
                aria-label='Cerrar perfil'
              >
                <X size={17} />
              </button>
            </div>

            <div className='mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
              {[
                {
                  label: 'Camisetas',
                  value:
                    viewedProfile.stats
                      .totalShirts,
                  icon: Shirt,
                },
                {
                  label: 'Amigos',
                  value:
                    viewedProfile.stats
                      .friendsCount || 0,
                  icon: Users,
                },
                {
                  label: 'Equipo favorito',
                  value:
                    viewedProfile.stats
                      .favoriteTeam,
                  icon: Trophy,
                },
                {
                  label: 'Liga favorita',
                  value:
                    viewedProfile.stats
                      .favoriteLeague,
                  icon: ShieldCheck,
                },
              ].map((stat) => {
                const Icon = stat.icon

                return (
                  <div
                    key={stat.label}
                    className='min-w-0 rounded-lg border border-white/10 bg-[#0b0f17] p-4'
                  >
                    <div className='mb-4 grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-violet-200'>
                      <Icon size={17} />
                    </div>
                    <p className='text-xs text-slate-500'>
                      {stat.label}
                    </p>
                    <h3 className='mt-2 break-words text-xl font-black text-white'>
                      {stat.value}
                    </h3>
                  </div>
                )
              })}
            </div>

            <div className='mt-5 rounded-lg border border-white/10 bg-[#0b0f17] p-4'>
              <div className='flex items-center gap-4'>
                <div className='grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/10 text-violet-200'>
                  <Lock size={17} />
                </div>

                <div>
                  <p className='text-sm font-bold text-white'>
                    Privacidad del inventario
                  </p>
                  <p className='text-sm text-slate-500'>
                    {viewedProfile.user
                      .isPrivateInventory
                      ? 'Privado'
                      : 'Publico'}
                  </p>
                </div>
              </div>
            </div>

            <button
              type='button'
              onClick={async () => {
                const opened =
                  await handleViewInventory(
                    viewedProfile.user
                  )

                if (opened) {
                  setViewedProfile(null)
                }
              }}
              disabled={
                viewedProfile.user
                  .isPrivateInventory
              }
              className='mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-bold text-white transition hover:border-violet-400 disabled:cursor-not-allowed disabled:text-slate-500 disabled:hover:border-white/10'
            >
              <Shirt size={16} />
              {viewedProfile.user
                .isPrivateInventory
                ? 'Inventario privado'
                : 'Inventario'}
            </button>
          </section>
        </div>
      )}
    </div>
  )
}

export default Forum
