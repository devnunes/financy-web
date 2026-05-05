import { ChevronRight } from 'lucide-react'
import CustomLink from '@/components/CustomLink'
import { Tag } from '@/components/Tag'
import { currencyFormatter } from '@/lib/utils'
import type { CategoriesAggregated } from '@/types'

export interface CategoryCardProps {
  categories: CategoriesAggregated[]
}

function handleCountText(count: number): string {
  if (count === 0) {
    return '0 itens'
  }
  if (count === 1) {
    return '1 item'
  }
  return `${count} itens`
}

export default function CategoryCard({ categories }: CategoryCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white overflow-hidden h-fit">
      <header className="h-14 px-5 border-b border-gray-200 flex items-center justify-between">
        <span className="uppercase text-xs tracking-wide text-gray-500">
          Categorias
        </span>
        <CustomLink
          to="/categories"
          text="Gerenciar"
          icon={<ChevronRight size={16} />}
          className="text-sm"
        />
      </header>

      <div className="p-6 flex flex-col items-center gap-y-5">
        {categories.map(category => (
          <div
            key={category.id}
            className="w-full grid grid-cols-[1fr_auto_auto] items-start justify-center gap-4"
          >
            <div>
              <Tag text={category.title} color={category.color} />
            </div>
            <span className="text-sm text-gray-600 text-right">
              {handleCountText(category.transactionCountByCategory)}
            </span>
            <span className="text-sm font-semibold text-gray-800">
              {currencyFormatter.format(category.totalAmount / 100)}
            </span>
          </div>
        ))}
      </div>
    </article>
  )
}
