import { Lock, Mail, UserRoundPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from '@/assets/images/Logo.svg'
import CustomLink from '@/components/ui/CustomLink'
import { Input } from '@/components/ui/Input'
import { LabelButton } from '@/components/ui/LabelButton'

export default function Login() {
  return (
    <>
      <img src={Logo} alt="Logo" className="mb-8 h-8" />
      <div className="flex flex-col items-center justify-start p-8 bg-white border-0 border-gray-200 rounded-lg w-md">
        <div className="flex flex-col items-center gap-1 mb-8">
          <span className="text-xl font-extrabold">Fazer Login</span>
          <span className="text-base text-gray-600">
            Entre na sua conta para continuar
          </span>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <Input
            label="Email"
            type="email"
            placeholder="mail@example.com"
            leftIcon={<Mail className="text-gray-400" size={16} />}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            leftIcon={<Lock className="text-gray-400" size={16} />}
          />
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1 text-sm text-gray-700 self-start cursor-pointer">
              <input type="checkbox" />
              Lembrar-me
            </span>
            <CustomLink
              to="/register"
              className="text-sm self-end cursor-pointer"
              text="Recuperar senha"
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-6 w-full my-6">
          <LabelButton className="w-full h-12" label="Entrar" />
          <div className="flex items-center justify-center gap-3 w-full">
            <div className="h-px border-t border-gray-300 flex-1" />
            <span className="text-sm leading-5 text-gray-500">ou</span>
            <div className="h-px border-t border-gray-300 flex-1" />
          </div>
        </div>
        <span className="mb-4 text-sm text-gray-600">
          Ainda não tem uma conta?
        </span>
        <Link className="w-full h-12" to="/cadastro">
          <LabelButton
            className="w-full h-12"
            variant="outline"
            label="Criar conta"
            icon={<UserRoundPlus className="text-gray-700" size={18} />}
          />
        </Link>
      </div>
    </>
  )
}
