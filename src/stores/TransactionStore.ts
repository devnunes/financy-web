import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { apolloClient } from '@/lib/graphql/apollo'
import { GET_TRANSACTIONS } from '@/lib/graphql/queries/GetTransactions'
import type { Transaction } from '@/types'

interface TransactionState {
  transactions: Transaction[]
  loadTransactions: () => Promise<void>

  isLoading: boolean
  hasLoaded: boolean
  error: string | null
}

type GetTransactionsQueryResponse = {
  getTransactions: Transaction[]
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatTransaction(transaction: Transaction): Transaction {
  const parsedDate = new Date(transaction.date)

  return {
    ...transaction,
    amountLabel: currencyFormatter.format(transaction.amount / 100),
    dateLabel: Number.isNaN(parsedDate.getTime())
      ? transaction.date
      : dateFormatter.format(parsedDate),
  }
}

const useTransactionStore = create<
  TransactionState,
  [['zustand/immer', never]]
>(
  immer((set, get) => {
    async function loadTransactions() {
      const { isLoading, hasLoaded } = get()
      if (isLoading || hasLoaded) return

      set(state => {
        state.isLoading = true
        state.error = null
      })

      try {
        const { data } = await apolloClient.query<GetTransactionsQueryResponse>(
          {
            query: GET_TRANSACTIONS,
            fetchPolicy: 'network-only',
          }
        )

        if (!data?.getTransactions)
          throw new Error('No transactions data received')

        set(state => {
          state.transactions = data.getTransactions.map(formatTransaction)
          state.hasLoaded = true
        })
      } catch (error) {
        set(state => {
          state.error =
            error instanceof Error
              ? error.message
              : 'Failed to load transactions'
        })
      } finally {
        set(state => {
          state.isLoading = false
        })
      }
    }

    return {
      transactions: [],
      loadTransactions,
      isLoading: false,
      hasLoaded: false,
      error: null,
    }
  })
)

export const useTransactions = () =>
  useTransactionStore(state => state.transactions)

export const useTransaction = (id: string) =>
  useTransactionStore(state =>
    state.transactions.find(transaction => transaction.id === id)
  )

export const useLoadTransactions = () =>
  useTransactionStore(state => state.loadTransactions)
