import { Navigate } from 'react-router-dom'

import useAuthStore from '../store/authStore'

function ProtectedRoute({ children }) {
  const { token } = useAuthStore()

  if (!token) {
    return <Navigate to='/' replace />
  }

  return children
}

export default ProtectedRoute
