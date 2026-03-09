export interface User {
  id: string
  name: string
  email: string
  initials?: string
  createdAt?: string
  updatedAt?: string
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
