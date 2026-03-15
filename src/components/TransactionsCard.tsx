import { ChevronRight, Plus } from 'lucide-react'
import type { Transaction } from '@/types'
import CustomLink from './ui/CustomLink'
import { TransactionRow } from './ui/TransactionRow'

export interface TransactionsCardProps {
  transactions: Transaction[]
}

export default function TransactionsCard({
  transactions,
}: TransactionsCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <header className="h-15 px-6 py-5 border-b border-gray-200 flex items-center justify-between">
        <span className="uppercase text-xs/4 tracking-wide text-gray-500">
          Transações recentes
        </span>
        <CustomLink
          to="/transactions"
          text="Ver todas"
          icon={<ChevronRight size={20} />}
        />
      </header>

      <div className="flex flex-col">
        {transactions.map(transaction => (
          <TransactionRow key={transaction.id} transaction={transaction} />
        ))}
      </div>

      <button
        type="button"
        className="h-14 w-full border-0 bg-white text-primary text-sm/20 font-medium flex items-center justify-center gap-2 hover:cursor-pointer"
      >
        <Plus size={18} />
        <span>Nova transação</span>
      </button>
    </article>
  )
}
