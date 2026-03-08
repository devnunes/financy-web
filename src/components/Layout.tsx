import Header from './Header'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="h-dvh">
      <Header />
      <main className="p-12 flex flex-col items-center justify-center">
        {children}
      </main>
    </div>
  )
}
