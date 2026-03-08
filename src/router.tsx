import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'

function RootRedirect() {
  const isAuthenticated = false
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
}

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<SignUp />} />
    </Routes>
  )
}
