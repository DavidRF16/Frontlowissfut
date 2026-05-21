import { Routes, Route } from 'react-router-dom'

import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import VerifyEmail from '../pages/auth/VerifyEmail'
import Landing from '../pages/landing/Landing'
import GuestRoute from './GuestRoute'
import ProtectedRoute from './ProtectedRoute'
import Forum from '../pages/forum/Forum'
import Friends from '../pages/friends/Friends'
import Inventory from '../pages/inventory/Inventory'
import Wishlist from '../pages/wishlist/Wishlist'
import Profile from '../pages/profile/Profile'
import AddShirt from '../pages/add-shirt/AddShirt'
import Notifications from '../pages/notifications/Notifications'

import MainLayout from '../layouts/MainLayout'

function AppRouter() {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route
        path='/login'
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path='/register'
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />
      <Route
        path='/verify-email'
        element={<VerifyEmail />}
      />

   <Route
  element={
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  }
>
        <Route path='/forum' element={<Forum />} />
        <Route path='/friends' element={<Friends />} />
        <Route path='/inventory' element={<Inventory />} />
        <Route path='/inventory/:userId' element={<Inventory />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/camisetas' element={<AddShirt />} />
        <Route path='/notifications' element={<Notifications />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/profile/:userId' element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
