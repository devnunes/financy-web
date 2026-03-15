import type * as React from 'react'
import { tv } from 'tailwind-variants'

import { cn } from '@/lib/utils'
import type { TagColor } from '@/types'

const tagStyles = tv({
  base: 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
  variants: {
    color: {
      gray: 'bg-gray-100 text-gray-700',
      blue: 'bg-blue-light text-blue-dark',
      purple: 'bg-purple-light text-purple-dark',
      pink: 'bg-pink-light text-pink-dark',
      red: 'bg-red-light text-red-dark',
      orange: 'bg-orange-light text-orange-dark',
      yellow: 'bg-yellow-light text-yellow-dark',
      green: 'bg-green-light text-green-dark',
    },
  },
  defaultVariants: {
    color: 'gray',
  },
})

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string
  color?: TagColor
}

export function Tag({ className, text, color = 'gray', ...props }: TagProps) {
  return (
    <span className={cn(tagStyles({ color }), className)} {...props}>
      {text}
    </span>
  )
}
