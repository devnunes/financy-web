export default function Categories() {
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
      <div className="flex w-full gap-4">
        <Card className="w-sm p-6">
          <CardHeader className="flex items-center gap-4">
            <Icon name="tag" className="size-6" />
            <div className="flex flex-col">
              <span className="text-28xl font-bold">8</span>
              <CardDescription className="text-xs text-gray-500 uppercase tracking-wider">
                Total de categorias
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="w-sm p-6">
          <CardHeader className="flex items-center gap-4">
            <Icon name="arrow-down-up" color="purple" className="size-6" />
            <div className="flex flex-col">
              <h2 className="text-28xl font-bold">27</h2>
              <CardDescription className="text-xs text-gray-500 uppercase tracking-wider">
                Total de transações
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
        <Card className="w-sm p-6">
          <CardHeader className="flex items-center gap-4">
            <Icon color="blue" className="size-6" />
            <div className="flex flex-col">
              <h2 className="text-28xl font-bold">Alimentação</h2>
              <CardDescription className="text-xs text-gray-500 uppercase tracking-wider">
                Categoria mais utilizada
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
      <div>
        <Card className="w-3xs p-6">
          <CardHeader className="grid grid-cols-[1fr_auto_auto] items-start">
            <Icon name="utensils" />
            <Icon name="trash-2" />
            <Icon name="edit" />
          </CardHeader>
          <CardContent>
            <h2>Alimentação</h2>
          </CardContent>
          <CardFooter className="justify-between">
            <Tag text="Alimentação" color="blue"></Tag>
            <small>12 itens</small>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
