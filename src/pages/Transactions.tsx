import { Edit2, Plus, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormInput } from '@/components/FormInput'
import { Field, FieldLabel } from '@/components/ui/field'
import Icon from '@/components/ui/Icon'
import { Tag } from '@/components/ui/Tag'
import { useLoadTransactions, useTransactions } from '@/stores/transactionStore'
import { TransactionDialog } from './Transactions/TrasactionDialog'

export default function Transactions() {
  const transactions = useTransactions()
  const loadTransactions = useLoadTransactions()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const resultsPerPage = 10
  const totalResults = 27
  const [toggleNewTransactionDialog, setToggleNewTransactionDialog] =
    useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    loadTransactions()
      .catch(err => setError(err?.message || 'Erro ao carregar transações'))
      .finally(() => setLoading(false))
  }, [loadTransactions])

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
        <button
          className="ml-auto bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
          type="button"
          aria-label="Nova transação"
          onClick={() => setToggleNewTransactionDialog(true)}
        >
          <Plus size={16} /> Nova transação
        </button>
      </header>

      <form
        className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 bg-white border border-gray-200 rounded-xl px-6 py-5 mb-2"
        aria-label="Filtros de transações"
      >
        {/* <Input
            state={'default'}
            label="Buscar"
            type="text"
            placeholder="Buscar por descrição"
            leftIcon={<Search className="text-gray-400" size={16} />}
            errorText={''}
          /> */}
        {/* <Field className="group flex w-full flex-col gap-2 items-center text-base h-12">
          <FieldLabel>Buscar</FieldLabel>
          <Search className="text-gray-400" size={16} />
          <Input
            className=""
            id="search-transaction"
            type="text"
            placeholder="Buscar por descrição"
          />
        </Field> */}
        <Field className="w-full">
          <FieldLabel htmlFor="search-transaction">Buscar</FieldLabel>
          <div className="relative w-full h-12">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <FormInput
              id="search-transaction"
              type="text"
              placeholder="Buscar por descrição"
              className="pl-10 h-full"
            />
          </div>
        </Field>
        <div className="flex flex-col">
          <span className="text-sm font-medium">Tipo</span>
          <select
            className="h-12 rounded-lg border border-gray-300 bg-white px-3 text-base text-gray-800 focus:outline-none"
            aria-label="Tipo"
          >
            <option value="">Todos</option>
            <option value="income">Entrada</option>
            <option value="expense">Saída</option>
          </select>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">Categoria</span>
          <select
            className="h-12 rounded-lg border border-gray-300 bg-white px-3 text-base text-gray-800 focus:outline-none"
            aria-label="Categoria"
          >
            <option value="">Todas</option>
            {/* TODO: Map categories here */}
          </select>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">Período</span>
          <select
            className="h-12 rounded-lg border border-gray-300 bg-white px-3 text-base text-gray-800 focus:outline-none"
            aria-label="Período"
          >
            <option value="">Novembro / 2025</option>
            {/* TODO: Map periods here */}
          </select>
        </div>
      </form>

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
                    {error}
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Nenhuma transação encontrada.
                  </td>
                </tr>
              ) : (
                transactions
                  .slice((page - 1) * resultsPerPage, page * resultsPerPage)
                  .map(transaction => (
                    <tr
                      key={transaction.id}
                      className="border-b border-gray-200"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <Icon
                          name={transaction.category?.icon}
                          color={transaction.category?.color}
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
                            transaction.category?.title ||
                            transaction.categoryId
                          }
                          color={transaction.category?.color}
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Tag
                          text={
                            transaction.type === 'income' ? 'Entrada' : 'Saída'
                          }
                          color={
                            transaction.type === 'income' ? 'green' : 'red'
                          }
                        />
                      </td>
                      <td className="px-6 py-4 text-end font-semibold">
                        {transaction.type === 'income' ? '+' : '-'}{' '}
                        {transaction.amountLabel || transaction.amount}
                      </td>
                      <td className="px-6 py-4 text-end flex items-center gap-2 justify-end">
                        <button
                          type="button"
                          className="p-2 rounded hover:bg-gray-100"
                          aria-label={`Editar transação ${transaction.description}`}
                        >
                          <Edit2 size={18} className="text-gray-500" />
                        </button>
                        <button
                          type="button"
                          className="p-2 rounded hover:bg-gray-100"
                          aria-label={`Excluir transação ${transaction.description}`}
                        >
                          <Trash2 size={18} className="text-gray-500" />
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
        <footer className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200 text-sm text-gray-600">
          <span>
            1 a {Math.min(page * resultsPerPage, totalResults)} | {totalResults}{' '}
            resultados
          </span>
          <nav aria-label="Paginação">
            <ul className="inline-flex items-center gap-1">
              {[1, 2, 3].map(p => (
                <li key={p}>
                  <button
                    type="button"
                    className={`w-8 h-8 rounded ${page === p ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    aria-current={page === p ? 'page' : undefined}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </footer>
      </div>
      <TransactionDialog
        open={toggleNewTransactionDialog}
        onOpenChange={setToggleNewTransactionDialog}
      />
    </section>
  )
}
