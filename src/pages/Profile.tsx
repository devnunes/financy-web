import { useState } from 'react'
import { Input } from '@/components/Input'
import Icon from '@/components/ui/Icon'
import { LabelButton } from '@/components/ui/LabelButton'
import { useAuthStore } from '@/stores/authStore'

export default function Profile() {
  const user = useAuthStore(state => state.user)
  const signOut = useAuthStore(state => state.signOut)
  const [name, setName] = useState(user?.name || '')

  if (!user) {
    return (
      <section className="w-full max-w-md mx-auto mt-16 flex flex-col items-center justify-center gap-6">
        <div className="rounded-full bg-gray-300 text-gray-800 text-3xl font-bold flex items-center justify-center size-20">
          ?
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            Usuário não encontrado
          </h2>
          <p className="text-gray-500 text-sm">
            Faça login para ver seu perfil.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full min-h-[80vh] flex items-center justify-center bg-gray-100 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8 flex flex-col items-center">
        <div className="rounded-full bg-gray-300 text-gray-800 text-3xl font-bold flex items-center justify-center size-20 mb-4">
          {user.initials}
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          {user.name}
        </h2>
        <p className="text-gray-500 text-base text-center mb-6">{user.email}</p>
        <hr className="w-full border-gray-200 my-6" />
        <form className="w-full flex flex-col gap-4">
          <Input
            label="Nome completo"
            value={name}
            onChange={e => setName(e.target.value)}
            leftIcon={<Icon name="user" color="gray" className="size-4" />}
            placeholder="Nome completo"
            autoComplete="name"
          />
          <Input
            label="E-mail"
            value={user.email}
            leftIcon={<Icon name="mail" color="gray" className="size-4" />}
            readOnly
            disabled
            helperText="O e-mail não pode ser alterado"
            className="bg-gray-100"
          />
          <LabelButton
            label="Salvar alterações"
            className="w-full mt-2 text-base h-12"
            type="submit"
          />
        </form>
        <LabelButton
          label="Sair da conta"
          icon={<Icon name="log-out" color="red" className="size-4" />}
          className="w-full mt-4 text-base h-12 border-red-base text-red-base bg-white hover:bg-red-50"
          variant="outline"
          onClick={signOut}
        />
      </div>
    </section>
  )
}
