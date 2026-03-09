import { enableMapSet } from 'immer'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { apolloClient } from '@/lib/apollo'
import { LOGIN } from '@/lib/graphql/mutations/Login'
import { REGISTER } from '@/lib/graphql/mutations/Register'
import type { LoginInput, RegisterInput, User } from '@/types'

type RegisterMutationResponse = {
  register: {
    token: string
    refreshToken: string
    user: User
  }
}

type LoginMutationResponse = {
  login: {
    token: string
    refreshToken: string
    user: User
  }
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  signUp: (data: RegisterInput) => Promise<void>
  signIn: (data: LoginInput) => Promise<void>
}

enableMapSet()

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, _get) => {
      async function signUp(registerData: RegisterInput) {
        try {
          const { data } = await apolloClient.mutate<
            RegisterMutationResponse,
            { data: RegisterInput }
          >({
            mutation: REGISTER,
            variables: {
              data: {
                name: registerData.name,
                email: registerData.email,
                password: registerData.password,
              },
            },
          })
          if (!data?.register) throw new Error('Registration failed')
          const { user } = data.register
          set(state => {
            state.user = user
            state.isAuthenticated = true
          })
        } catch (error) {
          throw new Error(
            'Registration failed: ' +
              (error instanceof Error ? error.message : String(error))
          )
        }
      }

      async function signIn(loginData: LoginInput) {
        try {
          const { data } = await apolloClient.mutate<
            LoginMutationResponse,
            { data: LoginInput }
          >({
            mutation: LOGIN,
            variables: {
              data: {
                email: loginData.email,
                password: loginData.password,
              },
            },
          })
          if (!data?.login) throw new Error('Login failed')
          const { user } = data.login
          set(state => {
            state.user = user
            state.isAuthenticated = true
          })
        } catch (error) {
          throw new Error(
            'Login failed: ' +
              (error instanceof Error ? error.message : String(error))
          )
        }
      }

      return {
        user: null,
        isAuthenticated: false,
        signUp,
        signIn,
      }
    }),
    {
      name: 'financy-auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
