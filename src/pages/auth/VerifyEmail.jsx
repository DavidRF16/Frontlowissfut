import {
  useEffect,
  useState,
} from 'react'

import {
  Link,
  useSearchParams,
} from 'react-router-dom'

import {
  CheckCircle2,
  XCircle,
} from 'lucide-react'

import {
  verifyEmail,
} from '../../services/authService'

function VerifyEmail() {
  const [searchParams] =
    useSearchParams()
  const [status, setStatus] =
    useState('loading')
  const [message, setMessage] =
    useState(
      'Estamos verificando tu cuenta.'
    )

  useEffect(() => {
    const token =
      searchParams.get('token')

    const run = async () => {
      if (!token) {
        setStatus('error')
        setMessage(
          'El enlace no contiene token de verificacion.'
        )
        return
      }

      try {
        const response =
          await verifyEmail(token)

        setStatus('success')
        setMessage(response.message)
      } catch (error) {
        setStatus('error')
        setMessage(
          error.response?.data
            ?.message ||
            'No se pudo verificar la cuenta.'
        )
      }
    }

    run()
  }, [searchParams])

  const SuccessIcon =
    status === 'success'
      ? CheckCircle2
      : XCircle

  return (
    <div className='flex min-h-screen items-start justify-center bg-[#080b10] px-5 pt-16 text-white sm:pt-24'>
      <section className='w-full max-w-md rounded-lg border border-white/10 bg-[#10151f] p-8 text-center shadow-2xl shadow-black/30'>
        <img
          src='/lowissfut-logo.jpg'
          alt='LowissFut'
          className='mx-auto mb-6 h-14 w-14 rounded-lg object-cover'
        />

        <h1 className='text-3xl font-black'>
          LowissFut
        </h1>

        <div
          className={`mx-auto mt-8 grid h-12 w-12 place-items-center rounded-lg ${
            status === 'success'
              ? 'bg-emerald-500/15 text-emerald-300'
              : status === 'error'
                ? 'bg-red-500/15 text-red-300'
                : 'bg-white/10 text-violet-200'
          }`}
        >
          <SuccessIcon size={22} />
        </div>

        <p className='mt-5 text-sm leading-7 text-slate-300'>
          {message}
        </p>

        <Link
          to='/login'
          className='mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-violet-600 px-6 text-sm font-bold text-white transition hover:bg-violet-500'
        >
          Ir al login
        </Link>
      </section>
    </div>
  )
}

export default VerifyEmail
