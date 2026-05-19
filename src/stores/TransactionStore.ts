import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { transactionEntitySchema } from '@/lib/schemas/transaction'
import type { Transaction } from '@/types'

interface TransactionState {
  selectedTransaction: Transaction | null
  setSelectedTransaction: (transaction: Transaction | null) => void
  clearSelectedTransaction: () => void
}

const useTransactionStore = create<TransactionState>()(
  immer(set => {
    function setSelectedTransaction(transaction: Transaction | null) {
      if (!transaction) {
        set(state => {
          state.selectedTransaction = null
        })
        return
      }

      try {
        const parsedTransaction = transactionEntitySchema.parse(transaction)
        set(state => {
          state.selectedTransaction = parsedTransaction as Transaction
        })
      } catch (error) {
        console.error('Erro ao definir a transação selecionada:', error)
      }
    }

    function clearSelectedTransaction() {
      set(state => {
        state.selectedTransaction = null
      })
    }

    return {
      selectedTransaction: null,
      setSelectedTransaction,
      clearSelectedTransaction,
    }
  })
)

export const useSelectedTransaction = () =>
  useTransactionStore(state => state.selectedTransaction)

export const useSetSelectedTransaction = () =>
  useTransactionStore(state => state.setSelectedTransaction)

export const useClearSelectedTransaction = () =>
  useTransactionStore(state => state.clearSelectedTransaction)
