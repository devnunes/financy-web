import Logo from '@/assets/images/logo.svg'
import { useAuthStore } from '@/stores/authStore'

export default function Header() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const user = useAuthStore(state => state.user)
  const signOut = useAuthStore(state => state.signOut)

  return (
    <>
      {isAuthenticated && (
        <header className="px-12 py-4 flex items-center justify-between">
          <img src={Logo} alt="Logo" />
          <div>
            <span>Dashboard</span>
            <span>Transações</span>
            <span>Categorias</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {user?.initials} {user?.name}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                void signOut()
              }}
              className="text-sm font-medium text-red-600 hover:text-red-700 hover:cursor-pointer"
            >
              Sair
            </button>
          </div>
        </header>
      )}
    </>
  )
}
