import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { apolloClient } from '@/lib/graphql/apollo'
import { CREATE_CATEGORY } from '@/lib/graphql/mutations/createCategory'
import { GET_CATEGORIES } from '@/lib/graphql/queries/getCategories'
import type { Category } from '@/types'

type CreateCategoryInput = {
  title: string
  description: string
  color: string
  icon: string
}
interface CategoryState {
  categories: Category[]
  loadCategories: () => Promise<void>
  createCategory: (data: CreateCategoryInput) => Promise<void>
  isLoading: boolean
  hasLoaded: boolean
  error: string | null
}

type GetCategoriesQueryResponse = {
  getCategories: Category[]
}

const useCategoryStore = create<CategoryState>()(
  immer((set, get) => {
    async function loadCategories() {
      const { isLoading, hasLoaded } = get()
      if (isLoading || hasLoaded) return

      set(state => {
        state.isLoading = true
        state.error = null
      })

      const { data } = await apolloClient.query<GetCategoriesQueryResponse>({
        query: GET_CATEGORIES,
        fetchPolicy: 'network-only',
      })

      if (!data?.getCategories) throw new Error('No categories data received')
      set(state => {
        state.categories = data.getCategories
        state.isLoading = false
        state.hasLoaded = true
      })
    }

    async function createCategory(createCategoryInput: CreateCategoryInput) {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_CATEGORY,
        variables: { data: createCategoryInput },
      })
      if (!data) throw new Error('No category data received')
      console.log('data.createCategory', data, typeof data)
    }

    return {
      categories: [],
      loadCategories,
      createCategory,
      isLoading: false,
      hasLoaded: false,
      error: null,
    }
  })
)

export const useCategories = () => useCategoryStore(state => state.categories)
export const useLoadCategories = () =>
  useCategoryStore(state => state.loadCategories)
export const useCategoriesIsLoading = () =>
  useCategoryStore(state => state.isLoading)
