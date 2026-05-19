import { gql, type TypedDocumentNode } from '@apollo/client'
import type { Category } from '@/types'

type CategoryMutationPayload = Pick<
  Category,
  'id' | 'title' | 'description' | 'icon' | 'color'
>

type CreateCategoryMutationVariables = {
  data: {
    title: string
    description?: string
    icon: string
    color: Category['color']
  }
}

type UpdateCategoryMutationVariables = {
  data: {
    id: string
  } & Partial<Pick<Category, 'title' | 'description' | 'icon' | 'color'>>
}

type DeleteCategoryMutationVariables = {
  id: string
}

export const CREATE_CATEGORY: TypedDocumentNode<
  { createCategory: CategoryMutationPayload },
  CreateCategoryMutationVariables
> = gql`
  mutation CreateCategory($data: CreateCategoryInput!) {
    createCategory(data: $data) {
      id
      title
      description
      icon
      color
    }
  }
`

export const UPDATE_CATEGORY: TypedDocumentNode<
  { updateCategory: CategoryMutationPayload },
  UpdateCategoryMutationVariables
> = gql`
  mutation UpdateCategory($data: UpdateCategoryInput!) {
    updateCategory(data: $data) {
      id
      title
      description
      icon
      color
    }
  }
`

export const DELETE_CATEGORY: TypedDocumentNode<
  { deleteCategory: boolean },
  DeleteCategoryMutationVariables
> = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id)
  }
`
