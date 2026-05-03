import { ChevronRight } from 'lucide-react'
import CustomLink from '@/components/CustomLink'
import { Tag } from '@/components/Tag'
import type { CategoriesSummary } from '@/types'

export interface CategoryCardProps {
  categories: CategoriesSummary[]
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
        />
      </header>

      <div className="p-6 flex flex-col items-center gap-y-5">
        {categories.map(category => (
          <div
            key={category.id}
            className="grid grid-cols-[125px_95px_80px] items-center justify-center gap-4"
          >
            <div>
              <Tag text={category.name} color={category.categoryColor} />
            </div>
            <span className="text-sm text-gray-600 text-right">
              {category.items}
            </span>
            <span className="text-sm font-semibold text-gray-800 ">
              {category.amount}
            </span>
          </div>
        ))}
      </div>
    </article>
  )
}
