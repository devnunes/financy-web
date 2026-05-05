import { gql } from '@apollo/client'

export const GET_CATEGORIES_SUMMARY = gql`
  query GetCategorySummary {
    getCategoriesSummary {
      transactionCountByUser
      categoryCount
      categories {
        id
        title
        color
        totalAmount
        transactionCountByCategory
      }
    }
  }
`
