import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { apolloClient } from '@/lib/graphql/apollo'
import { GET_CATEGORIES_SUMMARY } from '@/lib/graphql/queries/getCategoriesSummary'
import type { CategoriesSummary } from '@/types'

interface CategoryState {
  categoriesSummary: CategoriesSummary
  loadCategoriesSummary: () => Promise<void>
  isLoading: boolean
  hasLoaded: boolean
  error: string | null
}

type GetCategoriesSummaryQueryResponse = {
  getCategoriesSummary: CategoriesSummary
}

const useCategorySummaryStore = create<CategoryState>()(
  immer((set, get) => {
    async function loadCategoriesSummary() {
      const { isLoading, hasLoaded } = get()
      if (isLoading || hasLoaded) return

      set(state => {
        state.isLoading = true
        state.error = null
      })

      const { data } =
        await apolloClient.query<GetCategoriesSummaryQueryResponse>({
          query: GET_CATEGORIES_SUMMARY,
          fetchPolicy: 'network-only',
        })

      if (!data?.getCategoriesSummary)
        throw new Error('No categories data received')
      set(state => {
        state.categoriesSummary = data.getCategoriesSummary
        state.isLoading = false
        state.hasLoaded = true
      })
    }

    return {
      categoriesSummary: {
        transactionCountByUser: 0,
        categoryCount: 0,
        categories: [],
      },
      loadCategoriesSummary,
      isLoading: false,
      hasLoaded: false,
      error: null,
    }
  })
)

export const useCategoriesSummary = () =>
  useCategorySummaryStore(state => state.categoriesSummary)
export const useLoadCategoriesSummary = () =>
  useCategorySummaryStore(state => state.loadCategoriesSummary)
export const useCategoriesIsLoading = () =>
  useCategorySummaryStore(state => state.isLoading)
