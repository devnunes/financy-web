import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react'
import { useEffect } from 'react'
import CategoryCard from '@/components/CategoryCard'
import TransactionsCard from '@/components/transactions/TransactionsCard'
import { categoryStore } from '@/stores/categoryStore'
import { useLoadTransactions, useTransactions } from '@/stores/transactionStore'
import {
  useGetTransactionsSummary,
  useTransactionsSummary,
} from '@/stores/transactionsSummary'

export default function Dashboard() {
  const loadTransactions = useLoadTransactions()
  const transactions = useTransactions()
  const loadTransactionsSummary = useGetTransactionsSummary()
  const transactionsSummary = useTransactionsSummary()

  useEffect(() => {
    loadTransactions()
    loadTransactionsSummary()
  }, [loadTransactions, loadTransactionsSummary])

  const categoriesSummary = categoryStore(state => state.categoriesSummary)

  const dashboardCategories = categoriesSummary

  return (
    <section className="w-full max-w-296 flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        <article
          key="total"
          className="rounded-xl border border-gray-200 bg-white px-5 py-6 flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <Wallet size={14} className="text-purple-base" />
            <span className="uppercase text-xs tracking-wide text-gray-500">
              Saldo total
            </span>
          </div>
          <strong className="text-[28px]/32 font-bold text-gray-800 leading-tight line">
            {transactionsSummary?.balanceLabel ?? 0}
          </strong>
        </article>
        <article
          key="income"
          className="rounded-xl border border-gray-200 bg-white px-5 py-6 flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <ArrowUpCircle size={14} className="text-green-dark" />
            <span className="uppercase text-xs tracking-wide text-gray-500">
              Receitas do mês
            </span>
          </div>
          <strong className="text-[28px]/32 font-bold text-gray-800 leading-tight line">
            {transactionsSummary?.incomeLabel ?? 0}
          </strong>
        </article>
        <article
          key="expenses"
          className="rounded-xl border border-gray-200 bg-white px-5 py-6 flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <ArrowDownCircle size={14} className="text-red-base" />
            <span className="uppercase text-xs tracking-wide text-gray-500">
              Despesas do mês
            </span>
          </div>
          <strong className="text-[28px]/32 font-bold text-gray-800 leading-tight line">
            {transactionsSummary?.expenseLabel ?? 0}
          </strong>
        </article>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[781px_381px] gap-6">
        <TransactionsCard transactions={transactions} />
        <CategoryCard categories={dashboardCategories} />
      </div>
    </section>
  )
}
