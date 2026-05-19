import { gql, type TypedDocumentNode } from '@apollo/client'

type TransactionMutationPayload = {
  id: string
}

type CreateTransactionInput = {
  amount: number
  description: string
  type: 'income' | 'expense'
  categoryId: string
  date: Date
}

type UpdateTransactionInput = {
  id: string
  amount?: number
  description?: string
  type?: 'income' | 'expense'
  categoryId?: string
  date?: Date
}

type CreateTransactionMutationVariables = {
  data: CreateTransactionInput
}

type UpdateTransactionMutationVariables = {
  data: UpdateTransactionInput
}

type DeleteTransactionMutationVariables = {
  id: string
}

export const CREATE_TRANSACTION: TypedDocumentNode<
  { createTransaction: TransactionMutationPayload },
  CreateTransactionMutationVariables
> = gql`
  mutation CreateTransaction($data: CreateTransactionInput!) {
    createTransaction(data: $data) {
      id
    }
  }
`

export const UPDATE_TRANSACTION: TypedDocumentNode<
  { updateTransaction: TransactionMutationPayload },
  UpdateTransactionMutationVariables
> = gql`
  mutation UpdateTransaction($data: UpdateTransactionInput!) {
    updateTransaction(data: $data) {
      id
    }
  }
`

export const DELETE_TRANSACTION: TypedDocumentNode<
  { deleteTransaction: boolean },
  DeleteTransactionMutationVariables
> = gql`
  mutation DeleteTransaction($id: String!) {
    deleteTransaction(id: $id)
  }
`
