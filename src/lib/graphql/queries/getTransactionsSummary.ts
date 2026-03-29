import { gql } from '@apollo/client'

export const GET_TRANSACTIONS_SUMMARY = gql`
  query GetTransactionsSummary {
    getTransactionSummary {
      balance
      expense
      income
    }
  }
`
