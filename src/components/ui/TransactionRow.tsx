import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import type * as React from 'react'
import { CategoryIcon } from '@/components/ui/CategoryIcon'
import { Tag } from '@/components/ui/Tag'
import type { Transaction } from '@/types'

export interface TransactionRowProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  transaction: Transaction
}

export function TransactionRow({
  // className,
  transaction,
  // ...props
}: TransactionRowProps) {
  const amountLabel = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(transaction.amount)

  return (
    <div className="grid grid-cols-[405px_150px_136px] gap-4 p-6 h-20 justify-center items-center border-b border-gray-200">
      <div className="flex gap-5">
        <CategoryIcon
          iconName={transaction.category?.icon}
          color={transaction.category?.color}
          aria-hidden
        />

        <div className="flex flex-col">
          <span className="text-2xl text-gray-800 leading-tight md:text-base">
            {transaction.description}
          </span>
          <span className="text-sm text-gray-600">{transaction.date}</span>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <Tag
          text={transaction.category?.title ?? transaction.categoryId}
          color={transaction.category?.color}
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <strong className="text-xl text-gray-800 md:text-base">
          {transaction.type === 'income'
            ? `+ ${amountLabel}`
            : `- ${amountLabel}`}
        </strong>
        {transaction.type === 'income' ? (
          <ArrowUpCircle size={14} className="text-green-dark" />
        ) : (
          <ArrowDownCircle size={14} className="text-red-base" />
        )}
      </div>
    </div>
  )
}
