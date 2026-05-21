import {
  useEffect,
  useState,
} from 'react'

import toast from 'react-hot-toast'
import {
  Link,
  useParams,
} from 'react-router-dom'

import {
  Camera,
  Copy,
  Eye,
  Lock,
  ShieldCheck,
  Shirt,
  Trophy,
  Users,
} from 'lucide-react'

import {
  getProfile,
  getUserProfile,
  updateInventoryPrivacy,
  updateProfileImage,
} from '../../services/userService'

import useAuthStore from '../../store/authStore'

function Profile() {
  const { user: authUser, updateUser } =
    useAuthStore()
  const { userId } = useParams()

  const [profile, setProfile] =
    useState(null)

  const isOwnProfile =
    !userId || userId === authUser?._id

  const fetchProfile =
    async () => {
      try {
        const data = isOwnProfile
          ? await getProfile()
          : await getUserProfile(userId)

        setProfile(data)
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            'No se pudo cargar el perfil'
        )
      }
    }

  useEffect(() => {
    fetchProfile()
  }, [userId])

  const handleImage =
    async (e) => {
      try {
        const file =
          e.target.files[0]

        if (!file) return

        const formData =
          new FormData()

        formData.append(
          'image',
          file
        )

        const updatedUser =
          await updateProfileImage(
            formData
          )

        setProfile({
          ...profile,
          user: updatedUser,
        })

        updateUser(updatedUser)

        toast.success(
          'Foto actualizada'
        )
      } catch (error) {
        toast.error(
          'Error al subir imagen'
        )
      }
    }

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(
        profile.user._id
      )
      toast.success('ID copiado')
    } catch (error) {
      toast.error(
        'No se pudo copiar'
      )
    }
  }

  const handlePrivacyChange =
    async () => {
      try {
        const updatedUser =
          await updateInventoryPrivacy(
            !profile.user
              .isPrivateInventory
          )

        setProfile({
          ...profile,
          user: updatedUser,
        })
        updateUser(updatedUser)

        toast.success(
          updatedUser.isPrivateInventory
            ? 'Inventario privado'
            : 'Inventario publico'
        )
      } catch (error) {
        toast.error(
          'No se pudo actualizar'
        )
      }
    }

  if (!profile) {
    return (
      <div className='mx-auto max-w-6xl rounded-lg border border-white/10 bg-[#10151f] p-8 text-slate-400'>
        Cargando perfil...
      </div>
    )
  }

  const initials =
    profile.user.username
      ?.slice(0, 2)
      .toUpperCase() || 'LF'

  const stats = [
    {
      label: 'Camisetas',
      value:
        profile.stats.totalShirts,
      icon: Shirt,
    },
    {
      label: 'Amigos',
      value:
        profile.stats.friendsCount || 0,
      icon: Users,
    },
    {
      label: 'Equipo favorito',
      value:
        profile.stats.favoriteTeam,
      icon: Trophy,
    },
    {
      label: 'Liga favorita',
      value:
        profile.stats.favoriteLeague,
      icon: ShieldCheck,
    },
  ]

  const canViewInventory =
    isOwnProfile ||
    !profile.user.isPrivateInventory

  if (!isOwnProfile) {
    return (
      <div className='page-stack mx-auto max-w-5xl pb-10'>
        <header className='page-header rounded-lg border border-white/10 bg-[#10151f] shadow-xl shadow-black/10'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <h1 className='text-2xl font-black text-white sm:text-3xl'>
              Perfil de {profile.user.username}
            </h1>

            {profile.user.isAdmin && (
              <span className='inline-flex w-fit items-center gap-2 rounded-md bg-violet-600/20 px-3 py-1 text-xs font-bold text-violet-100'>
                <ShieldCheck size={15} />
                Admin
              </span>
            )}
          </div>
        </header>

        <section className='page-section rounded-lg border border-white/10 bg-[#10151f]'>
          <div className='flex min-w-0 flex-col gap-6 md:flex-row md:items-center md:justify-between'>
            <div className='flex min-w-0 flex-col items-center gap-6 sm:flex-row sm:text-left'>
              <div className='grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-lg bg-violet-600 text-4xl font-black text-white sm:h-36 sm:w-36'>
                {profile.user.profileImage ? (
                  <img
                    src={
                      profile.user
                        .profileImage
                    }
                    alt=''
                    className='h-full w-full object-cover'
                  />
                ) : (
                  initials
                )}
              </div>

              <div className='min-w-0 text-center sm:text-left'>
                <h2 className='break-words text-3xl font-black text-white sm:text-4xl'>
                  {
                    profile.user
                      .username
                  }
                </h2>
                <p className='mt-4 break-all rounded-lg border border-white/10 bg-[#0b0f17] px-4 py-3 text-xs text-slate-400 sm:text-sm'>
                  ID: {profile.user._id}
                </p>
              </div>
            </div>

            {canViewInventory ? (
              <Link
                to={`/inventory/${profile.user._id}`}
                className='inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 px-5 text-sm font-bold text-white transition hover:border-violet-400'
              >
                <Shirt size={16} />
                Ver inventario
              </Link>
            ) : (
              <span className='inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-5 text-sm font-bold text-slate-400'>
                <Lock size={16} />
                Inventario privado
              </span>
            )}
          </div>
        </section>

        <section className='grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-4'>
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className='min-w-0 rounded-lg border border-white/10 bg-[#10151f] p-5 sm:p-6'
              >
                <div className='mb-5 grid h-11 w-11 place-items-center rounded-lg bg-white/10 text-violet-200'>
                  <Icon size={18} />
                </div>

                <p className='text-sm text-slate-500'>
                  {stat.label}
                </p>

                <h2 className='mt-3 break-words text-2xl font-black text-white'>
                  {stat.value}
                </h2>
              </div>
            )
          })}
        </section>

        <section className='page-section rounded-lg border border-white/10 bg-[#10151f]'>
          <div className='flex items-center gap-4'>
            <div className='grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/10 text-violet-200'>
              <Lock size={18} />
            </div>
            <div>
              <h2 className='font-bold text-white'>
                Privacidad del inventario
              </h2>
              <p className='text-sm text-slate-500'>
                {profile.user
                  .isPrivateInventory
                  ? 'Privado'
                  : 'Publico'}
              </p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className='page-stack mx-auto max-w-5xl pb-10'>
      <header className='page-header rounded-lg border border-white/10 bg-[#10151f] shadow-xl shadow-black/10'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <h1 className='text-2xl font-black text-white sm:text-3xl'>
            {isOwnProfile
              ? 'Perfil'
              : `Perfil de ${profile.user.username}`}
          </h1>

          {profile.user.isAdmin && (
            <span className='inline-flex w-fit items-center gap-2 rounded-md bg-violet-600/20 px-3 py-1 text-xs font-bold text-violet-100'>
              <ShieldCheck size={15} />
              Admin
            </span>
          )}
        </div>
      </header>

      <section className='page-section rounded-lg border border-white/10 bg-[#10151f]'>
        <div className='flex min-w-0 flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='flex min-w-0 flex-col items-center gap-6 sm:flex-row sm:text-left'>
            <div className='relative shrink-0'>
              <div className='grid h-36 w-36 place-items-center overflow-hidden rounded-lg bg-violet-600 text-5xl font-black text-white sm:h-40 sm:w-40'>
                {profile.user
                  .profileImage ? (
                  <img
                    src={
                      profile.user
                        .profileImage
                    }
                    alt=''
                    className='h-full w-full object-cover'
                  />
                ) : (
                  initials
                )}
              </div>

              {isOwnProfile && (
                <>
                  <label
                    htmlFor='profileImage'
                    className='absolute -bottom-2 -right-2 grid h-9 w-9 cursor-pointer place-items-center rounded-lg bg-violet-600 text-white shadow-lg shadow-black/30 transition hover:bg-violet-500'
                    aria-label='Cambiar foto de perfil'
                  >
                    <Camera size={15} />
                  </label>

                  <input
                    type='file'
                    accept='image/*'
                    hidden
                    id='profileImage'
                    onChange={handleImage}
                  />
                </>
              )}
            </div>

            <div className='min-w-0 text-center sm:text-left'>
              <h2 className='break-words text-3xl font-black text-white sm:text-4xl'>
                {
                  profile.user
                    .username
                }
              </h2>

              <div className='mt-4 flex max-w-full flex-col gap-3 sm:flex-row sm:items-center'>
                <p className='break-all rounded-lg border border-white/10 bg-[#0b0f17] px-4 py-3 text-xs text-slate-400 sm:text-sm'>
                  ID:{' '}
                  {
                    profile.user
                      ._id
                  }
                </p>

                <button
                  type='button'
                  onClick={copyId}
                  className='inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 text-sm font-bold text-white transition hover:border-violet-400'
                >
                  <Copy size={15} />
                  Copiar
                </button>
              </div>
            </div>
          </div>

          {canViewInventory ? (
            <Link
              to={
                isOwnProfile
                  ? '/inventory'
                  : `/inventory/${profile.user._id}`
              }
              className='inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 text-sm font-bold text-white transition hover:bg-violet-500'
            >
              <Eye size={16} />
              Ver inventario
            </Link>
          ) : (
            <span className='inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-5 text-sm font-bold text-slate-400'>
              <Lock size={16} />
              Inventario privado
            </span>
          )}
        </div>
      </section>

      <section className='grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-4'>
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className='min-w-0 rounded-lg border border-white/10 bg-[#10151f] p-5 sm:p-6'
            >
              <div className='mb-5 grid h-11 w-11 place-items-center rounded-lg bg-white/10 text-violet-200'>
                <Icon size={18} />
              </div>

              <p className='text-sm text-slate-500'>
                {stat.label}
              </p>

              <h2 className='mt-3 break-words text-2xl font-black text-white'>
                {stat.value}
              </h2>
            </div>
          )
        })}
      </section>

      {isOwnProfile && (
        <section className='page-section rounded-lg border border-white/10 bg-[#10151f]'>
          <div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-4'>
              <div className='grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/10 text-violet-200'>
                <Lock size={18} />
              </div>
              <div>
                <h2 className='font-bold text-white'>
                  Privacidad del inventario
                </h2>
                <p className='text-sm text-slate-500'>
                  Decide si otros usuarios pueden verlo.
                </p>
              </div>
            </div>

            <button
              type='button'
              onClick={handlePrivacyChange}
              className={`min-h-11 rounded-lg px-5 text-sm font-bold transition ${
                profile.user
                  .isPrivateInventory
                  ? 'bg-red-500/15 text-red-200 hover:bg-red-500/25'
                  : 'bg-violet-600 text-white hover:bg-violet-500'
              }`}
            >
              {profile.user
                .isPrivateInventory
                ? 'Privado'
                : 'Publico'}
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

export default Profile
