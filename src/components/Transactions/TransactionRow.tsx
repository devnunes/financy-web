import type { HTMLAttributes } from 'react'
import Icon from '@/components/Icon'
import { Tag } from '@/components/Tag'
import type { Transaction } from '@/types'

export interface TransactionRowProps extends HTMLAttributes<HTMLSpanElement> {
  transaction: Transaction
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const amountLabel = transaction.amountLabel ?? String(transaction.amount)
  const dateLabel = transaction.dateLabel ?? transaction.date
  return (
    <div className="grid grid-cols-[1fr_150px_136px] xl:grid-cols-[405px_150px_136px] gap-4 p-6 h-20 justify-center items-center border-b border-gray-200">
      <div className="flex gap-5">
        <Icon
          name={transaction.category?.icon}
          color={transaction.category?.color}
          bgColor={transaction.category?.color}
        />

        <div className="flex flex-col">
          <span className="text-2xl text-gray-800 leading-tight md:text-base">
            {transaction.description}
          </span>
          <span className="text-sm text-gray-600">{dateLabel}</span>
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
          <Icon name="arrow-up-circle" color="green" className="size-3.5" />
        ) : (
          <Icon name="arrow-down-circle" color="red" className="size-3.5" />
        )}
      </div>
    </div>
  )
}
