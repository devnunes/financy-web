import { useQuery } from '@apollo/client/react'
import CategoryCard from '@/components/CategoryCard'
import Icon from '@/components/Icon'
import TransactionsCard from '@/components/transactions/TransactionsCard'
import { USER_BALANCE } from '@/lib/graphql/queries/user'
import { currencyFormatter } from '@/lib/utils'

export default function Dashboard() {
  const { error, data: { userBalance } = {} } = useQuery(USER_BALANCE)

  return (
    <section className="w-full max-w-296 flex flex-col gap-6">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <article
          key="total"
          className="rounded-xl border border-gray-200 bg-white px-5 py-6 flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <Icon name="wallet" color="purple" className="size-5" />
            <span className="uppercase text-xs tracking-wide text-gray-500">
              Saldo total
            </span>
          </div>
          <strong className="text-28xl/32 font-bold text-gray-800 leading-tight line">
            {error ? 0 : currencyFormatter.format(userBalance?.balance ?? 0)}
          </strong>
        </article>
        <article
          key="income"
          className="rounded-xl border border-gray-200 bg-white px-5 py-6 flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <Icon name="arrow-up-circle" color="green" className="size-5" />
            <span className="uppercase text-xs tracking-wide text-gray-500">
              Receitas do mês
            </span>
          </div>
          <strong className="text-28xl/32 font-bold text-gray-800 leading-tight line">
            {error ? 0 : currencyFormatter.format(userBalance?.income ?? 0)}
          </strong>
        </article>
        <article
          key="expenses"
          className="rounded-xl border border-gray-200 bg-white px-5 py-6 flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <Icon name="arrow-down-circle" color="red" className="size-5" />
            <span className="uppercase text-xs tracking-wide text-gray-500">
              Despesas do mês
            </span>
          </div>
          <strong className="text-28xl/32 font-bold text-gray-800 leading-tight line">
            {error ? 0 : currencyFormatter.format(userBalance?.expenses ?? 0)}
          </strong>
        </article>
      </div>

      <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-6">
        <TransactionsCard />
        <CategoryCard />
      </div>
    </section>
  )
}
