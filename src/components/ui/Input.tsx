import { ChevronDown } from 'lucide-react'
import type * as React from 'react'
import { tv } from 'tailwind-variants'

import { cn } from '@/lib/utils'

type InputState =
  | 'default'
  | 'active'
  | 'filled'
  | 'error'
  | 'disabled'
  | 'select'

const inputWrapper = tv({
  base: 'flex items-center text-base gap-2 h-12 rounded-lg border bg-white px-3 transition-colors',
  variants: {
    state: {
      default: 'border-gray-300',
      active: 'border-primary ring-2 ring-primary/20',
      filled: 'border-gray-400',
      error: 'border-red-base ring-2 ring-red-base/20',
      disabled: 'border-gray-200 bg-gray-100',
      select: 'border-gray-300 cursor-pointer',
    },
  },
  defaultVariants: {
    state: 'default',
  },
})

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  helperText?: string
  errorText?: string
  state?: InputState
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Input({
  className,
  label,
  helperText,
  errorText,
  state = 'default',
  leftIcon,
  rightIcon,
  disabled,
  readOnly,
  value,
  ...props
}: InputProps) {
  const isDisabled = disabled || state === 'disabled'
  const isSelect = state === 'select'

  return (
    <div className="group flex w-full flex-col gap-2">
      {label ? (
        <span className="text-sm font-medium text-gray-700 group-focus-within:text-primary">
          {label}
        </span>
      ) : null}

      <span className={cn(inputWrapper({ state }), className)}>
        <div className="flex items-center gap-3 flex-1">
          {leftIcon ? (
            <span className="text-gray-400 transition-colors group-focus-within:[&_svg]:text-primary">
              {leftIcon}
            </span>
          ) : null}
          <input
            className="focus:outline-none text-gray-800 placeholder:text-gray-400"
            disabled={isDisabled}
            readOnly={readOnly || isSelect}
            value={value}
            {...props}
          />
        </div>
        {isSelect ? (
          <ChevronDown className="size-4 text-gray-500" />
        ) : (
          rightIcon
        )}
      </span>

      {state === 'error' && errorText ? (
        <span className="text-xs text-red-base">{errorText}</span>
      ) : helperText ? (
        <span className="text-xs text-gray-500">{helperText}</span>
      ) : null}
    </div>
  )
}
