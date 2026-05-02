import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { CombinedGraphQLErrors } from '@apollo/client/errors'
import { ErrorLink } from '@apollo/client/link/error'

const unauthorizedListeners = new Set<() => void>()

function notifyUnauthorized() {
  for (const listener of unauthorizedListeners) {
    listener()
  }
}

export function subscribeUnauthorized(listener: () => void): () => void {
  unauthorizedListeners.add(listener)

  return () => {
    unauthorizedListeners.delete(listener)
  }
}

const graphqlUri = import.meta.env.VITE_GRAPHQL_URL || '/graphql'

const httpLink = new HttpLink({
  uri: graphqlUri,
  credentials: 'include',
})

const authErrorLink = new ErrorLink(({ error }) => {
  const hasUnauthorizedGraphQLError =
    CombinedGraphQLErrors.is(error) &&
    error.errors.some(graphqlError => graphqlError.message === 'Unauthorized')

  const hasUnauthorizedNetworkError =
    error instanceof Error &&
    (error.message.includes('401') || error.message.includes('Unauthorized'))

  if (hasUnauthorizedGraphQLError || hasUnauthorizedNetworkError) {
    notifyUnauthorized()
  }
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authErrorLink, httpLink]),
  cache: new InMemoryCache(),
})
