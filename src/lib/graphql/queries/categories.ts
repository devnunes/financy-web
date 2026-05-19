import { gql, type TypedDocumentNode } from '@apollo/client'
import type { CategoriesAggregated, Category } from '@/types'

type CategoriesQueryVariables = {
  data: {
    max?: number
  }
}

export const CATEGORIES: TypedDocumentNode<
  { categories: Category[] },
  CategoriesQueryVariables
> = gql`
  query Categories($data: CategoriesFilterInput!) {
    categories(data: $data) {
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

export const CATEGORIES_FILTER_OPTIONS: TypedDocumentNode<
  { categories: Pick<Category, 'id' | 'title'>[] },
  CategoriesQueryVariables
> = gql`
  query CategoriesFilterOptions($data: CategoriesFilterInput!) {
    categories(data: $data) {
      id
      title
    }
  }
`

export const CATEGORIES_ALL_VARIABLES: CategoriesQueryVariables = {
  data: {},
}

export const CATEGORIES_RECENT_VARIABLES: CategoriesQueryVariables = {
  data: { max: 5 },
}

export const CATEGORIES_SUMMARY: TypedDocumentNode<
  {
    categoriesSummary: {
      transactionCountByUser: number
      categoryCount: number
      categories: CategoriesAggregated[]
      mostUsedCategory: Pick<Category, 'title' | 'icon' | 'color'> | null
    }
  },
  CategoriesQueryVariables
> = gql`
  query CategoriesSummary($data: CategoriesFilterInput!) {
    categoriesSummary(data: $data) {
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
export const CATEGORIES_SUMMARY_VARIABLES = {
  data: {
    max: 5, // Ajuste para garantir que o argumento obrigatório seja enviado corretamente
  },
}
