import { create } from 'zustand'
import type { Transaction } from '@/types'

interface TransactionState {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
}
export const transactionStore = create<TransactionState>(_set => ({
  transactions: [],
  isLoading: false,
  error: null,
}))
