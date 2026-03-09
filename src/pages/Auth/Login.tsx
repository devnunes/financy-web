import { zodResolver } from '@hookform/resolvers/zod'
import { EyeClosed, Lock, Mail, UserRoundPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod/v4'
import Logo from '@/assets/images/Logo.svg'
import CustomLink from '@/components/ui/CustomLink'
import { Input } from '@/components/ui/Input'
import { LabelButton } from '@/components/ui/LabelButton'

const loginSchema = z.object({
  email: z.email({ message: 'Digite um email válido' }),
  password: z
    .string()
    .min(8, { message: 'A senha deve conter no mínimo 8 caracteres' }),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = (data: LoginFormData) => {
    console.log('Login data:', data, errors)
  }

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
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4 w-full"
        >
          <Input
            label="Email"
            type="email"
            placeholder="mail@example.com"
            leftIcon={
              <Mail
                className={errors.email ? 'text-danger' : 'text-gray-400'}
                size={16}
              />
            }
            state={errors.email ? 'error' : 'default'}
            errorText={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            leftIcon={
              <Lock
                className={errors.password ? 'text-danger' : 'text-gray-400'}
                size={16}
              />
            }
            rightIcon={<EyeClosed size={16} />}
            state={errors.password ? 'error' : 'default'}
            errorText={errors.password?.message}
            {...register('password')}
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
          <div className="flex flex-col items-center gap-6 w-full my-6">
            <LabelButton type="submit" className="w-full h-12" label="Entrar" />
            <div className="flex items-center justify-center gap-3 w-full">
              <div className="h-px border-t border-gray-300 flex-1" />
              <span className="text-sm leading-5 text-gray-500">ou</span>
              <div className="h-px border-t border-gray-300 flex-1" />
            </div>
          </div>
        </form>
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
