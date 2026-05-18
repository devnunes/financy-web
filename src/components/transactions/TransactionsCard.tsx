import { useQuery } from '@apollo/client/react'
import { ChevronRight, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import CustomLink from '@/components/CustomLink'
import { TransactionDialog } from '@/components/transactions/TrasactionDialog'
import { Button } from '@/components/ui/button'
import { TRANSACTIONS } from '@/lib/graphql/queries/transactions'
import { formatTransaction } from '@/lib/utils'
import type { Transaction } from '@/types'
import { TransactionRow } from './TransactionRow'

export default function TransactionsCard() {
  const {
    loading,
    error,
    data: { transactions = [] } = {},
  } = useQuery(TRANSACTIONS)

  const parsedTransactions = useMemo(() => {
    if (!transactions) return []
    return transactions.map((transaction: Transaction) =>
      formatTransaction(transaction)
    )
  }, [transactions])

  const [toggleNewTransactionDialog, setToggleNewTransactionDialog] =
    useState(false)

  return (
    <article className="xl:col-span-2 rounded-xl border border-gray-200 bg-white overflow-hidden">
      <header className="h-15 px-6 py-5 border-b border-gray-200 flex items-center justify-between">
        <span className="uppercase text-xs/4 tracking-wide text-gray-500">
          Transações recentes
        </span>
        <CustomLink
          to="/transactions"
          text="Ver todas"
          icon={<ChevronRight size={20} />}
          className="text-sm"
        />
      </header>

      <div className="flex flex-col">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Carregando...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            Erro ao carregar transações
          </div>
        ) : (
          parsedTransactions.map((transaction: Transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))
        )}
      </div>

      <Button
        onClick={() => setToggleNewTransactionDialog(true)}
        aria-label="Nova transação"
        type="button"
        className="h-14 w-full border-0 bg-white text-sm/20 font-medium flex items-center justify-center gap-2 hover:text-primary-dark"
      >
        <Plus size={18} />
        <span>Nova transação</span>
      </Button>
      <TransactionDialog
        open={toggleNewTransactionDialog}
        onOpenChange={setToggleNewTransactionDialog}
      />
    </article>
  )
}
