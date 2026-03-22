import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { apolloClient } from '@/lib/graphql/apollo'
import { SIGN_IN } from '@/lib/graphql/mutations/SignIn'
import { SIGN_UP } from '@/lib/graphql/mutations/SignUp'
import { ME } from '@/lib/graphql/queries/Me'
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

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isCheckingSession: boolean
  syncSession: () => Promise<void>
  signUp: (data: SignUpInput) => Promise<void>
  signIn: (data: SignInInput) => Promise<void>
  signOut: () => Promise<void>
}

type MeQueryResponse = {
  me: User
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map(namePart => namePart[0])
    .join('')
    .toUpperCase()
}

function withInitials(user: User): User {
  return {
    ...user,
    initials: getInitials(user.name),
  }
}

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
        const user = withInitials(data.me)

        set(state => {
          state.user = user
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
        const user = withInitials(data.signUp.user)

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
        const user = withInitials(data.signIn.user)

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

    async function signOut() {
      set(state => {
        state.user = null
        state.isAuthenticated = false
        state.isCheckingSession = false
      })

      try {
        await apolloClient.clearStore()
      } catch {
        // Keep the user signed out locally even if cache clearing fails.
      }
    }

    return {
      user: null,
      isAuthenticated: false,
      isCheckingSession: true,
      syncSession,
      signUp,
      signIn,
      signOut,
    }
  })
)
