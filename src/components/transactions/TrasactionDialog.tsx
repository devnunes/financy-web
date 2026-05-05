import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowDownCircle, ArrowUpCircle, XIcon } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod/v4'
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
import { cn } from '@/lib/utils'
import { useCategories } from '@/stores/categoryStore'
import { useCreateTransaction } from '@/stores/transactionStore'
import { DatePickerInput } from '../DatePickerInput'

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const transactionFormSchema = z.object({
  type: z.enum(['expense', 'income']),
  description: z
    .string()
    .min(2, { error: 'A descrição deve conter no mínimo 2 caracteres' }),
  date: z
    .string({ error: 'A data é obrigatória' })
    .min(1, { error: 'A data é obrigatória' })
    .pipe(z.iso.date({ error: 'Data inválida' })),
  amount: z.string().min(1, { error: 'O valor é obrigatório' }),
  categoryId: z.string().min(1, { error: 'Selecione uma categoria' }),
})

const transactionPayloadSchema = transactionFormSchema.extend({
  date: z.iso.date({ error: 'Data inválida' }).transform(value => {
    return new Date(`${value}T00:00:00`)
  }),
  amount: z
    .string({ error: 'O valor é obrigatório' })
    .min(1, { error: 'O valor é obrigatório' })
    .transform(value => Number(value.replace(/\./g, '').replace(',', '')))
    .pipe(z.number().min(0.01, { error: 'O valor deve ser maior que zero' })),
})

type TransactionFormData = z.infer<typeof transactionFormSchema>

export function TransactionDialog({
  open,
  onOpenChange,
  onSuccess,
}: TransactionDialogProps) {
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>(
    'expense'
  )
  const categories = useCategories()
  const createTransaction = useCreateTransaction()

  const methods = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: 'expense',
      description: '',
      date: '',
      amount: '',
      categoryId: '',
    },
  })

  function handleTransactionTypeChange(value: string) {
    if (value === 'expense' || value === 'income') {
      setTransactionType(value)
      methods.setValue('type', value, { shouldValidate: true })
    }
  }

  function formatAmount(value: string) {
    const digitsOnly = value.replace(/\D/g, '')

    if (!digitsOnly) {
      return ''
    }

    const integerPart = digitsOnly.slice(0, -2) || '0'
    const decimalPart = digitsOnly.slice(-2).padStart(2, '0')
    const formattedInteger = Number(integerPart).toLocaleString('pt-BR')

    return `${formattedInteger},${decimalPart}`
  }

  function handleAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
    methods.setValue('amount', formatAmount(event.target.value), {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const onSubmit = async (data: TransactionFormData) => {
    const payload = transactionPayloadSchema.parse(data)
    await createTransaction(payload)
    onSuccess?.()
    methods.reset()
    onOpenChange(false)
  }

  const amountValue = methods.watch('amount')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-140 gap-6 rounded-xl bg-white p-6.25"
      >
        <DialogHeader className="relative flex-row items-start gap-4 pr-10">
          <div className="flex flex-1 flex-col items-start gap-0.5 text-left">
            <DialogTitle className="text-base leading-6 font-semibold text-gray-800">
              Nova transação
            </DialogTitle>
            <DialogDescription className="text-sm leading-5 text-gray-600">
              Registre sua despesa ou receita
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

            <FormInput<TransactionFormData>
              name="description"
              label="Descrição"
              placeholder="Ex. Almoço no restaurante"
            />

            <div className="flex w-full gap-4">
              <div className="flex-1">
                <DatePickerInput<TransactionFormData>
                  name="date"
                  label="Data"
                  placeholder="Selecione"
                />
              </div>
              <div className="flex-1">
                <FormInput<TransactionFormData>
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

            <FormSelect<TransactionFormData>
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
            >
              Salvar
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
