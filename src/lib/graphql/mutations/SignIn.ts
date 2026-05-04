import { gql } from '@apollo/client'

export const SIGN_IN = gql`
  mutation SignIn($data: SignInInput!) {
    signIn(data: $data) {
      user {
        id
        name
        email
      }
    }
  }
`
