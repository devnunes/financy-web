import { zodResolver } from '@hookform/resolvers/zod'
import { EyeClosed, Lock, LogIn, Mail, User } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod/v4'
import Logo from '@/assets/images/Logo.svg'
import { Input } from '@/components/ui/Input'
import { LabelButton } from '@/components/ui/LabelButton'
import { useAuthStore } from '@/stores/authStore'

const signUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'O nome deve conter no mínimo 2 caracteres' }),
  email: z.email({ message: 'Digite um email válido' }),
  password: z
    .string()
    .min(8, { message: 'A senha deve conter no mínimo 8 caracteres' }),
})

type SignUpFormData = z.infer<typeof signUpSchema>

export default function SignUp() {
  const [loading, setLoading] = React.useState(false)
  const signUp = useAuthStore(state => state.signUp)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({ resolver: zodResolver(signUpSchema) })

  const onSubmit = (data: SignUpFormData) => {
    setLoading(true)
    signUp(data)
      .then(() => {
        // Redirecionar ou mostrar mensagem de sucesso
      })
      .catch(error => {
        // Mostrar mensagem de erro
        console.error('SignUp failed:', error)
      })
      .finally(() => setLoading(false))
  }
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
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Input
            state={errors.name ? 'error' : 'default'}
            label="Nome Completo"
            type="text"
            placeholder="Seu nome completo"
            leftIcon={<User className="text-gray-400" size={16} />}
            errorText={errors.name?.message}
            {...register('name')}
          />
          <Input
            state={errors.email ? 'error' : 'default'}
            label="Email"
            type="email"
            placeholder="mail@example.com"
            leftIcon={<Mail className="text-gray-400" size={16} />}
            errorText={errors.email?.message}
            {...register('email')}
          />
          <Input
            state={errors.password ? 'error' : 'default'}
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            helperText="A senha deve ter no mínimo 8 caracteres"
            leftIcon={<Lock className="text-gray-400" size={16} />}
            rightIcon={<EyeClosed size={16} />}
            errorText={errors.password?.message}
            {...register('password')}
          />
          <div className="flex flex-col items-center gap-6 w-full my-6">
            <LabelButton
              type="submit"
              className="w-full h-12"
              label="Cadastrar"
              disabled={loading}
            />
            <div className="flex items-center justify-center gap-3 w-full">
              <div className="h-px border-t border-gray-300 flex-1" />
              <span className="text-sm leading-5 text-gray-500">ou</span>
              <div className="h-px border-t border-gray-300 flex-1" />
            </div>
          </div>
        </form>
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
