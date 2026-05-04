import { Navigate, Route, Routes } from 'react-router-dom'
import SessionLoading from '@/components/SessionLoading'
import SignIn from '@/pages/Auth/SignIn'
import Categories from '@/pages/Categories'
import Dashboard from '@/pages/Dashboard'
import Profile from '@/pages/Profile'
import Transactions from '@/pages/Transactions'
import SignUp from '../pages/Auth/SignUp'
import {
  useAuthIsAuthenticated,
  useAuthIsCheckingSession,
} from '../stores/authStore'
import MissingAuthenticationRoute from './MissingAutheticationRoute'
import ProtectedRoute from './ProtectedRoute'

function RootRedirect() {
  const isCheckingSession = useAuthIsCheckingSession()
  const isAuthenticated = useAuthIsAuthenticated()

  if (isCheckingSession) return <SessionLoading />

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
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}
