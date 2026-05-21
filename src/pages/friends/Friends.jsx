import {
  useEffect,
  useState,
} from 'react'

import {
  Lock,
  MessageCircle,
  Search,
  Send,
  ShieldCheck,
  Shirt,
  Trophy,
  Users,
  X,
} from 'lucide-react'

import toast from 'react-hot-toast'

import ChatBox from '../../components/chat/ChatBox'
import PublicInventoryModal from '../../components/shirts/PublicInventoryModal'
import {
  getUserInventory,
} from '../../services/inventoryService'
import {
  getFriends,
  sendFriendRequest,
} from '../../services/friendService'
import {
  getUserProfile,
} from '../../services/userService'

function Friends() {
  const [friends, setFriends] =
    useState([])
  const [activeFriend, setActiveFriend] =
    useState(null)
  const [friendId, setFriendId] =
    useState('')
  const [
    viewedInventory,
    setViewedInventory,
  ] = useState(null)
  const [
    viewedProfile,
    setViewedProfile,
  ] = useState(null)

  const fetchFriends =
    async () => {
      try {
        const data =
          await getFriends()
        setFriends(data)
      } catch (error) {
        toast.error(
          'No se pudieron cargar los amigos'
        )
      }
    }

  useEffect(() => {
    fetchFriends()
  }, [])

  const handleSendRequest =
    async () => {
      if (!friendId.trim()) return

      try {
        await sendFriendRequest(
          friendId.trim()
        )
        setFriendId('')
        toast.success(
          'Solicitud enviada'
        )
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            'No se pudo enviar'
        )
      }
    }

  const handleViewInventory =
    async (friend) => {
      try {
        const shirts =
          await getUserInventory(
            friend._id
          )
        setViewedInventory({
          friend,
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

  const handleViewProfile =
    async (friend) => {
      try {
        const data =
          await getUserProfile(
            friend._id
          )

        setViewedProfile(data)
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            'No se pudo ver el perfil'
        )
      }
    }

  return (
    <div className='page-stack mx-auto max-w-5xl'>
      <header className='page-header rounded-lg border border-white/10 bg-[#10151f] shadow-xl shadow-black/10'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <h1 className='text-2xl font-black text-white sm:text-3xl'>
            Amigos
          </h1>

          <span className='w-fit rounded-md bg-violet-600/20 px-3 py-1 text-xs font-bold text-violet-100'>
            {friends.length} amigos
          </span>
        </div>
      </header>

      <section className='page-section rounded-lg border border-white/10 bg-[#10151f]'>
        <div className='flex flex-col gap-4 lg:flex-row'>
          <label className='relative flex-1'>
            <Search
              className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500'
              size={18}
            />
            <input
              value={friendId}
              onChange={(e) =>
                setFriendId(
                  e.target.value
                )
              }
              placeholder='Pega aquí el ID de un amigo'
              className='h-11 w-full rounded-lg border border-white/10 bg-[#0b0f17] pl-10 pr-3 text-sm text-white outline-none focus:border-violet-400'
            />
          </label>

          <button
            type='button'
            onClick={
              handleSendRequest
            }
            className='inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 text-sm font-bold text-white transition hover:bg-violet-500'
          >
            <Send size={17} />
            Enviar solicitud
          </button>
        </div>
      </section>

      <div
        className={`grid min-w-0 gap-6 ${
          activeFriend
            ? 'xl:grid-cols-[minmax(0,1fr)_420px]'
            : ''
        }`}
      >
        <section className='stack-sm min-w-0'>
          {friends.length === 0 ? (
            <div className='rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-10 text-center'>
              <Users
                className='mx-auto text-violet-300'
                size={38}
              />
              <h2 className='mt-4 text-lg font-bold text-white'>
                Sin amigos todavía
              </h2>
              <p className='mt-2 text-sm text-slate-400'>
                Comparte tu ID desde el perfil para que puedan añadirte.
              </p>
            </div>
          ) : (
            friends.map((friend) => (
              <article
                key={friend._id}
                className='rounded-lg border border-white/10 bg-[#10151f] p-5 sm:p-6'
              >
                <div className='flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
                  <div className='min-w-0'>
                    <button
                      type='button'
                      onClick={() =>
                        handleViewProfile(
                          friend
                        )
                      }
                      className='text-left text-base font-bold text-white transition hover:text-violet-300'
                    >
                      {friend.username}
                    </button>
                    <p className='mt-1 break-all text-xs text-slate-500'>
                      ID: {friend._id}
                    </p>
                    <p className='mt-2 text-xs font-semibold text-slate-500'>
                      Inventario{' '}
                      {friend.isPrivateInventory
                        ? 'privado'
                        : 'público'}
                    </p>
                  </div>

                  <div className='flex shrink-0 flex-wrap gap-3'>
                    <button
                      type='button'
                      onClick={() =>
                        handleViewInventory(
                          friend
                        )
                      }
                      className='inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 px-4 text-xs font-bold text-white transition hover:border-violet-400'
                    >
                      <Shirt size={16} />
                      Ver inventario
                    </button>

                    <button
                      type='button'
                      onClick={() =>
                        setActiveFriend(
                          friend
                        )
                      }
                      className='inline-flex min-h-10 items-center gap-2 rounded-lg bg-violet-600 px-4 text-xs font-bold text-white transition hover:bg-violet-500'
                    >
                      <MessageCircle
                        size={16}
                      />
                      Chat
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}

        </section>

        <aside className='min-w-0 xl:sticky xl:top-8 xl:h-fit'>
          {activeFriend ? (
            <ChatBox
              selectedUser={
                activeFriend
              }
              onClose={() =>
                setActiveFriend(null)
              }
            />
          ) : friends.length > 0 ? (
            <div className='rounded-lg border border-white/10 bg-[#10151f] p-8 text-center text-slate-400'>
              <MessageCircle
                className='mx-auto text-violet-300'
                size={34}
              />
              <p className='mt-3 text-sm'>
                El chat se abrirá aquí.
              </p>
            </div>
          ) : null}
        </aside>
      </div>

      {viewedInventory && (
        <PublicInventoryModal
          owner={viewedInventory.friend}
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
                    viewedProfile.user.username
                      ?.slice(0, 2)
                      .toUpperCase()
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

            <div className='mt-5 grid gap-3 sm:grid-cols-2'>
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
                className='inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-bold text-white transition hover:border-violet-400'
              >
                <Shirt size={16} />
                Inventario
              </button>

              <button
                type='button'
                onClick={() => {
                  setActiveFriend(
                    viewedProfile.user
                  )
                  setViewedProfile(null)
                }}
                className='inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 text-sm font-bold text-white transition hover:bg-violet-500'
              >
                <MessageCircle size={16} />
                Chat
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default Friends
