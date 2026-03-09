import { Navigate, Route, Routes } from 'react-router-dom'
import SignIn from '@/pages/Auth/SignIn'
import Categories from '@/pages/Categories'
import Dashboard from '@/pages/Dashboard'
import Transactions from '@/pages/Transactions'
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
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/categories" element={<Categories />} />
      </Route>
    </Routes>
  )
}
