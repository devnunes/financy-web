import { enableMapSet } from 'immer'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { apolloClient } from '@/lib/graphql/apollo'
import { SIGN_IN } from '@/lib/graphql/mutations/SignIn'
import { SIGN_UP } from '@/lib/graphql/mutations/SignUp'
import { ME } from '@/lib/graphql/queries/Me'
import type { SignInInput, SignUpInput, User } from '@/types'

type SignUpMutationResponse = {
  register: {
    token: string
    refreshToken: string
    user: User
  }
}

type SignInMutationResponse = {
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
  signUp: (data: SignUpInput) => Promise<void>
  signIn: (data: SignInInput) => Promise<void>
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

    async function signUp(signUpData: SignUpInput) {
      try {
        const { data } = await apolloClient.mutate<
          SignUpMutationResponse,
          { data: SignUpInput }
        >({
          mutation: SIGN_UP,
          variables: {
            data: {
              name: signUpData.name,
              email: signUpData.email,
              password: signUpData.password,
            },
          },
        })
        if (!data?.register) throw new Error('SignUp failed')
        const { user } = data.register
        set(state => {
          state.user = user
          state.isAuthenticated = true
          state.isCheckingSession = false
        })
      } catch (error) {
        throw new Error(
          'SignUp failed: ' +
            (error instanceof Error ? error.message : String(error))
        )
      }
    }

    async function signIn(signInData: SignInInput) {
      try {
        const { data } = await apolloClient.mutate<
          SignInMutationResponse,
          { data: SignInInput }
        >({
          mutation: SIGN_IN,
          variables: {
            data: {
              email: signInData.email,
              password: signInData.password,
            },
          },
        })
        if (!data?.login) throw new Error('SignIn failed')
        const { user } = data.login
        set(state => {
          state.user = user
          state.isAuthenticated = true
          state.isCheckingSession = false
        })
      } catch (error) {
        throw new Error(
          'SignIn failed: ' +
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
