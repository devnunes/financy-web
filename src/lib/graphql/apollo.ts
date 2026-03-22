import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'

const graphqlUri = import.meta.env.VITE_GRAPHQL_URL || '/graphql'

const httpLink = new HttpLink({
  uri: graphqlUri,
  credentials: 'include',
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([httpLink]),
  cache: new InMemoryCache(),
})
