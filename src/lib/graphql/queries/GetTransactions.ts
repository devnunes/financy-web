import { gql } from '@apollo/client'

export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    getTransactions {
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
export const GET_ONE_TRANSACTION = gql`
  query GetOneTransaction($data: GetOneTransactionInput!) {
    getOneTransaction(data: $data) {
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
