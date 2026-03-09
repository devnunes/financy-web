import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from '@/pages/Auth/Dashboard'
import SignIn from '@/pages/Auth/SignIn'
import SignUp from '../pages/Auth/SignUp'
import { useAuthStore } from '../stores/authStore'
import MissingAuthenticationRoute from './MissingAutheticationRoute'
import ProtectedRoute from './ProtectedRoute'

function RootRedirect() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const isCheckingSession = useAuthStore(state => state.isCheckingSession)

  if (isCheckingSession) {
    return null
  }

  return <Navigate to={isAuthenticated ? '/dashboard' : '/sign-in'} replace />
}

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route element={<MissingAuthenticationRoute />}>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}
