import Header from './Header'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="h-dvh bg-gray-200">
      <Header />
      <main className="p-12">{children}</main>
    </div>
  )
}
