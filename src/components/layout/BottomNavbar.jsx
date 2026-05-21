import {
  Link,
  useLocation,
} from 'react-router-dom'

import navigationLinks from './navigationLinks'

function BottomNavbar() {
  const location = useLocation()

  return (
    <nav className='fixed bottom-0 left-0 z-50 flex min-h-20 w-full overflow-x-auto border-t border-white/10 bg-[#0d1118]/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur xl:hidden'>
      {navigationLinks.map((link) => {
        const Icon = link.icon
        const active =
          location.pathname ===
          link.path

        return (
          <Link
            key={link.path}
            to={link.path}
            className={`flex min-w-[78px] flex-1 flex-col items-center justify-center gap-1.5 rounded-lg text-[10px] font-semibold transition ${
              active
                ? 'text-violet-300'
                : 'text-slate-500'
            }`}
          >
            <Icon size={19} />
            <span>{link.shortName}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default BottomNavbar
