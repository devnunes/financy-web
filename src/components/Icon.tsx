import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { lazy, Suspense, useMemo } from 'react'
import { cn, tv } from 'tailwind-variants'
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
    name: 'circle-dollar-sign',
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

export type IconName = keyof typeof dynamicIconImports

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: IconName
  color?: TagColor
}

const Icon = ({
  className,
  name = 'circle-dollar-sign',
  color = 'gray',
  ...props
}: IconProps) => {
  const LucideIcon = useMemo(() => {
    const importIcon = dynamicIconImports[name]

    if (!importIcon) {
      console.error(
        `Ícone "${name}" não encontrado no lucide-react/dynamicIconImports`
      )
      return lazy(dynamicIconImports['circle-dollar-sign'])
    }

    return lazy(importIcon)
  }, [name])

  return (
    <span className={cn(iconWrapperStyles({ color }), className)} {...props}>
      <Suspense fallback={null}>
        <LucideIcon className={cn(iconStyles({ color }))} />
      </Suspense>
    </span>
  )
}

export default Icon
