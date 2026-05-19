import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FormInput } from '@/components/FormInput'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
} from '@/lib/graphql/mutations/categories'
import {
  CATEGORIES,
  CATEGORIES_ALL_VARIABLES,
  CATEGORIES_RECENT_VARIABLES,
} from '@/lib/graphql/queries/categories'
import {
  type CategoryFormInput,
  categoryFormSchema,
  categoryPayloadSchema,
} from '@/lib/schemas/categories'
import {
  useClearSelectedCategory,
  useSelectedCategory,
} from '@/stores/categoryStore'
import type { TagColor } from '@/types'
import type { IconName } from '../Icon'
import { FieldLabel } from '../ui/field'
import { ToggleGroup } from '../ui/toggle-group'
import {
  CATEGORY_COLOR_OPTIONS,
  CategoryColors,
  DEFAULT_CATEGORY_COLOR,
} from './CategoryColors'
import { CategoryIcons } from './categoryIcons'

const CATEGORY_ICON_OPTIONS: IconName[] = [
  'briefcase-business',
  'car-front',
  'heart-pulse',
  'piggy-bank',
  'shopping-cart',
  'ticket',
  'tool-case',
  'utensils',
  'paw-print',
  'house',
  'gift',
  'dumbbell',
  'book-open',
  'baggage-claim',
  'mailbox',
  'receipt-text',
]

const DEFAULT_CATEGORY_ICON: IconName = 'briefcase-business'

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CategoryDialog({
  open,
  onOpenChange,
  onSuccess,
}: CategoryDialogProps) {
  const category = useSelectedCategory()
  const clearSelectedCategory = useClearSelectedCategory()

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [
      { query: CATEGORIES, variables: CATEGORIES_ALL_VARIABLES },
      { query: CATEGORIES, variables: CATEGORIES_RECENT_VARIABLES },
    ],
    awaitRefetchQueries: true,
  })

  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: [
      { query: CATEGORIES, variables: CATEGORIES_ALL_VARIABLES },
      { query: CATEGORIES, variables: CATEGORIES_RECENT_VARIABLES },
    ],
    awaitRefetchQueries: true,
  })

  const methods = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {},
  })
  const [selectedIcon, setSelectedIcon] = useState<IconName>(
    DEFAULT_CATEGORY_ICON
  )
  const [selectedColor, setSelectedColor] = useState<TagColor>(
    DEFAULT_CATEGORY_COLOR
  )

  useEffect(() => {
    methods.reset({
      title: category?.title ?? '',
      description: category?.description ?? '',
    })

    if (category?.icon) {
      setSelectedIcon(category.icon)
    } else {
      setSelectedIcon(DEFAULT_CATEGORY_ICON)
    }

    if (
      category?.color &&
      CATEGORY_COLOR_OPTIONS.some(option => option.value === category.color)
    ) {
      setSelectedColor(category.color)
      return
    }

    setSelectedColor(DEFAULT_CATEGORY_COLOR)
  }, [category, methods])

  const handleDialogOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen)

    if (!nextOpen) {
      clearSelectedCategory()
      methods.reset({
        title: '',
        description: '',
      })
      setSelectedIcon(DEFAULT_CATEGORY_ICON)
      setSelectedColor(DEFAULT_CATEGORY_COLOR)
    }
  }

  const onSubmit = async (data: CategoryFormInput) => {
    const payload = categoryPayloadSchema.parse(data)

    if (category) {
      await updateCategory({
        variables: {
          data: {
            id: category.id,
            ...payload,
            icon: selectedIcon,
            color: selectedColor,
          },
        },
      })
    } else {
      await createCategory({
        variables: {
          data: {
            ...payload,
            icon: selectedIcon,
            color: selectedColor,
          },
        },
      })
    }

    clearSelectedCategory()
    onSuccess?.()
    methods.reset({
      title: '',
      description: '',
    })
    setSelectedIcon(DEFAULT_CATEGORY_ICON)
    setSelectedColor(DEFAULT_CATEGORY_COLOR)
    handleDialogOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-140 gap-6 rounded-xl bg-white p-6.25"
      >
        <DialogHeader className="relative flex-row items-start gap-4 pr-10">
          <div className="flex flex-1 flex-col items-start gap-0.5 text-left">
            <DialogTitle className="text-base leading-6 font-semibold text-gray-800">
              {category ? 'Editar categoria' : 'Nova categoria'}
            </DialogTitle>
            <DialogDescription className="text-sm leading-5 text-gray-600">
              Organize suas transações com categorias
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
            <FormInput<CategoryFormInput>
              name="title"
              label="Título"
              placeholder="Ex. Alimentação"
            />
            <FormInput<CategoryFormInput>
              name="description"
              label="Descrição"
              placeholder="Descrição da categoria"
              helperText="Opcional"
            />

            <div className="flex flex-col items-start w-full">
              <FieldLabel className="text-gray-700">Ícone</FieldLabel>

              <ToggleGroup
                className="grid grid-cols-8 gap-2 w-full"
                type="single"
                value={selectedIcon}
                onValueChange={value => {
                  if (value) {
                    setSelectedIcon(value as IconName)
                  }
                }}
                variant="default"
                spacing={0}
              >
                {CATEGORY_ICON_OPTIONS.map(icon => (
                  <CategoryIcons key={icon} iconName={icon} value={icon} />
                ))}
              </ToggleGroup>
            </div>
            <CategoryColors value={selectedColor} onChange={setSelectedColor} />

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
