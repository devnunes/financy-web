import { gql, type TypedDocumentNode } from '@apollo/client'
import type { CategoriesAggregated, Category } from '@/types'

export const CATEGORIES: TypedDocumentNode<{ categories: Category[] }> = gql`
  query Categories {
    categories {
      id
      title
      description
      icon
      color
      userId
      createdAt
      updatedAt
      transactionCount
    }
  }
`

export const CATEGORIES_SUMMARY: TypedDocumentNode<{
  categoriesSummary: {
    transactionCountByUser: number
    categoryCount: number
    categories: CategoriesAggregated[]
    mostUsedCategory: Pick<Category, 'title' | 'icon' | 'color'> | null
  }
}> = gql`
  query CategoriesSummary {
    categoriesSummary {
      transactionCountByUser
      categoryCount
      categories {
        id
        title
        color
        totalAmount
        transactionCountByCategory
      }
      mostUsedCategory {
        title
        icon
        color
      }
    }
  }
`
