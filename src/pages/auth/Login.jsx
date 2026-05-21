import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import {
  Link,
  useNavigate,
} from 'react-router-dom'
import toast from 'react-hot-toast'

import { loginUser } from '../../services/authService'
import useAuthStore from '../../store/authStore'

function Login() {
  const {
    register,
    handleSubmit,
  } = useForm()
  const navigate = useNavigate()
  const { setAuth } =
    useAuthStore()

  const onSubmit = async (
    data
  ) => {
    try {
      const response =
        await loginUser(data)

      setAuth(response)
      toast.success('Bienvenido')
      navigate('/forum')
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          'Error al iniciar sesión'
      )
    }
  }

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
            Entra a tu colección, revisa tu wishlist y vuelve al foro en segundos.
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
              Entrar
            </p>
            <h2 className='mt-2 text-3xl font-black text-white'>
              Inicia sesión
            </h2>
          </div>

          <form
            onSubmit={handleSubmit(
              onSubmit
            )}
            className='space-y-4'
          >
            <input
              type='email'
              placeholder='Email'
              {...register('email', {
                required: true,
              })}
              className='h-12 w-full rounded-lg border border-white/10 bg-[#0b0f17] px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:bg-[#0d1320]'
            />

            <input
              type='password'
              placeholder='Contraseña'
              {...register(
                'password',
                {
                  required: true,
                }
              )}
              className='h-12 w-full rounded-lg border border-white/10 bg-[#0b0f17] px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:bg-[#0d1320]'
            />

            <button className='h-12 w-full rounded-lg bg-violet-600 text-sm font-bold text-white shadow-lg shadow-violet-950/25 transition hover:bg-violet-500'>
              Iniciar sesión
            </button>
          </form>

          <p className='mt-7 text-center text-sm text-slate-400'>
            ¿No tienes cuenta?{' '}
            <Link
              to='/register'
              className='font-bold text-violet-300 hover:text-violet-200'
            >
              Crear cuenta
            </Link>
          </p>
        </motion.div>
      </section>
    </div>
  )
}

export default Login
