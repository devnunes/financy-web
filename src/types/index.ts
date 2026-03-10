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
  description: string
  type: 'income' | 'expense'
  date: string
  userId: string
  categoryId: string
  createdAt?: string
  updatedAt?: string
  user?: User
  category?: Category
}

export type TagColor =
  | 'gray'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'

interface Category {
  id: string
  title: string
  description: string
  icon: string
  color: TagColor
  userId: string
  createdAt?: string
  updatedAt?: string
  user?: User
  transactions?: Transaction[]
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
