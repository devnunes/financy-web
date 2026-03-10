import { create } from 'zustand'
import type { Category } from '@/types'

interface CategoryState {
  categories: Category[]
  isLoading: boolean
  error: string | null
}
export const categoryStore = create<CategoryState>(_set => ({
  categories: [],
  isLoading: false,
  error: null,
}))
