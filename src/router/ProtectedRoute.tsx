import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const isCheckingSession = useAuthStore(state => state.isCheckingSession)
  if (isCheckingSession) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return <Outlet />
}
