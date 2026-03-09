import { ChevronDown } from 'lucide-react'
import * as React from 'react'
import { tv } from 'tailwind-variants'

import { cn } from '@/lib/utils'

type InputState = 'default' | 'filled' | 'error' | 'disabled' | 'select'

const inputWrapper = tv({
  base: 'flex items-center text-base gap-2 h-12 rounded-lg border bg-white px-3 transition-colors',
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

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  helperText?: string
  errorText?: string
  state?: InputState
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
      state = 'default',
      leftIcon,
      rightIcon,
      disabled,
      readOnly,
      value,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || state === 'disabled'
    const isSelect = state === 'select'

    return (
      <div className="group flex w-full flex-col gap-2">
        {label ? (
          <span
            className={cn('text-sm font-medium', {
              'text-danger': state === 'error',
              'text-gray-700 group-focus-within:text-primary':
                state !== 'error',
            })}
          >
            {label}
          </span>
        ) : null}

        <span className={cn(inputWrapper({ state }), className)}>
          <div className="flex items-center gap-3 flex-1">
            {leftIcon ? (
              <span
                className={cn('text-gray-400 transition-colors', {
                  '[&_svg]:text-danger': state === 'error',
                  'group-focus-within:[&_svg]:text-primary': state !== 'error',
                })}
              >
                {leftIcon}
              </span>
            ) : null}
            <input
              ref={ref}
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
          <span className="text-xs text-gray-500">{errorText}</span>
        ) : helperText ? (
          <span className="text-xs text-gray-500">{helperText}</span>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
