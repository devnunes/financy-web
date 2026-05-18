import { gql, type TypedDocumentNode } from '@apollo/client'
import type { Transaction } from '@/types'

type TransactionsQueryVariables = {
  data: {
    max?: number
  }
}

export const TRANSACTIONS: TypedDocumentNode<
  {
    transactions: Transaction[]
  },
  TransactionsQueryVariables
> = gql`
  query Transactions($data: TransactionsFilterInput!) {
    transactions(data: $data) {
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

export const TRANSACTIONS_ALL_VARIABLES: TransactionsQueryVariables = {
  data: {},
}

export const TRANSACTIONS_RECENT_VARIABLES: TransactionsQueryVariables = {
  data: { max: 5 },
}

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
