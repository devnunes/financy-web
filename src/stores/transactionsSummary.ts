import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { apolloClient } from '@/lib/graphql/apollo'
import { GET_TRANSACTIONS_SUMMARY } from '@/lib/graphql/queries/getTransactionsSummary'
import { currencyFormatter } from '@/lib/utils'

type TransactionSummary = {
  balance: number
  balanceLabel?: string
  income: number
  incomeLabel?: string
  expense: number
  expenseLabel?: string
}

interface TransactionSummaryState {
  transactionsSummary: TransactionSummary | null
  getTransactionsSummary: () => Promise<void>
  isLoading: boolean
  hasLoaded: boolean
  error: string | null
}

type GetTransactionsSummaryQueryResponse = {
  getTransactionSummary: TransactionSummary
}

export function formatTransactionSummary(
  summary: TransactionSummary
): TransactionSummary {
  return {
    ...summary,
    balanceLabel: currencyFormatter.format(summary.balance / 100),
    incomeLabel: currencyFormatter.format(summary.income / 100),
    expenseLabel: currencyFormatter.format(summary.expense / 100),
  }
}

const useTransactionSummaryStore = create<
  TransactionSummaryState,
  [['zustand/immer', never]]
>(
  immer((set, get) => {
    async function getTransactionsSummary() {
      const { isLoading, hasLoaded } = get()
      if (isLoading || hasLoaded) return
      console.log('Loading transactions summary...')
      try {
        const { data } =
          await apolloClient.query<GetTransactionsSummaryQueryResponse>({
            query: GET_TRANSACTIONS_SUMMARY,
            fetchPolicy: 'network-only',
          })

        console.log('Transactions summary data received:', data)

        if (!data?.getTransactionSummary)
          throw new Error('No transactions data received')

        set(state => {
          state.transactionsSummary = formatTransactionSummary(
            data.getTransactionSummary
          )
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
      transactionsSummary: null,
      getTransactionsSummary,
      isLoading: false,
      hasLoaded: false,
      error: null,
    }
  })
)

export const useTransactionsSummary = () =>
  useTransactionSummaryStore(state => state.transactionsSummary)

export const useGetTransactionsSummary = () =>
  useTransactionSummaryStore(state => state.getTransactionsSummary)
