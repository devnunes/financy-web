import { gql, type TypedDocumentNode } from '@apollo/client'
import type { AuthInput, AuthOutput } from '@/types'

export const SIGN_UP: TypedDocumentNode<
  { signUp: AuthOutput },
  { data: AuthInput }
> = gql`
  mutation SignUp($data: AuthInput!) {
    signUp(data: $data) {
      id
      name
      email
    }
  }
`

export const SIGN_OUT = gql`
  mutation SignOut {
    signOut
  }
`

export const SIGN_IN: TypedDocumentNode<
  { signIn: AuthOutput },
  { data: AuthInput }
> = gql`
  mutation SignIn($data: AuthInput!) {
    signIn(data: $data) {
      id
      email
      name
    }
  }
`
