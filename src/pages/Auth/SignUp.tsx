import { EyeClosed, Lock, LogIn, Mail, User } from 'lucide-react'
import Logo from '@/assets/images/Logo.svg'
import { Input } from '@/components/ui/Input'
import { LabelButton } from '@/components/ui/LabelButton'

export default function SignUp() {
  return (
    <>
      <img src={Logo} alt="Logo" className="mb-8 h-8" />
      <div className="flex flex-col items-center justify-start p-8 bg-white border-0 border-gray-200 rounded-lg w-md">
        <div className="flex flex-col items-center gap-1 mb-8">
          <span className="text-xl font-extrabold">Criar Conta</span>
          <span className="text-base text-gray-600">
            Comece a controlar suas finanças ainda hoje
          </span>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <Input
            label="Nome Completo"
            type="text"
            placeholder="Seu nome completo"
            leftIcon={<User className="text-gray-400" size={16} />}
          />
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
            helperText="A senha deve ter no mínimo 8 caracteres"
            leftIcon={<Lock className="text-gray-400" size={16} />}
            rightIcon={<EyeClosed size={16} />}
          />
        </div>
        <div className="flex flex-col items-center gap-6 w-full my-6">
          <LabelButton className="w-full h-12" label="Cadastrar" />
          <div className="flex items-center justify-center gap-3 w-full">
            <div className="h-px border-t border-gray-300 flex-1" />
            <span className="text-sm leading-5 text-gray-500">ou</span>
            <div className="h-px border-t border-gray-300 flex-1" />
          </div>
        </div>
        <span className="mb-4 text-sm text-gray-600">Já tem uma conta?</span>
        <LabelButton
          className="w-full h-12"
          variant="outline"
          label="Fazer login"
          icon={<LogIn className="text-gray-700" size={18} />}
        />
      </div>
    </>
  )
}
