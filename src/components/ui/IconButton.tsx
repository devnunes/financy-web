import type * as React from 'react'
import { tv } from 'tailwind-variants'

import { cn } from '@/lib/utils'

type IconButtonVariant = 'outline' | 'danger'
type IconButtonState = 'default' | 'disabled'

const iconButtonStyles = tv({
  base: 'inline-flex size-10 items-center justify-center rounded-lg border transition-colors',
  variants: {
    variant: {
      outline: '',
      danger: '',
    },
    state: {
      default: '',
      disabled: 'cursor-not-allowed opacity-50',
    },
  },
  compoundVariants: [
    {
      variant: 'outline',
      state: 'default',
      class: 'border-gray-300 bg-white text-gray-700',
    },
    {
      variant: 'outline',
      class: 'border-primary bg-primary/10 text-primary',
    },
    {
      variant: 'danger',
      state: 'default',
      class: 'border-red-base bg-red-light text-red-dark',
    },
    {
      variant: 'danger',
      class: 'border-red-dark bg-red-base text-white',
    },
  ],
  defaultVariants: {
    variant: 'outline',
    state: 'default',
  },
})

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  icon: React.ReactNode
  variant?: IconButtonVariant
  state?: IconButtonState
}

function IconButton({
  className,
  icon,
  variant = 'outline',
  state = 'default',
  ...props
}: IconButtonProps) {
  const isDisabled = state === 'disabled'

  return (
    <button
      className={cn(iconButtonStyles({ variant, state }), className)}
      disabled={isDisabled}
      type="button"
      {...props}
    >
      {icon}
    </button>
  )
}

export { IconButton }
