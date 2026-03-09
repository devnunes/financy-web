import { gql } from '@apollo/client'

export const SIGN_UP = gql`
  mutation SignUp($data: RegisterInput!) {
    register(data: $data) {
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
