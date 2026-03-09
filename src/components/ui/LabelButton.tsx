import type * as React from 'react'
import { tv } from 'tailwind-variants'

import { cn } from '@/lib/utils'

type LabelButtonState = 'default' | 'disabled'
type LabelButtonVariant = 'solid' | 'outline'

const labelButtonStyles = tv({
  base: 'text-base inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    variant: {
      solid: 'border-primary text-white bg-primary hover:bg-primary-dark',
      outline: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-200',
    },
  },
  defaultVariants: {
    variant: 'solid',
    state: 'default',
  },
})

export interface LabelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  icon?: React.ReactNode
  variant?: LabelButtonVariant
  state?: LabelButtonState
}

export function LabelButton({
  className,
  label,
  icon,
  variant = 'solid',
  state = 'default',
  ...props
}: LabelButtonProps) {
  const isDisabled = state === 'disabled'

  return (
    <button
      className={cn(labelButtonStyles({ variant }), className)}
      disabled={isDisabled}
      type="button"
      {...props}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
