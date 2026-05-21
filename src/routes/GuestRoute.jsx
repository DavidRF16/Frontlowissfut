import { Navigate } from 'react-router-dom'

import useAuthStore from '../store/authStore'

function GuestRoute({ children }) {
  const { token } = useAuthStore()

  if (token) {
    return (
      <Navigate
        to='/forum'
        replace
      />
    )
  }

  return children
}

export default GuestRoute
