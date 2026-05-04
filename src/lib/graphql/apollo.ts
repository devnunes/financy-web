import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import {
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
} from '@apollo/client/errors'
import { ErrorLink } from '@apollo/client/link/error'

type ApolloAuthHandlers = {
  getIsRefreshing: () => boolean
  refreshSession: () => Promise<void>
}

let apolloAuthHandlers: ApolloAuthHandlers = {
  getIsRefreshing: () => false,
  refreshSession: async () => {},
}

export function configureApolloAuthHandlers(handlers: ApolloAuthHandlers) {
  apolloAuthHandlers = handlers
}

const AUTH_OPERATIONS_TO_SKIP_REFRESH = new Set([
  'SignIn',
  'SignUp',
  'RefreshToken',
  'SignOut',
])

const UNAUTHORIZED_GRAPHQL_CODES = new Set([
  'UNAUTHENTICATED',
  'UNAUTHORIZED',
  'FORBIDDEN',
])

const authErrorLink = new ErrorLink(({ error, operation }) => {
  const hasUnauthorizedGraphQLError =
    CombinedGraphQLErrors.is(error) &&
    error.errors.some(graphqlError => {
      const code = String(graphqlError.extensions?.code || '').toUpperCase()
      const message = graphqlError.message.toLowerCase()

      return (
        UNAUTHORIZED_GRAPHQL_CODES.has(code) ||
        message.includes('unauthorized') ||
        message.includes('unauthenticated') ||
        message.includes('forbidden')
      )
    })

  const hasUnauthorizedNetworkError =
    (CombinedProtocolErrors.is(error) || error instanceof Error) &&
    (error.message.includes('401') ||
      error.message.toLowerCase().includes('unauthorized'))

  const shouldHandleUnauthorized = !AUTH_OPERATIONS_TO_SKIP_REFRESH.has(
    operation.operationName || ''
  )

  if (
    shouldHandleUnauthorized &&
    (hasUnauthorizedGraphQLError || hasUnauthorizedNetworkError)
  ) {
    const isRefreshing = apolloAuthHandlers.getIsRefreshing()

    if (!isRefreshing) {
      void apolloAuthHandlers.refreshSession()
    }
  }
})

const graphqlUri = import.meta.env.VITE_GRAPHQL_URL || '/graphql'

const httpLink = new HttpLink({
  uri: graphqlUri,
  credentials: 'include',
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authErrorLink, httpLink]),
  cache: new InMemoryCache(),
})
