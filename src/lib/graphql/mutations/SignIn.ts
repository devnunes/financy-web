import { gql } from '@apollo/client'

export const SIGN_IN = gql`
  mutation SignIn($data: SignInInput!) {
    signIn(data: $data) {
      token
      refreshToken
      user {
        id
        name
        email
        createdAt
        updatedAt
      }
    }
  }
`
