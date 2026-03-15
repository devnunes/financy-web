import {
  BriefcaseBusiness,
  CircleDollarSign,
  Fuel,
  ShoppingCart,
  UtensilsCrossed,
} from 'lucide-react'
import type * as React from 'react'
import { tv } from 'tailwind-variants'
import { cn } from '@/lib/utils'
import type { TagColor } from '@/types'

const iconWrapperStyles = tv({
  base: 'inline-flex size-10 items-center justify-center rounded-lg',
  variants: {
    color: {
      gray: 'bg-gray-100',
      blue: 'bg-blue-light',
      purple: 'bg-purple-light',
      pink: 'bg-pink-light',
      red: 'bg-red-light',
      orange: 'bg-orange-light',
      yellow: 'bg-yellow-light',
      green: 'bg-green-light',
    },
  },
  defaultVariants: {
    color: 'gray',
  },
})

const iconStyles = tv({
  base: 'size-4',
  variants: {
    color: {
      gray: 'text-gray-700',
      blue: 'text-blue-dark',
      purple: 'text-purple-dark',
      pink: 'text-pink-dark',
      red: 'text-red-dark',
      orange: 'text-orange-dark',
      yellow: 'text-yellow-dark',
      green: 'text-green-dark',
    },
  },
  defaultVariants: {
    color: 'gray',
  },
})

const categoryIconMap = {
  briefcase: BriefcaseBusiness,
  utensils: UtensilsCrossed,
  fuel: Fuel,
  cart: ShoppingCart,
  investment: CircleDollarSign,
} as const

type CategoryIconName = keyof typeof categoryIconMap

export interface CategoryIconProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  iconName?: string
  color?: TagColor
}

export function CategoryIcon({
  className,
  iconName,
  color = 'gray',
  ...props
}: CategoryIconProps) {
  const Icon = categoryIconMap[iconName as CategoryIconName] ?? CircleDollarSign

  return (
    <span className={cn(iconWrapperStyles({ color }), className)} {...props}>
      <Icon className={iconStyles({ color })} />
    </span>
  )
}
