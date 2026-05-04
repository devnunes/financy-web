export default function SessionLoading() {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center gap-4">
      <div className="size-8 rounded-full border-2 border-gray-300 border-t-primary animate-spin" />
      <p className="text-sm text-gray-600">Carregando sessão...</p>
    </div>
  )
}
