import { NavLink } from 'react-router-dom'
import Logo from '@/assets/images/logo.svg'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn('text-sm leading-5 transition-colors', {
    'font-semibold text-primary': isActive,
    'font-normal text-gray-600 hover:text-gray-700': !isActive,
  })

export default function Header() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const user = useAuthStore(state => state.user)
  const userInitials = user?.initials?.slice(0, 2).toUpperCase() ?? 'CT'

  return (
    <>
      {isAuthenticated && (
        <header className="px-12 py-4 border-b border-gray-200 bg-white">
          <div className="w-full max-w-7xl mx-auto relative flex items-center justify-between">
            <img src={Logo} alt="Logo" className="h-6" />

            <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-5">
              <NavLink to="/dashboard" className={navLinkClassName}>
                Dashboard
              </NavLink>
              <NavLink to="/transactions" className={navLinkClassName}>
                Transações
              </NavLink>
              <NavLink to="/categories" className={navLinkClassName}>
                Categorias
              </NavLink>
            </nav>

            <NavLink
              to="/profile"
              className="size-9 rounded-full bg-gray-300 text-gray-800 text-sm font-medium flex items-center justify-center"
            >
              {userInitials}
            </NavLink>
          </div>
        </header>
      )}
    </>
  )
}
