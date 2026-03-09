import { enableMapSet } from 'immer'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { apolloClient } from '@/lib/graphql/apollo'
import { LOGIN } from '@/lib/graphql/mutations/Login'
import { REGISTER } from '@/lib/graphql/mutations/Register'
import { ME } from '@/lib/graphql/queries/Me'
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
  isCheckingSession: boolean
  syncSession: () => Promise<void>
  signUp: (data: RegisterInput) => Promise<void>
  signIn: (data: LoginInput) => Promise<void>
}

type MeQueryResponse = {
  me: User
}

enableMapSet()

export const useAuthStore = create<AuthState>()(
  immer((set, _get) => {
    async function syncSession() {
      set(state => {
        state.isCheckingSession = true
      })

      try {
        const { data } = await apolloClient.query<MeQueryResponse>({
          query: ME,
          fetchPolicy: 'network-only',
        })

        if (!data?.me) {
          throw new Error('Session not found')
        }

        set(state => {
          state.user = data.me
          state.isAuthenticated = true
        })
      } catch {
        set(state => {
          state.user = null
          state.isAuthenticated = false
        })
      } finally {
        set(state => {
          state.isCheckingSession = false
        })
      }
    }

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
          state.isCheckingSession = false
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
          state.isCheckingSession = false
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
      isCheckingSession: true,
      syncSession,
      signUp,
      signIn,
    }
  })
)
