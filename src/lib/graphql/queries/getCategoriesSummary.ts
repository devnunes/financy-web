import { gql } from '@apollo/client'

export const GET_CATEGORIES_SUMMARY = gql`
  query GetCategorySummary {
    getCategoriesSummary {
      id
      title
      totalAmount
      transactionCount
      color
    }
  }
`
