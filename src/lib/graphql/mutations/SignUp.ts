import { gql } from '@apollo/client'

export const SIGN_UP = gql`
  mutation SignUp($data: SignUpInput!) {
    signUp(data: $data) {
      token
      refreshToken
      user {
        id
        name
        email
      }
    }
  }
`
