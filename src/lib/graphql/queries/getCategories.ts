import { gql } from '@apollo/client'

export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      title
      description
      icon
      color
      userId
      createdAt
      updatedAt
    }
  }
`
