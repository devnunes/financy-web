import { gql, type TypedDocumentNode } from '@apollo/client'
import type { UserBalance } from '@/types'

export const USER_BALANCE: TypedDocumentNode<{ userBalance: UserBalance }> =
  gql`
  query UserBalance {
    userBalance {
      balance
      income
      expenses
    }
  }
`
