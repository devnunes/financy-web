import { useMutation, useQuery } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowDownCircle, ArrowUpCircle, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FormInput } from '@/components/FormInput'
import { FormSelect } from '@/components/FormSelect'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  CREATE_TRANSACTION,
  UPDATE_TRANSACTION,
} from '@/lib/graphql/mutations/transactions'
import {
  CATEGORIES,
  CATEGORIES_ALL_VARIABLES,
} from '@/lib/graphql/queries/categories'
import {
  TRANSACTIONS,
  TRANSACTIONS_ALL_VARIABLES,
  TRANSACTIONS_RECENT_VARIABLES,
} from '@/lib/graphql/queries/transactions'
import {
  type TransactionFormInput,
  transactionFormSchema,
  transactionPayloadSchema,
} from '@/lib/schemas/transaction'
import { cn, formatAmountToString } from '@/lib/utils'
import {
  useClearSelectedTransaction,
  useSelectedTransaction,
} from '@/stores/transactionStore'
import { DatePickerInput } from '../DatePickerInput'

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

function toDateInputValue(value: string | undefined) {
  if (!value) return ''
  return value.includes('T') ? value.split('T')[0] : value
}

function toAmountInputValue(value: number | undefined) {
  if (value === undefined || value === null) return ''
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function TransactionDialog({
  open,
  onOpenChange,
  onSuccess,
}: TransactionDialogProps) {
  const transaction = useSelectedTransaction()
  const clearSelectedTransaction = useClearSelectedTransaction()
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>(
    transaction ? transaction.type : 'expense'
  )
  const { data: { categories = [] } = {} } = useQuery(CATEGORIES, {
    variables: CATEGORIES_ALL_VARIABLES,
  })

  const [createTransaction, { loading: creating }] = useMutation(
    CREATE_TRANSACTION,
    {
      refetchQueries: [
        { query: TRANSACTIONS, variables: TRANSACTIONS_ALL_VARIABLES },
        { query: TRANSACTIONS, variables: TRANSACTIONS_RECENT_VARIABLES },
      ],
      awaitRefetchQueries: true,
    }
  )

  const [updateTransaction, { loading: updating }] = useMutation(
    UPDATE_TRANSACTION,
    {
      refetchQueries: [
        { query: TRANSACTIONS, variables: TRANSACTIONS_ALL_VARIABLES },
        { query: TRANSACTIONS, variables: TRANSACTIONS_RECENT_VARIABLES },
      ],
      awaitRefetchQueries: true,
    }
  )

  const methods = useForm<TransactionFormInput>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: transactionType,
      description: transaction ? transaction.description : '',
      date: transaction ? transaction.date : '',
      amount: transaction ? transaction.amount.toString() : '',
      categoryId: transaction ? transaction.categoryId : '',
    },
  })

  useEffect(() => {
    setTransactionType(transaction ? transaction.type : 'expense')

    methods.reset({
      type: transaction ? transaction.type : 'expense',
      description: transaction ? transaction.description : '',
      date: transaction ? toDateInputValue(transaction.date) : '',
      amount: transaction ? toAmountInputValue(transaction.amount) : '',
      categoryId: transaction ? transaction.categoryId : '',
    })
  }, [transaction, methods])

  function handleTransactionTypeChange(value: string) {
    if (value === 'expense' || value === 'income') {
      setTransactionType(value)
      methods.setValue('type', value, { shouldValidate: true })
    }
  }

  function handleAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
    methods.setValue('amount', formatAmountToString(event.target.value), {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const onSubmit = async (data: TransactionFormInput) => {
    const payload = transactionPayloadSchema.parse(data)

    if (transaction) {
      await updateTransaction({
        variables: {
          data: {
            id: transaction.id,
            ...payload,
          },
        },
      })
    } else {
      await createTransaction({ variables: { data: payload } })
    }

    clearSelectedTransaction()
    onSuccess?.()
    methods.reset()
    handleDialogOpenChange(false)
  }

  const handleDialogOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen)

    if (!nextOpen) {
      clearSelectedTransaction()
      setTransactionType('expense')
      methods.reset({
        type: 'expense',
        description: '',
        date: '',
        amount: '',
        categoryId: '',
      })
    }
  }

  const amountValue = methods.watch('amount')

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-140 gap-6 rounded-xl bg-white p-6.25"
      >
        <DialogHeader className="relative flex-row items-start gap-4 pr-10">
          <div className="flex flex-1 flex-col items-start gap-0.5 text-left">
            <DialogTitle className="text-base leading-6 font-semibold text-gray-800">
              {transaction ? 'Editar transação' : 'Nova transação'}
            </DialogTitle>
            <DialogDescription className="text-sm leading-5 text-gray-600">
              {transaction
                ? 'Edite os detalhes da transação'
                : 'Registre sua despesa ou receita'}
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute top-0 right-0 rounded-lg ring-1 ring-gray-300 text-gray-700 hover:bg-gray-100"
              aria-label="Fechar modal"
            >
              <XIcon className="size-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-full rounded-xl border border-gray-200 p-2">
              <ToggleGroup
                className="w-full"
                type="single"
                value={transactionType}
                onValueChange={handleTransactionTypeChange}
                variant="default"
                spacing={2}
              >
                <ToggleGroupItem
                  value="expense"
                  aria-label="Selecionar despesa"
                  className={cn(
                    'h-12 flex-1 rounded-lg border border-transparent px-3 py-3.5 text-base font-medium transition-colors',
                    transactionType === 'expense'
                      ? 'border-red-base bg-gray-100 text-gray-800'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <ArrowDownCircle
                    className={cn(
                      'size-4',
                      transactionType === 'expense'
                        ? 'text-red-base'
                        : 'text-gray-600'
                    )}
                  />
                  Despesa
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="income"
                  aria-label="Selecionar receita"
                  className={cn(
                    'h-12 flex-1 rounded-lg border border-transparent px-3 py-3.5 text-base font-medium transition-colors',
                    transactionType === 'income'
                      ? 'border-green-base bg-gray-100 text-gray-800'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <ArrowUpCircle
                    className={cn(
                      'size-4',
                      transactionType === 'income'
                        ? 'text-green-base'
                        : 'text-gray-600'
                    )}
                  />
                  Receita
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <FormInput<TransactionFormInput>
              name="description"
              label="Descrição"
              placeholder="Ex. Almoço no restaurante"
            />

            <div className="flex w-full gap-4">
              <div className="flex-1">
                <DatePickerInput<TransactionFormInput>
                  name="date"
                  label="Data"
                  placeholder="Selecione"
                />
              </div>
              <div className="flex-1">
                <FormInput<TransactionFormInput>
                  name="amount"
                  label="Valor"
                  placeholder="0,00"
                  leftIcon={<span className="text-sm font-medium">R$</span>}
                  value={amountValue}
                  onChange={handleAmountChange}
                  inputMode="numeric"
                />
              </div>
            </div>

            <FormSelect<TransactionFormInput>
              name="categoryId"
              label="Categoria"
              placeholder="Selecione"
              emptyMessage="Sem categorias cadastradas"
              triggerClassName="rounded-lg px-[13px] text-base"
              options={categories.map(category => ({
                value: category.id,
                label: category.title,
              }))}
            />

            <Button
              type="submit"
              className="h-12 w-full rounded-lg text-base font-medium text-white"
              disabled={creating || updating}
            >
              {creating || updating ? 'Salvando...' : 'Salvar'}
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
