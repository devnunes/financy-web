import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'

function RootRedirect() {
  const isAuthenticated = false
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
}

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}
