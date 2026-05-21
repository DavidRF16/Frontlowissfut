import { useNavigate } from 'react-router-dom'

import { LogOut } from 'lucide-react'

import useAuthStore from '../../store/authStore'

function MobileLogoutButton() {
  const navigate = useNavigate()
  const logout = useAuthStore(
    (state) => state.logout
  )

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <button
      type='button'
      onClick={handleLogout}
      aria-label='Cerrar sesion'
      title='Cerrar sesion'
      className='fixed right-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-lg border border-white/10 bg-[#10151f]/95 text-slate-300 shadow-lg shadow-black/25 backdrop-blur transition hover:bg-red-500/10 hover:text-red-300 xl:hidden'
    >
      <LogOut size={19} />
    </button>
  )
}

export default MobileLogoutButton
