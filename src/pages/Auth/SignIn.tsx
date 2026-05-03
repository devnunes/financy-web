import { zodResolver } from '@hookform/resolvers/zod'
import { EyeClosed, Lock, Mail, UserRoundPlus } from 'lucide-react'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod/v4'
import Logo from '@/assets/images/Logo.svg'
import { FormInput } from '@/components/FormInput'
import CustomLink from '@/components/ui/CustomLink'
import { LabelButton } from '@/components/ui/LabelButton'
import { useAuthStore } from '@/stores/authStore'

const signInSchema = z.object({
  email: z.email({ message: 'Digite um email válido' }),
  password: z
    .string()
    .min(8, { message: 'A senha deve conter no mínimo 8 caracteres' }),
})

type SignInFormData = z.infer<typeof signInSchema>

export default function SignIn() {
  const [loading, setLoading] = React.useState(false)
  const signIn = useAuthStore(state => state.signIn)
  const form = useForm<SignInFormData>({ resolver: zodResolver(signInSchema) })
  const {
    handleSubmit,
    formState: { errors },
  } = form

  const onSubmit = (data: SignInFormData) => {
    setLoading(true)
    signIn(data)
      .then(() => {
        console.info('SignIn successful')
      })
      .catch(error => {
        // Mostrar mensagem de erro
        console.error('SignIn failed:', error)
      })
      .finally(() => setLoading(false))
  }

  return (
    <>
      <img src={Logo} alt="Logo" className="mb-8 h-8" />
      <div className="flex flex-col items-center justify-start p-8 bg-white border-0 border-gray-200 rounded-lg w-md">
        <div className="flex flex-col items-center gap-1 mb-8">
          <span className="text-xl font-extrabold">Fazer login</span>
          <span className="text-base text-gray-600">
            Entre na sua conta para continuar
          </span>
        </div>
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-4 w-full"
          >
            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="mail@example.com"
              leftIcon={
                <Mail
                  className={errors.email ? 'text-danger' : 'text-gray-400'}
                  size={16}
                />
              }
            />
            <FormInput
              name="password"
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
            />
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1 text-sm text-gray-700 self-start cursor-pointer">
                <input type="checkbox" />
                Lembrar-me
              </span>
              <CustomLink
                to="/recuperar-senha"
                className="text-sm self-end cursor-pointer"
                text="Recuperar senha"
              />
            </div>
            <div className="flex flex-col items-center gap-6 w-full my-6">
              <LabelButton
                type="submit"
                className="w-full h-12"
                label="Entrar"
                disabled={loading}
              />
              <div className="flex items-center justify-center gap-3 w-full">
                <div className="h-px border-t border-gray-300 flex-1" />
                <span className="text-sm leading-5 text-gray-500">ou</span>
                <div className="h-px border-t border-gray-300 flex-1" />
              </div>
            </div>
          </form>
        </FormProvider>
        <span className="mb-4 text-sm text-gray-600">
          Ainda não tem uma conta?
        </span>
        <Link className="w-full h-12" to="/sign-up">
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
