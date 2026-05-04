import type { IconName } from '@/components/Icon'

export interface User {
  id: string
  name: string
  email: string
  initials?: string
  createdAt?: string
  updatedAt?: string
}

export interface Transaction {
  id: string
  amount: number
  amountLabel?: string
  description: string
  type: 'income' | 'expense'
  date: string
  dateLabel?: string
  userId: string
  categoryId: string
  createdAt?: string
  updatedAt?: string
  user?: User
  category?: Category
}

export type TagColor =
  | 'transparent'
  | 'gray'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'

export interface Category {
  id: string
  title: string
  description: string
  icon: IconName
  color: TagColor
  userId: string
  createdAt?: string
  updatedAt?: string
  user?: User
  transactions?: Transaction[]
}

export interface CategoriesSummary {
  id: string
  title: string
  totalAmount: number
  transactionCount: number
  color: TagColor
}

export interface SignUpInput {
  name: string
  email: string
  password: string
}

export interface SignInInput {
  email: string
  password: string
}
