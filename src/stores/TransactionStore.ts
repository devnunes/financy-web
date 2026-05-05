import z from 'zod/v4'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { apolloClient } from '@/lib/graphql/apollo'
import { CREATE_TRANSACTION } from '@/lib/graphql/mutations/createTransaction'
import {
  GET_ONE_TRANSACTION,
  GET_TRANSACTIONS,
} from '@/lib/graphql/queries/getTransactions'
import type { Transaction } from '@/types'

interface TransactionState {
  transactions: Transaction[]
  loadTransactions: () => Promise<void>
  createTransaction: (data: CreateTransactionInput) => Promise<void>
  isLoading: boolean
  hasLoaded: boolean
  error: string | null
}

type GetTransactionsQueryResponse = {
  getTransactions: Transaction[]
}
type GetOneTransactionQueryResponse = {
  getOneTransaction: Transaction
}

const createTransactionInputSchema = z.object({
  type: z.enum(['expense', 'income']),
  description: z
    .string()
    .min(2, { message: 'A descrição deve conter no mínimo 2 caracteres' }),
  date: z.date({ message: 'A data é obrigatória' }),
  amount: z.number().min(0.01, { message: 'O valor deve ser maior que zero' }),
  categoryId: z.string().min(1, { message: 'Selecione uma categoria' }),
})

type CreateTransactionInput = z.infer<typeof createTransactionInputSchema>

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

const useTransactionStore = create<TransactionState>()(
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

    async function createTransaction(
      createTransactionInput: CreateTransactionInput
    ) {
      const input = createTransactionInputSchema.parse(createTransactionInput)
      const { data } = await apolloClient.mutate<{
        createTransaction: Transaction
      }>({
        mutation: CREATE_TRANSACTION,
        variables: { data: input },
      })
      if (!data?.createTransaction)
        throw new Error('No transaction data received')
      const { data: newTransaction } = await apolloClient.query<{
        getOneTransaction: Transaction
      }>({
        variables: {
          data: {
            id: data.createTransaction.id,
          },
        },
        query: GET_ONE_TRANSACTION,
        fetchPolicy: 'network-only',
      })
      if (!newTransaction?.getOneTransaction)
        throw new Error('Failed to fetch created transaction')

      set(state => {
        state.transactions.unshift(
          formatTransaction(newTransaction.getOneTransaction)
        )
      })
    }

    return {
      transactions: [],
      loadTransactions,
      createTransaction,
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

export const useCreateTransaction = () =>
  useTransactionStore(state => state.createTransaction)

export const useTransactionsIsLoading = () =>
  useTransactionStore(state => state.isLoading)

export const useLoadTransactions = () =>
  useTransactionStore(state => state.loadTransactions)
