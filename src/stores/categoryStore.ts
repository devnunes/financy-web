import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { apolloClient } from '@/lib/graphql/apollo'
import { GET_CATEGORIES } from '@/lib/graphql/queries/getCategories'
import type { Category } from '@/types'

interface CategoryState {
  categories: Category[]
  loadCategories: () => Promise<void>
  isLoading: boolean
  hasLoaded: boolean
  error: string | null
}

type GetCategoriesQueryResponse = {
  getCategories: Category[]
}

export const categoryStore = create<CategoryState>(_set => ({
  categories: [],
  loadCategories: () => Promise.resolve(),
  isLoading: false,
  hasLoaded: false,
  error: null,
}))

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
      console.log('data.getCategories', data.getCategories)
      set(state => {
        state.categories = data.getCategories
        state.isLoading = false
        state.hasLoaded = true
      })
    }

    return {
      categories: [],
      loadCategories,
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

// storeCategories.map(category => {
//   const categoryTransactions = category.transactions ?? []
//   const expenseTransactions = categoryTransactions.filter(
//     transaction => transaction.type === 'expense'
//   )
//   const totalAmount = expenseTransactions.reduce(
//     (acc, transaction) => acc + transaction.amount,
//     0
//   )
//   const amountLabel = new Intl.NumberFormat('pt-BR', {
//     style: 'currency',
//     currency: 'BRL',
//   }).format(totalAmount)
//   const itemCount = categoryTransactions.length
//   const itemLabel = `${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`

//   return {
//     id: category.id,
//     name: category.title,
//     items: itemLabel,
//     amount: amountLabel,
//     categoryColor: category.color,
//   }
// })
