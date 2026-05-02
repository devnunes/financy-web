import { enableMapSet } from 'immer'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { apolloClient } from '@/lib/graphql/apollo'
import { SIGN_IN } from '@/lib/graphql/mutations/signIn'
import { SIGN_OUT } from '@/lib/graphql/mutations/signOut'
import { SIGN_UP } from '@/lib/graphql/mutations/signUp'
import { ME } from '@/lib/graphql/queries/me'
import type { SignInInput, SignUpInput, User } from '@/types'

type SignUpMutationResponse = {
  signUp: {
    token: string
    refreshToken: string
    user: User
  }
}

type SignInMutationResponse = {
  signIn: {
    token: string
    refreshToken: string
    user: User
  }
}

type SignOutMutationResponse = {
  signout: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isCheckingSession: boolean
  syncSession: () => Promise<void>
  signUp: (data: SignUpInput) => Promise<void>
  signIn: (data: SignInInput) => Promise<void>
  signOut: () => Promise<void>
  handleUnauthorized: () => Promise<void>
}

type MeQueryResponse = {
  me: User
}

enableMapSet()

export const useAuthStore = create<AuthState>()(
  immer((set, _get) => {
    async function handleUnauthorized() {
      set(state => {
        state.user = null
        state.isAuthenticated = false
        state.isCheckingSession = false
      })

      try {
        await apolloClient.clearStore()
      } catch {
        // Keep local auth state cleared even if cache reset fails.
      }
    }

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
        if (!data?.signUp) throw new Error('SignUp failed')
        const { user } = data.signUp
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
        if (!data?.signIn) throw new Error('SignIn failed')
        const { user } = data.signIn
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

    async function signOut() {
      try {
        await apolloClient.mutate<SignOutMutationResponse>({
          mutation: SIGN_OUT,
        })
      } catch {
        // Ensure local logout even if API call fails.
      }

      await handleUnauthorized()
    }

    return {
      user: null,
      isAuthenticated: false,
      isCheckingSession: true,
      syncSession,
      signUp,
      signIn,
      signOut,
      handleUnauthorized,
    }
  })
)
