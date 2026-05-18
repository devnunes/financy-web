import { useQuery } from '@apollo/client/react'
import { Plus } from 'lucide-react'
import Icon from '@/components/Icon'
import { Tag } from '@/components/Tag'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import {
  CATEGORIES,
  CATEGORIES_SUMMARY,
} from '@/lib/graphql/queries/categories'

export default function Categories() {
  const {
    loading: categoriesIsLoading,
    error: categoriesError,
    data: { categories = [] } = {},
  } = useQuery(CATEGORIES)
  const {
    error: summaryError,
    data: {
      categoriesSummary: {
        categoryCount = 0,
        transactionCountByUser = 0,
        mostUsedCategory = null,
      } = {},
    } = {},
  } = useQuery(CATEGORIES_SUMMARY)
  return (
    <section className="w-full max-w-7xl mx-auto flex flex-col gap-6 ">
      <header className="flex items-center w-full mb-2">
        <div className="flex flex-col">
          <h1
            id="transactions-heading"
            className="text-2xl font-extrabold text-gray-800"
          >
            Categorias
          </h1>
          <p className="text-base text-gray-600">
            Organize suas transações por categorias
          </p>
        </div>
        <button
          className="ml-auto bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
          type="button"
          aria-label="Nova categoria"
          // onClick={() => setToggleNewCategoryDialog(true)}
        >
          <Plus size={16} /> Nova categoria
        </button>
      </header>
      <div className="flex gap-4">
        <Card className="w-full p-6 bg-white">
          <CardHeader className="flex items-center gap-4 ">
            <Icon name="tag" className="size-6" />
            <div className="flex flex-col">
              <span className="text-28xl font-bold">
                {summaryError ? 0 : categoryCount}
              </span>
              <CardDescription className="text-xs text-gray-500 uppercase tracking-wider">
                Total de categorias
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="w-full p-6 bg-white">
          <CardHeader className="flex items-center gap-4">
            <Icon name="arrow-down-up" color="purple" className="size-6" />
            <div className="flex flex-col">
              <h2 className="text-28xl font-bold">
                {summaryError ? 0 : transactionCountByUser}
              </h2>
              <CardDescription className="text-xs text-gray-500 uppercase tracking-wider">
                Total de transações
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="w-full p-6 bg-white">
          <CardHeader className="flex items-center gap-4">
            <Icon
              name={mostUsedCategory?.icon}
              color={mostUsedCategory?.color}
              className="size-6"
            />
            <div className="flex flex-col">
              <h2 className="text-28xl font-bold">{mostUsedCategory?.title}</h2>
              <CardDescription className="text-xs text-gray-500 uppercase tracking-wider">
                Categoria mais utilizada
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {categoriesError && (
          <p className="text-red-500">Erro ao carregar categorias</p>
        )}
        {categoriesIsLoading && <p>Carregando categorias...</p>}
        {!categoriesIsLoading &&
          categories.map(category => (
            <Card
              key={category.id}
              className="w-full p-6 grid grid-rows-[1fr_auto_auto] gap-5 bg-white"
            >
              <CardHeader className="grid grid-cols-[1fr_auto_auto] items-start">
                <Icon
                  name={category.icon}
                  color={category.color}
                  bgColor={category.color}
                />
                <Icon
                  name="trash"
                  bgColor="gray"
                  className="size-4 text-red-base"
                />
                <Icon name="edit" bgColor="gray" className="size-4" />
              </CardHeader>
              <CardContent className="grid gap-1">
                <h2 className="text-base font-semibold">{category.title}</h2>
                <span className="text-sm text-gray-600 h-10">
                  {category.description}
                </span>
              </CardContent>
              <CardFooter className="justify-between">
                <Tag
                  text={category.title}
                  color={category.color}
                  className="px-3 py-1 text-sm font-medium rounded-full"
                ></Tag>
                <span className="text-sm text-gray-600">
                  {category.transactionCount} itens
                </span>
              </CardFooter>
            </Card>
          ))}
      </div>
    </section>
  )
}
