export default function Header() {
  const isAuthenticated = false

  return (
    <>
      {isAuthenticated && (
        <header className="w-full px-12 py-4 flex items-center justify-between">
          <div>Logo</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium">MN</span>
              </div>
            </div>
          </div>
        </header>
      )}
    </>
  )
}
