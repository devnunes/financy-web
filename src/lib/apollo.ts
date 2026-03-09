import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'

const httpLink = new HttpLink({
  uri: 'http://localhost:3333/graphql',
  credentials: 'include',
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([httpLink]),
  cache: new InMemoryCache(),
})
