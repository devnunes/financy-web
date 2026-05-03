import type * as React from 'react'
import { type FieldValues, type Path, useFormContext } from 'react-hook-form'
import { tv, type VariantProps } from 'tailwind-variants'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const inputWrapper = tv({
  base: '',
  variants: {
    state: {
      default: 'border-gray-300',
      filled: 'border-gray-400',
      error: 'border-gray-300',
      disabled: 'border-gray-200 bg-gray-100',
      select: 'border-gray-300 cursor-pointer',
    },
  },
  defaultVariants: {
    state: 'default',
  },
})

export interface FormInputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.ComponentProps<typeof Input>, 'name'> {
  name?: Path<TFieldValues>
  state?: VariantProps<typeof inputWrapper>['state']
  label?: string
  helperText?: string
  errorText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

function getErrorMessage(
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

export function FormInput<TFieldValues extends FieldValues = FieldValues>({
  className,
  label,
  helperText,
  errorText,
  state,
  leftIcon,
  rightIcon,
  id,
  name,
  ...props
}: FormInputProps<TFieldValues>) {
  const form = useFormContext<TFieldValues>()
  const registerProps = name ? form?.register?.(name) : undefined
  const formErrorText = getErrorMessage(
    form?.formState?.errors as Record<string, unknown> | undefined,
    name
  )
  const effectiveErrorText = errorText ?? formErrorText
  const inputState = effectiveErrorText ? 'error' : state
  const inputId = id ?? name

  return (
    <Field className="w-full flex-col gap-2">
      {label && (
        <FieldLabel
          htmlFor={inputId}
          className={cn('text-gray-700', effectiveErrorText && 'text-danger')}
        >
          {label}
        </FieldLabel>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400',
              effectiveErrorText && 'text-danger'
            )}
          >
            {leftIcon}
          </span>
        )}
        <Input
          id={inputId}
          className={cn(
            inputWrapper({ state: inputState }),
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
          aria-invalid={!!effectiveErrorText}
          {...registerProps}
          {...props}
        />
        {rightIcon && (
          <span
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400',
              effectiveErrorText && 'text-danger'
            )}
          >
            {rightIcon}
          </span>
        )}
      </div>
      {effectiveErrorText ? (
        <FieldError>{effectiveErrorText}</FieldError>
      ) : helperText ? (
        <span className="text-xs text-muted-foreground">{helperText}</span>
      ) : null}
    </Field>
  )
}
