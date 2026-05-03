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

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const transactionSchema = z.object({
  type: z.enum(['expense', 'income']),
  details: z.object({
    description: z
      .string()
      .min(2, { message: 'A descrição deve conter no mínimo 2 caracteres' }),
    date: z.string().min(1, { message: 'A data é obrigatória' }),
    amount: z.string().min(1, { message: 'O valor é obrigatório' }),
    category: z.string().min(1, { message: 'Selecione uma categoria' }),
  }),
})

type TransactionFormData = z.infer<typeof transactionSchema>

export function TransactionDialog({
  open,
  onOpenChange,
  onSuccess,
}: TransactionDialogProps) {
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>(
    'expense'
  )
  const methods = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      details: {
        description: '',
        date: '',
        amount: '',
        category: '',
      },
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
    methods.setValue('details.amount', formatAmount(event.target.value), {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const onSubmit = () => {
    methods.reset()
    setTransactionType('expense')
    onSuccess?.()
    onOpenChange(false)
  }

  const amountValue = methods.watch('details.amount')

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
              name="details.description"
              label="Descrição"
              placeholder="Ex. Almoço no restaurante"
            />

            <div className="flex w-full gap-4">
              <div className="flex-1">
                <FormInput<TransactionFormData>
                  name="details.date"
                  label="Data"
                  placeholder="Selecione"
                />
              </div>
              <div className="flex-1">
                <FormInput<TransactionFormData>
                  name="details.amount"
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
              name="details.category"
              label="Categoria"
              placeholder="Selecione"
              triggerClassName="rounded-lg px-[13px] text-base"
              options={[
                { value: 'food', label: 'Alimentação' },
                { value: 'transport', label: 'Transporte' },
                { value: 'salary', label: 'Salário' },
              ]}
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
