import { Navigate, Outlet } from 'react-router-dom'
import SessionLoading from '@/components/SessionLoading'
import { useAuthIsAuthenticated, useAuthIsCheckingSession } from '@/stores/authStore'

export default function MissingAuthenticationRoute() {
  const isCheckingSession = useAuthIsCheckingSession()
  const isAuthenticated = useAuthIsAuthenticated()

  if (isCheckingSession) return <SessionLoading />
  if (isAuthenticated) return <Navigate to="/" replace />

  return <Outlet />
}
