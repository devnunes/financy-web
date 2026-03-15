import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react'
import CategoryCard, { type CategoryCardItem } from '@/components/CategoryCard'
import TransactionsCard from '@/components/TransactionsCard'
import { categoryStore } from '@/stores/categoryStore'
import { transactionStore } from '@/stores/transactionStore'
import type { Transaction } from '@/types'

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

const mockCategories = [
  {
    id: 'food',
    name: 'Alimentação',
    items: '12 itens',
    amount: 'R$ 542,30',
    categoryColor: 'blue',
  },
  {
    id: 'transport',
    name: 'Transporte',
    items: '8 itens',
    amount: 'R$ 385,50',
    categoryColor: 'purple',
  },
  {
    id: 'market',
    name: 'Mercado',
    items: '3 itens',
    amount: 'R$ 298,75',
    categoryColor: 'orange',
  },
  {
    id: 'entertainment',
    name: 'Entretenimento',
    items: '2 itens',
    amount: 'R$ 186,20',
    categoryColor: 'pink',
  },
  {
    id: 'utilities',
    name: 'Utilidades',
    items: '7 itens',
    amount: 'R$ 245,80',
    categoryColor: 'yellow',
  },
] satisfies CategoryCardItem[]

const mockTransactions = [
  {
    id: 'salary',
    amount: 4250,
    description: 'Pagamento TransactionsCard',
    type: 'income',
    date: '01/12/25',
    userId: 'user-1',
    categoryId: 'income',
    category: {
      id: 'income',
      title: 'Receita',
      description: 'Entradas de dinheiro',
      icon: 'briefcase',
      color: 'green',
      userId: 'user-1',
    },
  },
  {
    id: 'dinner',
    amount: 89.5,
    description: 'Jantar no Restaurante',
    type: 'expense',
    date: '30/11/25',
    userId: 'user-1',
    categoryId: 'food',
    category: {
      id: 'food',
      title: 'Alimentacao',
      description: 'Refeicoes e restaurantes',
      icon: 'utensils',
      color: 'blue',
      userId: 'user-1',
    },
  },
  {
    id: 'gas',
    description: 'Posto de Gasolina',
    date: '29/11/25',
    userId: 'user-1',
    categoryId: 'transport',
    amount: 100,
    type: 'expense',
    category: {
      id: 'transport',
      title: 'Transporte',
      description: 'Combustivel e locomocao',
      icon: 'fuel',
      color: 'purple',
      userId: 'user-1',
    },
  },
  {
    id: 'market',
    description: 'Compras no Mercado',
    date: '28/11/25',
    userId: 'user-1',
    categoryId: 'market',
    amount: 156.8,
    type: 'expense',
    category: {
      id: 'market',
      title: 'Mercado',
      description: 'Compras de casa',
      icon: 'cart',
      color: 'orange',
      userId: 'user-1',
    },
  },
  {
    id: 'invest',
    description: 'Retorno de Investimento',
    date: '26/11/25',
    userId: 'user-1',
    categoryId: 'investment',
    amount: 340.25,
    type: 'income',
    category: {
      id: 'investment',
      title: 'Investimento',
      description: 'Aportes e rendimentos',
      icon: 'investment',
      color: 'green',
      userId: 'user-1',
    },
  },
] satisfies Transaction[]

export default function Dashboard() {
  const transactions = transactionStore(state => state.transactions)
  const storeCategories = categoryStore(state => state.categories)

  const dashboardTransactions =
    transactions.length > 0 ? transactions : mockTransactions

  const dashboardCategories: CategoryCardItem[] =
    storeCategories.length > 0
      ? storeCategories.map(category => {
          const categoryTransactions = category.transactions ?? []
          const expenseTransactions = categoryTransactions.filter(
            transaction => transaction.type === 'expense'
          )
          const totalAmount = expenseTransactions.reduce(
            (acc, transaction) => acc + transaction.amount,
            0
          )
          const amountLabel = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(totalAmount)
          const itemCount = categoryTransactions.length
          const itemLabel = `${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`

          return {
            id: category.id,
            name: category.title,
            items: itemLabel,
            amount: amountLabel,
            categoryColor: category.color,
          }
        })
      : mockCategories

  return (
    <section className="w-full max-w-310 flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-[379px_379px_379px] gap-5 w-full">
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

      <div className="grid grid-cols-1 xl:grid-cols-[780px_380px] gap-4">
        <TransactionsCard transactions={dashboardTransactions} />
        <CategoryCard categories={dashboardCategories} />
      </div>
    </section>
  )
}
