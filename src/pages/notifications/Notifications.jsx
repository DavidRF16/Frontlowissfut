import {
  useEffect,
  useState,
} from 'react'

import {
  Bell,
  Check,
  X,
} from 'lucide-react'

import toast from 'react-hot-toast'

import {
  acceptFriendRequest,
  rejectFriendRequest,
} from '../../services/friendService'
import {
  getNotifications,
} from '../../services/notificationService'

function Notifications() {
  const [
    notifications,
    setNotifications,
  ] = useState([])

  const fetchNotifications =
    async () => {
      try {
        const data =
          await getNotifications()
        setNotifications(data)
      } catch (error) {
        toast.error(
          'No se pudieron cargar las notificaciones'
        )
      }
    }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleAccept =
    async (notification) => {
      try {
        await acceptFriendRequest(
          notification.friendRequest
        )
        toast.success(
          'Solicitud aceptada'
        )
        fetchNotifications()
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            'No se pudo aceptar'
        )
      }
    }

  const handleReject =
    async (notification) => {
      try {
        await rejectFriendRequest(
          notification.friendRequest
        )
        toast.success(
          'Solicitud rechazada'
        )
        fetchNotifications()
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            'No se pudo rechazar'
        )
      }
    }

  return (
    <div className='w-full space-y-9'>
      <header className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-sm font-semibold uppercase tracking-[0.18em] text-violet-300'>
            Actividad
          </p>
          <h1 className='mt-2 text-3xl font-black text-white sm:text-4xl'>
            Notificaciones
          </h1>
        </div>

        <div className='rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300'>
          <span className='font-bold text-white'>
            {notifications.length}
          </span>{' '}
          avisos
        </div>
      </header>

      {notifications.length === 0 ? (
        <div className='rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-10 text-center'>
          <Bell
            className='mx-auto text-violet-300'
            size={36}
          />
          <h2 className='mt-4 text-lg font-bold text-white'>
            Sin notificaciones
          </h2>
        </div>
      ) : (
        <div className='space-y-5'>
          {notifications.map(
            (notification) => (
              <article
                key={notification._id}
                className='rounded-lg border border-white/10 bg-[#10151f] p-5 sm:p-6'
              >
                <div className='flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
                  <div className='min-w-0'>
                    <p className='break-words font-semibold text-white'>
                      {notification.text}
                    </p>
                    <p className='mt-1 text-xs text-slate-500'>
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  {notification.type ===
                    'friend_request' &&
                    notification.friendRequest && (
                      <div className='flex shrink-0 flex-wrap gap-3'>
                        <button
                          type='button'
                          onClick={() =>
                            handleAccept(
                              notification
                            )
                          }
                          className='inline-flex min-h-10 items-center gap-2 rounded-lg bg-violet-600 px-4 text-xs font-bold text-white transition hover:bg-violet-500'
                        >
                          <Check
                            size={15}
                          />
                          Aceptar
                        </button>

                        <button
                          type='button'
                          onClick={() =>
                            handleReject(
                              notification
                            )
                          }
                          className='inline-flex min-h-10 items-center gap-2 rounded-lg bg-red-500/15 px-4 text-xs font-bold text-red-200 transition hover:bg-red-500/25'
                        >
                          <X size={15} />
                          Rechazar
                        </button>
                      </div>
                    )}
                </div>
              </article>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default Notifications
