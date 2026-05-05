import type * as React from 'react'
import { type FieldValues, type Path, useFormContext } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface FormSelectProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<
    React.ComponentProps<typeof Select>,
    'name' | 'value' | 'defaultValue' | 'onValueChange'
  > {
  name?: Path<TFieldValues>
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  label?: string
  helperText?: string
  errorText?: string
  placeholder?: string
  options?: SelectOption[]
  emptyMessage?: string
  triggerClassName?: string
}

const defaultOptions: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
]

function getDeepErrorMessage(
  errors: Record<string, unknown> | undefined,
  fieldName?: string
): string | undefined {
  if (!errors || !fieldName) {
    return undefined
  }

  const path = fieldName.split('.')
  let current: unknown = errors

  for (const key of path) {
    if (!current || typeof current !== 'object' || !(key in current)) {
      return undefined
    }

    current = (current as Record<string, unknown>)[key]
  }

  if (
    current &&
    typeof current === 'object' &&
    'message' in current &&
    typeof (current as { message?: unknown }).message === 'string'
  ) {
    return (current as { message: string }).message
  }

  return undefined
}

export function FormSelect<TFieldValues extends FieldValues = FieldValues>({
  name,
  value,
  defaultValue,
  onValueChange,
  label,
  helperText,
  errorText,
  placeholder = 'Selecione',
  options = defaultOptions,
  emptyMessage = 'Nenhuma opção disponível',
  triggerClassName,
  ...props
}: FormSelectProps<TFieldValues>) {
  const form = useFormContext<TFieldValues>()
  const formValue = name ? form?.watch?.(name) : undefined
  const formErrorText = getDeepErrorMessage(
    form?.formState?.errors as Record<string, unknown> | undefined,
    name
  )
  const effectiveErrorText = errorText ?? formErrorText
  const hasOptions = options.length > 0

  const resolvedValue =
    value ?? (typeof formValue === 'string' ? formValue : undefined)

  function handleValueChange(nextValue: string) {
    if (name) {
      form?.setValue?.(name, nextValue as never, {
        shouldDirty: true,
        shouldValidate: true,
      })
    }

    onValueChange?.(nextValue)
  }

  return (
    <Field className="w-full flex-col gap-2">
      {label ? (
        <FieldLabel
          className={cn('text-gray-700', effectiveErrorText && 'text-danger')}
        >
          {label}
        </FieldLabel>
      ) : null}
      <Select
        {...props}
        value={resolvedValue}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
      >
        <SelectTrigger
          aria-invalid={!!effectiveErrorText}
          className={cn(
            'w-full rounded-lg px-3 text-base font-normal',
            triggerClassName
          )}
        >
          <SelectValue placeholder={placeholder} className="text-gray-400" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {hasOptions ? (
              options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="__empty_option__" disabled>
                {emptyMessage}
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
      {effectiveErrorText ? (
        <FieldError>{effectiveErrorText}</FieldError>
      ) : null}
      {!effectiveErrorText && helperText ? (
        <span className="text-xs text-muted-foreground">{helperText}</span>
      ) : null}
    </Field>
  )
}
