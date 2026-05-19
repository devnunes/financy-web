import z from 'zod/v4'

const tagColorSchema = z.enum([
  'transparent',
  'gray',
  'blue',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
  'green',
])

// Schema para entidade Category usada no frontend
export const categoryEntitySchema = z.object({
  id: z.uuid({ message: 'Id da categoria invalido' }),
  title: z
    .string({ error: 'O titulo e obrigatorio' })
    .min(1, { error: 'O titulo e obrigatorio' })
    .max(60, { error: 'O titulo deve conter no maximo 60 caracteres' }),
  description: z
    .string({ error: 'A descricao deve ser um texto valido' })
    .max(255, {
      error: 'A descricao deve conter no maximo 255 caracteres',
    }),
  icon: z
    .string({ error: 'Selecione um icone valido' })
    .min(1, { error: 'Selecione um icone valido' }),
  color: tagColorSchema,
  userId: z.uuid({ message: 'Id do usuario invalido' }),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  transactionCount: z.number().int().nonnegative().optional(),
})

// Schema para formulario (UI)
export const categoryFormSchema = z.object({
  title: z
    .string({ error: 'O titulo e obrigatorio' })
    .min(1, { error: 'O titulo e obrigatorio' })
    .max(60, { error: 'O titulo deve conter no maximo 60 caracteres' }),
  description: z
    .string({ error: 'A descricao deve ser um texto valido' })
    .trim()
    .max(255, {
      error: 'A descricao deve conter no maximo 255 caracteres',
    })
    .optional(),
})

// Payload para GraphQL (icon e color sao adicionados no dialog)
export const categoryPayloadSchema = categoryFormSchema.transform(data => ({
  title: data.title.trim(),
  description: data.description?.trim() ?? '',
}))

export type CategoryFormInput = z.input<typeof categoryFormSchema>
export type CategoryPayloadInput = z.output<typeof categoryPayloadSchema>
