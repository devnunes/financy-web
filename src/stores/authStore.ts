import { enableMapSet } from 'immer'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { apolloClient, configureApolloAuthHandlers } from '@/lib/graphql/apollo'
import { SIGN_IN } from '@/lib/graphql/mutations/signIn'
import { SIGN_OUT } from '@/lib/graphql/mutations/signOut'
import { SIGN_UP } from '@/lib/graphql/mutations/signUp'
import { ME } from '@/lib/graphql/queries/me'
import { REFRESH_TOKEN } from '@/lib/graphql/queries/refreshToken'
import type { SignInInput, SignUpInput, User } from '@/types'

type SignUpMutationResponse = {
  signUp: {
    user: User
  }
}

type SignInMutationResponse = {
  signIn: {
    user: User
  }
}

type SignOutMutationResponse = {
  signOut: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  refreshSession: () => Promise<void>
  isRefreshing: boolean
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

const useAuthStore = create<AuthState>()(
  immer((set, get) => {
    let refreshSessionInFlight: Promise<void> | null = null

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

    async function refreshSession() {
      if (refreshSessionInFlight) {
        return refreshSessionInFlight
      }

      refreshSessionInFlight = (async () => {
        set(state => {
          state.isRefreshing = true
        })

        try {
          await apolloClient.mutate({
            mutation: REFRESH_TOKEN,
          })

          await syncSession()

          if (!get().isAuthenticated) {
            throw new Error('Session refresh did not restore user session')
          }
        } catch (_error) {
          await handleUnauthorized()
        } finally {
          set(state => {
            state.isRefreshing = false
          })
          refreshSessionInFlight = null
        }
      })()

      return refreshSessionInFlight
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
        const userWithInitials = withInitials(user)
        set(state => {
          state.user = userWithInitials
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
      set(state => {
        state.isCheckingSession = true
      })
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
        const userWithInitials = withInitials(user)

        set(state => {
          state.user = userWithInitials
          state.isAuthenticated = true
          state.isCheckingSession = false
        })
      } catch (error) {
        throw new Error(
          'Login failed: ' +
            (error instanceof Error ? error.message : String(error))
        )
      } finally {
        set(state => {
          state.isCheckingSession = false
        })
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
      refreshSession,
      isRefreshing: false,
      isCheckingSession: true,
      syncSession,
      signUp,
      signIn,
      signOut,
      handleUnauthorized,
    }
  })
)

configureApolloAuthHandlers({
  getIsRefreshing: () => useAuthStore.getState().isRefreshing,
  refreshSession: () => useAuthStore.getState().refreshSession(),
})

export const useAuthUser = () => useAuthStore(state => state.user)

export const useAuthIsRefreshing = () =>
  useAuthStore(state => state.isRefreshing)

export const useAuthRefreshSession = () =>
  useAuthStore(state => state.refreshSession)

export const useAuthIsCheckingSession = () =>
  useAuthStore(state => state.isCheckingSession)

export const useAuthSignUp = () => useAuthStore(state => state.signUp)

export const useAuthSignIn = () => useAuthStore(state => state.signIn)

export const useAuthSignOut = () => useAuthStore(state => state.signOut)

export const useAuthSyncSession = () => useAuthStore(state => state.syncSession)

export const useAuthIsAuthenticated = () =>
  useAuthStore(state => state.isAuthenticated)
