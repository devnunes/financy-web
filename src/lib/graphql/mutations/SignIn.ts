import { gql } from '@apollo/client'

export const SIGN_IN = gql`
  mutation SignIn($data: LoginInput!) {
    login(data: $data) {
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
