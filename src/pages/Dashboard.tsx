import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react'
import { useEffect } from 'react'
import CategoryCard from '@/components/CategoryCard'
import TransactionsCard from '@/components/TransactionsCard'
import { categoryStore } from '@/stores/categoryStore'
import { useLoadTransactions, useTransactions } from '@/stores/transactionStore'

const summaryCards = [
  {
    id: 'total',
    title: 'Saldo total',
    value: 'R$ 12.847,32',
    icon: <Wallet size={14} className="text-purple-base" />,
  },
  {
    id: 'income',
    title: 'Receitas do mes',
    value: 'R$ 4.250,00',
    icon: <ArrowUpCircle size={14} className="text-green-dark" />,
  },
  {
    id: 'expenses',
    title: 'Despesas do mes',
    value: 'R$ 2.180,45',
    icon: <ArrowDownCircle size={14} className="text-red-base" />,
  },
] as const

export default function Dashboard() {
  const transactions = useTransactions()
  const loadTransactions = useLoadTransactions()

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  const categoriesSummary = categoryStore(state => state.categoriesSummary)

  const dashboardCategories = categoriesSummary

  return (
    <section className="w-full max-w-296 flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        {summaryCards.map(card => (
          <article
            key={card.id}
            className="rounded-xl border border-gray-200 bg-white px-5 py-6 flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              {card.icon}
              <span className="uppercase text-xs tracking-wide text-gray-500">
                {card.title}
              </span>
            </div>
            <strong className="text-[28px]/32 font-bold text-gray-800 leading-tight line">
              {card.value}
            </strong>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[781px_381px] gap-6">
        <TransactionsCard transactions={transactions} />
        <CategoryCard categories={dashboardCategories} />
      </div>
    </section>
  )
}
