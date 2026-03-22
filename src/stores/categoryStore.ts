import { create } from 'zustand'
import type { CategoriesSummary, Category } from '@/types'

interface CategoryState {
  categories: Category[]
  categoriesSummary: CategoriesSummary[]
  isLoading: boolean
  error: string | null
}

export const categoryStore = create<CategoryState>(_set => ({
  categories: [],
  categoriesSummary: [],
  isLoading: false,
  error: null,
}))

// storeCategories.map(category => {
//           const categoryTransactions = category.transactions ?? []
//           const expenseTransactions = categoryTransactions.filter(
//             transaction => transaction.type === 'expense'
//           )
//           const totalAmount = expenseTransactions.reduce(
//             (acc, transaction) => acc + transaction.amount,
//             0
//           )
//           const amountLabel = new Intl.NumberFormat('pt-BR', {
//             style: 'currency',
//             currency: 'BRL',
//           }).format(totalAmount)
//           const itemCount = categoryTransactions.length
//           const itemLabel = `${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`

//           return {
//             id: category.id,
//             name: category.title,
//             items: itemLabel,
//             amount: amountLabel,
//             categoryColor: category.color,
//           }
//         })
