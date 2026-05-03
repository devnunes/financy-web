import type * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'w-full text-base gap-2 h-12 focus:outline-none rounded-lg border bg-white px-3 transition-colors',
        className
      )}
      {...props}
    />
  )
}

export { Input }
