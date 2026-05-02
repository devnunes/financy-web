import * as React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { Input as ShadcnInput } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
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

export interface InputProps extends React.ComponentProps<typeof ShadcnInput> {
  state?: VariantProps<typeof inputWrapper>['state']
  label?: string
  helperText?: string
  errorText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      errorText,
      state,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <Label htmlFor={id}>
            <span className={cn(errorText && 'text-danger')}>{label}</span>
          </Label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400',
                errorText && 'text-danger'
              )}
            >
              {leftIcon}
            </span>
          )}
          <ShadcnInput
            ref={ref}
            id={id}
            className={cn(
              inputWrapper({ state }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            aria-invalid={!!errorText}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </span>
          )}
        </div>
        {errorText ? (
          <span className="text-xs text-destructive">{errorText}</span>
        ) : helperText ? (
          <span className="text-xs text-muted-foreground">{helperText}</span>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
