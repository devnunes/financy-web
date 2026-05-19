import { useQuery } from '@apollo/client/react'
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { FormInput } from '@/components/FormInput'
import { FormSelect } from '@/components/FormSelect'
import Icon from '@/components/Icon'
import { Tag } from '@/components/Tag'
import { TransactionDeleteDialog } from '@/components/transactions/TransactionDeleteDialog'
import { TransactionDialog } from '@/components/transactions/TransactionDialog'
import { Button } from '@/components/ui/button'
import {
  TRANSACTION_TYPE_OPTIONS,
  type TransactionsFilterValues,
  useTransactionsFilters,
} from '@/hooks/useTransactionsFilters'
import { useTransactionsPagination } from '@/hooks/useTransactionsPagination'
import {
  CATEGORIES_ALL_VARIABLES,
  CATEGORIES_FILTER_OPTIONS,
} from '@/lib/graphql/queries/categories'
import {
  TRANSACTIONS,
  TRANSACTIONS_ALL_VARIABLES,
} from '@/lib/graphql/queries/transactions'
import {
  useClearSelectedTransaction,
  useSetSelectedTransaction,
} from '@/stores/transactionStore'
import type { Transaction } from '@/types'

export default function Transactions() {
  const {
    loading,
    error,
    data: { transactions } = {},
  } = useQuery(TRANSACTIONS, {
    variables: TRANSACTIONS_ALL_VARIABLES,
  })
  const { data: { categories = [] } = {} } = useQuery(
    CATEGORIES_FILTER_OPTIONS,
    {
      variables: CATEGORIES_ALL_VARIABLES,
    }
  )

  const {
    filterFormMethods,
    parsedTransactions,
    filteredTransactions,
    categoryOptions,
    periodOptions,
    filterSignature,
    clearFilters,
  } = useTransactionsFilters({
    transactions,
    categories,
  })

  const {
    page,
    setPage,
    totalResults,
    totalPages,
    paginatedItems: paginatedTransactions,
    pageNumbers,
    startResult,
    endResult,
    resetPagination,
  } = useTransactionsPagination(filteredTransactions, 10, filterSignature)

  const [toggleNewTransactionDialog, setToggleNewTransactionDialog] =
    useState(false)
  const [toggleDeleteDialog, setToggleDeleteDialog] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<Pick<
    Transaction,
    'id' | 'description'
  > | null>(null)

  const setSelectedTransaction = useSetSelectedTransaction()
  const clearSelectedTransaction = useClearSelectedTransaction()

  const handleCreateNewTransaction = () => {
    clearSelectedTransaction()
    setToggleNewTransactionDialog(true)
  }

  const handleDeleteTransaction = (transaction: Transaction) => {
    setTransactionToDelete({
      id: transaction.id,
      description: transaction.description,
    })
    setToggleDeleteDialog(true)
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setToggleNewTransactionDialog(true)
  }

  const handleDeleteDialogClose = (open: boolean) => {
    setToggleDeleteDialog(open)

    if (!open) {
      setTransactionToDelete(null)
    }
  }

  const handleTransactionDialogClose = (open: boolean) => {
    setToggleNewTransactionDialog(open)

    if (!open) {
      clearSelectedTransaction()
    }
  }

  return (
    <section
      className="w-full max-w-7xl mx-auto flex flex-col gap-6 "
      aria-labelledby="transactions-heading"
    >
      <header className="flex items-center w-full mb-2">
        <div className="flex flex-col">
          <h1
            id="transactions-heading"
            className="text-2xl font-extrabold text-gray-800"
          >
            Transações
          </h1>
          <p className="text-base text-gray-600">
            Gerencie todas as suas transações financeiras.
          </p>
        </div>
        <Button
          className="ml-auto bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
          type="button"
          aria-label="Nova transação"
          onClick={handleCreateNewTransaction}
        >
          <Plus size={16} /> Nova transação
        </Button>
      </header>

      <FormProvider {...filterFormMethods}>
        <form
          className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 bg-white border border-gray-200 rounded-xl px-6 py-5 mb-2"
          aria-label="Filtros de transações"
          onSubmit={event => {
            event.preventDefault()
          }}
        >
          <FormInput<TransactionsFilterValues>
            name="search"
            label="Buscar"
            placeholder="Buscar por descrição"
            leftIcon={<Search className="text-gray-400" size={16} />}
          />
          <FormSelect<TransactionsFilterValues>
            name="type"
            label="Tipo"
            options={TRANSACTION_TYPE_OPTIONS.map(option => ({
              value: option.value,
              label: option.label,
            }))}
          />
          <FormSelect<TransactionsFilterValues>
            name="categoryId"
            label="Categoria"
            options={categoryOptions}
          />
          <FormSelect<TransactionsFilterValues>
            name="period"
            label="Período"
            options={periodOptions}
          />
        </form>
      </FormProvider>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full" aria-label="Lista de transações">
            <thead>
              <tr className="bg-gray-100 font-bold text-gray-500 text-xs uppercase">
                <th className="px-6 py-5 text-left">Descrição</th>
                <th className="px-6 py-5 text-center">Data</th>
                <th className="px-6 py-5 text-center">Categoria</th>
                <th className="px-6 py-5 text-center">Tipo</th>
                <th className="px-6 py-5 text-end">Valor</th>
                <th className="px-6 py-5 text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Carregando transações...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-red-500"
                  >
                    {error.message ||
                      'Ocorreu um erro ao carregar as transações.'}
                  </td>
                </tr>
              ) : parsedTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Nenhuma transação encontrada.
                  </td>
                </tr>
              ) : paginatedTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Nenhuma transação encontrada para os filtros aplicados.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map(transaction => (
                  <tr key={transaction.id} className="border-b border-gray-200">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <Icon
                        name={transaction.category?.icon}
                        color={transaction.category?.color}
                        bgColor={transaction.category?.color}
                      />
                      <span className="text-base text-gray-800">
                        {transaction.description}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {transaction.dateLabel || transaction.date}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Tag
                        text={
                          transaction.category?.title || transaction.categoryId
                        }
                        color={transaction.category?.color}
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Tag
                        text={
                          transaction.type === 'income' ? 'Entrada' : 'Saída'
                        }
                        color={transaction.type === 'income' ? 'green' : 'red'}
                      />
                    </td>
                    <td className="px-6 py-4 text-end font-semibold">
                      {transaction.type === 'income' ? '+' : '-'}{' '}
                      {transaction.amountLabel}
                    </td>
                    <td className="px-6 py-4 text-end flex items-center gap-2 justify-end">
                      <Icon
                        name="trash"
                        bgColor="gray"
                        className="size-4 text-red-base"
                        onClick={() => {
                          handleDeleteTransaction(transaction)
                        }}
                      />
                      <Icon
                        name="edit"
                        bgColor="gray"
                        className="size-4"
                        onClick={() => {
                          handleEditTransaction(transaction)
                        }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <footer className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200 text-sm text-gray-600">
          <span>
            {startResult} a {endResult} | {totalResults} resultados
          </span>
          <nav
            aria-label="Paginação"
            className="flex min-w-55 items-center justify-end gap-1.5"
          >
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() =>
                setPage(currentPage => Math.max(1, currentPage - 1))
              }
              disabled={page === 1}
              aria-label="Página anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <ul className="inline-flex items-center gap-1">
              {pageNumbers.map(p => (
                <li key={p}>
                  <button
                    type="button"
                    className={`h-8 w-8 rounded-lg border text-sm font-semibold ${
                      page === p
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                    aria-current={page === p ? 'page' : undefined}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() =>
                setPage(currentPage => Math.min(totalPages, currentPage + 1))
              }
              disabled={page === totalPages}
              aria-label="Próxima página"
            >
              <ChevronRight size={16} />
            </button>
          </nav>
        </footer>
      </div>
      <TransactionDialog
        open={toggleNewTransactionDialog}
        onOpenChange={handleTransactionDialogClose}
      />
      <TransactionDeleteDialog
        open={toggleDeleteDialog}
        onOpenChange={handleDeleteDialogClose}
        transaction={transactionToDelete}
        onSuccess={() => {
          setTransactionToDelete(null)
        }}
      />
    </section>
  )
}
