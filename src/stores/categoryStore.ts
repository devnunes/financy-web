import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { categoryEntitySchema } from '@/lib/schemas/categories'
import type { Category } from '@/types'

interface CategoryState {
  selectedCategory: Category | null
  setSelectedCategory: (category: Category | null) => void
  clearSelectedCategory: () => void
}

const useCategoryStore = create<CategoryState>()(
  immer(set => {
    function setSelectedCategory(category: Category | null) {
      if (!category) {
        set(state => {
          state.selectedCategory = null
        })
        return
      }

      try {
        const parsedCategory = categoryEntitySchema.parse(category)
        set(state => {
          state.selectedCategory = parsedCategory as Category
        })
      } catch (error) {
        console.error('Erro ao definir a categoria selecionada:', error)
      }
    }

    function clearSelectedCategory() {
      set(state => {
        state.selectedCategory = null
      })
    }

    return {
      selectedCategory: null,
      setSelectedCategory,
      clearSelectedCategory,
    }
  })
)

export const useSelectedCategory = () =>
  useCategoryStore(state => state.selectedCategory)

export const useSetSelectedCategory = () =>
  useCategoryStore(state => state.setSelectedCategory)

export const useClearSelectedCategory = () =>
  useCategoryStore(state => state.clearSelectedCategory)
