import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { LogOut } from 'lucide-react'

import useAuthStore from '../../store/authStore'
import navigationLinks from './navigationLinks'

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } =
    useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <aside className='sticky top-0 hidden h-screen w-80 shrink-0 overflow-y-auto border-r border-white/10 bg-[#0d1118] px-6 py-8 xl:flex xl:flex-col'>
      <Link
        to='/forum'
        className='mb-14 flex items-center gap-4 px-2'
      >
        <img
          src='/lowissfut-logo.jpg'
          alt='LowissFut'
          className='h-12 w-12 rounded-lg object-cover'
        />

        <div>
          <h1 className='text-xl font-black tracking-normal text-white'>
            LowissFut
          </h1>
          <p className='text-xs font-medium text-slate-500'>
            Colección y foro
          </p>
        </div>
      </Link>

      <nav className='space-y-4 pb-8'>
        {navigationLinks.map((link) => {
          const Icon = link.icon
          const active =
            location.pathname ===
            link.path

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex min-h-14 items-center gap-4 rounded-lg px-5 py-4 text-[15px] font-semibold leading-snug transition ${
                active
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-900/40'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
              }`}
            >
              <Icon size={20} />
              <span>{link.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className='mt-auto border-t border-white/10 pt-7'>
        <div className='mb-5 rounded-lg border border-white/10 bg-white/[0.03] p-5'>
          <p className='truncate text-sm font-bold text-white'>
            {user?.username ||
              'Usuario'}
          </p>
          <p className='truncate text-xs text-slate-500'>
            {user?.email ||
              'Sesión activa'}
          </p>
        </div>

        <button
          type='button'
          onClick={handleLogout}
          className='flex h-12 w-full items-center gap-3 rounded-lg px-4 text-sm font-semibold text-slate-400 transition hover:bg-red-500/10 hover:text-red-300'
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
