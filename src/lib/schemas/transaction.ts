import z from 'zod/v4'

// Schema para entidade Transaction completa (backend)
export const transactionEntitySchema = z.object({
  id: z.uuid({ message: 'Id da transação inválido' }),
  amount: z
    .number({ message: 'O valor é obrigatório' })
    .min(0, { message: 'O valor deve ser maior ou igual a zero' })
    .max(10000000, { message: 'O valor é muito alto' }),
  description: z
    .string()
    .min(2, { message: 'A descrição deve conter no mínimo 2 caracteres' })
    .max(255, { message: 'A descrição deve conter no máximo 255 caracteres' }),
  type: z.enum(['expense', 'income']),
  date: z.string().min(1, { message: 'A data é obrigatória' }),
  userId: z.uuid({ message: 'Id do usuário inválido' }),
  categoryId: z.uuid({ message: 'Selecione uma categoria válida' }),
})

// Schema para formulário (UI) - amount como string
export const transactionFormSchema = z.object({
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

// Schema para payload (envio) - transforma amount para number e date para Date
export const transactionPayloadSchema = transactionFormSchema.extend({
  date: z.iso.date({ error: 'Data inválida' }).transform((value: string) => {
    return new Date(`${value}T00:00:00`)
  }),
  amount: z
    .string({ error: 'O valor é obrigatório' })
    .min(1, { error: 'O valor é obrigatório' })
    .transform((value: string) => Number(value.replace(/\D/g, '')))
    .pipe(
      z
        .number()
        .int({ error: 'O valor deve ser inteiro em centavos' })
        .min(1, { error: 'O valor deve ser maior que zero' })
    ),
})

export type TransactionFormInput = z.input<typeof transactionFormSchema>
export type TransactionPayloadInput = z.output<typeof transactionPayloadSchema>
