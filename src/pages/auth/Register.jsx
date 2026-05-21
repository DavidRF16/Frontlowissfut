import {
  useEffect,
  useState,
} from 'react'

import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import {
  Link,
  useNavigate,
} from 'react-router-dom'
import toast from 'react-hot-toast'

import {
  checkAuthAvailability,
  registerUser,
} from '../../services/authService'

const getAvailabilityText = (
  field,
  status
) => {
  if (status === 'checking') {
    return 'Comprobando disponibilidad...'
  }

  if (status === 'available') {
    return field === 'username'
      ? 'Usuario disponible'
      : 'Correo disponible'
  }

  if (status === 'taken') {
    return field === 'username'
      ? 'Ese usuario ya está ocupado'
      : 'Ese correo ya está ocupado'
  }

  if (status === 'error') {
    return 'No se pudo comprobar ahora'
  }

  return ''
}

function Register() {
  const {
    register,
    handleSubmit,
    setError,
    watch,
  } = useForm()
  const navigate = useNavigate()

  const username = watch('username')
  const email = watch('email')

  const [
    availability,
    setAvailability,
  ] = useState({
    username: 'idle',
    email: 'idle',
  })

  useEffect(() => {
    const trimmedUsername =
      String(username || '').trim()

    if (trimmedUsername.length < 3) {
      setAvailability((prev) => ({
        ...prev,
        username: 'idle',
      }))
      return
    }

    setAvailability((prev) => ({
      ...prev,
      username: 'checking',
    }))

    const timeoutId = setTimeout(
      async () => {
        try {
          const result =
            await checkAuthAvailability({
              username:
                trimmedUsername,
            })

          setAvailability((prev) => ({
            ...prev,
            username:
              result.usernameAvailable
                ? 'available'
                : 'taken',
          }))
        } catch (error) {
          setAvailability((prev) => ({
            ...prev,
            username: 'error',
          }))
        }
      },
      450
    )

    return () =>
      clearTimeout(timeoutId)
  }, [username])

  useEffect(() => {
    const trimmedEmail =
      String(email || '')
        .trim()
        .toLowerCase()

    if (
      !trimmedEmail ||
      !trimmedEmail.includes('@')
    ) {
      setAvailability((prev) => ({
        ...prev,
        email: 'idle',
      }))
      return
    }

    setAvailability((prev) => ({
      ...prev,
      email: 'checking',
    }))

    const timeoutId = setTimeout(
      async () => {
        try {
          const result =
            await checkAuthAvailability({
              email: trimmedEmail,
            })

          setAvailability((prev) => ({
            ...prev,
            email:
              result.emailAvailable
                ? 'available'
                : 'taken',
          }))
        } catch (error) {
          setAvailability((prev) => ({
            ...prev,
            email: 'error',
          }))
        }
      },
      450
    )

    return () =>
      clearTimeout(timeoutId)
  }, [email])

  const onSubmit = async (
    data
  ) => {
    const cleanData = {
      ...data,
      username: String(
        data.username || ''
      ).trim(),
      email: String(data.email || '')
        .trim()
        .toLowerCase(),
    }

    try {
      const result =
        await checkAuthAvailability({
          username:
            cleanData.username,
          email: cleanData.email,
        })

      if (!result.usernameAvailable) {
        setAvailability((prev) => ({
          ...prev,
          username: 'taken',
        }))
        setError('username', {
          type: 'manual',
        })
      }

      if (!result.emailAvailable) {
        setAvailability((prev) => ({
          ...prev,
          email: 'taken',
        }))
        setError('email', {
          type: 'manual',
        })
      }

      if (
        !result.usernameAvailable ||
        !result.emailAvailable
      ) {
        toast.error(
          'Elige otro usuario o correo'
        )
        return
      }

      await registerUser(cleanData)

      toast.success(
        'Revisa tu correo para verificar la cuenta'
      )
      navigate('/login')
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          'Error al registrarse'
      )
    }
  }

  const usernameHelp =
    getAvailabilityText(
      'username',
      availability.username
    )

  const emailHelp =
    getAvailabilityText(
      'email',
      availability.email
    )

  const helperClass = (status) =>
    status === 'available'
      ? 'text-emerald-300'
      : status === 'taken'
        ? 'text-red-300'
        : 'text-slate-500'

  const isSubmitDisabled =
    availability.username ===
      'checking' ||
    availability.email ===
      'checking' ||
    availability.username ===
      'taken' ||
    availability.email === 'taken'

  return (
    <div className='grid min-h-dvh gap-8 bg-[#080b10] px-4 py-5 text-white sm:px-6 sm:py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8'>
      <section className='hidden min-h-full items-center justify-center rounded-lg border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.42),transparent_34%),linear-gradient(135deg,#111827,#090d14)] p-10 text-center shadow-2xl shadow-black/20 lg:flex'>
        <div className='max-w-xl'>
          <img
            src='/lowissfut-logo.jpg'
            alt='LowissFut'
            className='mx-auto mb-7 h-16 w-16 rounded-lg border border-white/10 object-cover shadow-xl shadow-black/30'
          />
          <h1 className='text-5xl font-black leading-tight xl:text-6xl'>
            LowissFut
          </h1>
          <p className='mx-auto mt-5 max-w-lg text-lg leading-8 text-slate-300'>
            Crea tu cuenta, verifica tu correo y empieza tu colección.
          </p>
        </div>
      </section>

      <section className='flex min-h-[calc(100dvh-2.5rem)] items-center justify-center lg:min-h-full'>
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className='w-full max-w-md rounded-lg border border-white/10 bg-[#10151f] p-6 shadow-2xl shadow-black/30 sm:p-8'
        >
          <div className='mb-8'>
            <div className='mb-7 flex items-center gap-3'>
              <img
                src='/lowissfut-logo.jpg'
                alt='LowissFut'
                className='h-11 w-11 rounded-lg object-cover'
              />
              <h1 className='text-2xl font-black text-white'>
                LowissFut
              </h1>
            </div>
            <p className='text-sm font-semibold uppercase tracking-[0.18em] text-violet-300'>
              Registro
            </p>
            <h2 className='mt-2 text-3xl font-black text-white'>
              Crear cuenta
            </h2>
          </div>

          <form
            onSubmit={handleSubmit(
              onSubmit
            )}
            className='space-y-4'
          >
            <div>
              <input
                type='text'
                placeholder='Nombre de usuario'
                {...register(
                  'username',
                  {
                    required: true,
                    minLength: 3,
                  }
                )}
                className='h-12 w-full rounded-lg border border-white/10 bg-[#0b0f17] px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:bg-[#0d1320]'
              />
              {usernameHelp && (
                <p className={`mt-2 text-xs font-semibold ${helperClass(availability.username)}`}>
                  {usernameHelp}
                </p>
              )}
            </div>

            <div>
              <input
                type='email'
                placeholder='Email'
                {...register('email', {
                  required: true,
                })}
                className='h-12 w-full rounded-lg border border-white/10 bg-[#0b0f17] px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:bg-[#0d1320]'
              />
              {emailHelp && (
                <p className={`mt-2 text-xs font-semibold ${helperClass(availability.email)}`}>
                  {emailHelp}
                </p>
              )}
            </div>

            <input
              type='password'
              placeholder='Contraseña'
              {...register(
                'password',
                {
                  required: true,
                  minLength: 6,
                }
              )}
              className='h-12 w-full rounded-lg border border-white/10 bg-[#0b0f17] px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:bg-[#0d1320]'
            />

            <button
              type='submit'
              disabled={isSubmitDisabled}
              className='h-12 w-full rounded-lg bg-violet-600 text-sm font-bold text-white shadow-lg shadow-violet-950/25 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none'
            >
              Crear cuenta
            </button>
          </form>

          <p className='mt-7 text-center text-sm text-slate-400'>
            ¿Ya tienes cuenta?{' '}
            <Link
              to='/login'
              className='font-bold text-violet-300 hover:text-violet-200'
            >
              Iniciar sesión
            </Link>
          </p>
        </motion.div>
      </section>
    </div>
  )
}

export default Register
