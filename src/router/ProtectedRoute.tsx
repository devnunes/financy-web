import { Navigate, Outlet } from 'react-router-dom'
import SessionLoading from '@/components/SessionLoading'
import { useAuthIsAuthenticated, useAuthIsCheckingSession } from '@/stores/authStore'

export default function ProtectedRoute() {
  const isCheckingSession = useAuthIsCheckingSession()
  const isAuthenticated = useAuthIsAuthenticated()

  if (isCheckingSession) return <SessionLoading />
  if (!isAuthenticated) return <Navigate to="/sign-in" replace />

  return <Outlet />
}
