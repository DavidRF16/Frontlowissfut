import { Outlet } from 'react-router-dom'

import Sidebar from '../components/layout/Sidebar'
import BottomNavbar from '../components/layout/BottomNavbar'
import MobileLogoutButton from '../components/layout/MobileLogoutButton'

function MainLayout() {
  return (
    <div className='min-h-screen overflow-x-clip bg-[#080b10] text-slate-100'>
      <div className='flex min-h-screen w-full'>
        <Sidebar />
        <MobileLogoutButton />

        <main className='app-main'>
          <div className='app-content'>
            <Outlet />
          </div>
        </main>

        <BottomNavbar />
      </div>
    </div>
  )
}

export default MainLayout
