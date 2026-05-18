import { gql, type TypedDocumentNode } from '@apollo/client'
import type { Transaction } from '@/types'

export const TRANSACTIONS: TypedDocumentNode<{
  transactions: Transaction[]
}> = gql`
  query Transactions {
    transactions {
      id
      description
      amount
      date
      type
      categoryId
      userId
      category {
        title
        icon
        color
      }
    }
  }
`
export const TRANSACTION: TypedDocumentNode<
  { transaction: Transaction },
  { data: { id: string } }
> = gql`
  query Transaction($data: GetOneTransactionInput!) {
    transaction(data: $data) {
      id
      description
      amount
      date
      type
      category {
        title
        icon
        color
      }
    }
  }
`
