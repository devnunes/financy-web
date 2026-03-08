import { ChevronDown } from 'lucide-react'
import type * as React from 'react'
import { tv } from 'tailwind-variants'

import { cn } from '@/lib/utils'

type InputState =
  | 'empty'
  | 'active'
  | 'filled'
  | 'error'
  | 'disabled'
  | 'select'

const inputWrapper = tv({
  base: 'flex items-center gap-2 rounded-lg border bg-white px-3 transition-colors',
  variants: {
    state: {
      empty: 'border-gray-300',
      active: 'border-primary ring-2 ring-primary/20',
      filled: 'border-gray-400',
      error: 'border-red-base ring-2 ring-red-base/20',
      disabled: 'border-gray-200 bg-gray-100',
      select: 'border-gray-300 cursor-pointer',
    },
    size: {
      md: 'h-11',
      sm: 'h-9',
    },
  },
  defaultVariants: {
    state: 'empty',
    size: 'md',
  },
})

const inputElement = tv({
  base: 'w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-500 outline-none disabled:cursor-not-allowed',
  variants: {
    state: {
      disabled: 'text-gray-500',
      select: 'cursor-pointer',
      empty: '',
      active: '',
      filled: '',
      error: '',
    },
  },
  defaultVariants: {
    state: 'empty',
  },
})

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  helperText?: string
  errorText?: string
  state?: InputState
  size?: 'md' | 'sm'
}

export function Input({
  className,
  label,
  helperText,
  errorText,
  state = 'empty',
  size = 'md',
  disabled,
  readOnly,
  value,
  ...props
}: InputProps) {
  const isDisabled = disabled || state === 'disabled'
  const isSelect = state === 'select'

  return (
    <div className="flex w-full flex-col gap-2">
      {label ? (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      ) : null}

      <span className={cn(inputWrapper({ state, size }), className)}>
        <input
          className={inputElement({ state })}
          disabled={isDisabled}
          readOnly={readOnly || isSelect}
          value={value}
          {...props}
        />
        {isSelect ? <ChevronDown className="size-4 text-gray-500" /> : null}
      </span>

      {state === 'error' && errorText ? (
        <span className="text-xs text-red-base">{errorText}</span>
      ) : helperText ? (
        <span className="text-xs text-gray-500">{helperText}</span>
      ) : null}
    </div>
  )
}
