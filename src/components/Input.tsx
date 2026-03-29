import * as React from 'react'
import { Input as ShadcnInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface InputProps extends React.ComponentProps<typeof ShadcnInput> {
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
          <Label htmlFor={id} className={cn(errorText && 'text-destructive')}>
            {label}
          </Label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </span>
          )}
          <ShadcnInput
            ref={ref}
            id={id}
            className={cn(
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              errorText &&
                'border-destructive focus-visible:ring-destructive/50',
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
