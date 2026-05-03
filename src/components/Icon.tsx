import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { lazy, Suspense, useMemo } from 'react'
import { cn, tv } from 'tailwind-variants'
import type { TagColor } from '@/types'

const iconWrapperStyles = tv({
  base: 'inline-flex bg-transparent items-center justify-center rounded-lg',
  variants: {
    bgColor: {
      transparent: 'bg-transparent',
      gray: 'bg-gray-100 size-10',
      blue: 'bg-blue-light size-10',
      purple: 'bg-purple-light size-10',
      pink: 'bg-pink-light size-10',
      red: 'bg-red-light size-10',
      orange: 'bg-orange-light size-10',
      yellow: 'bg-yellow-light size-10',
      green: 'bg-green-light size-10',
    },
  },
  defaultVariants: {
    name: 'circle-dollar-sign',
    bgColor: 'transparent',
  },
})

const iconStyles = tv({
  base: 'size-4',
  variants: {
    color: {
      transparent: 'text-transparent',
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
  bgColor?: TagColor
}

const Icon = ({
  className,
  name = 'circle-dollar-sign',
  color = 'gray',
  bgColor = 'transparent',
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
    <span className={cn(iconWrapperStyles({ bgColor }))} {...props}>
      <Suspense fallback={null}>
        <LucideIcon className={cn(iconStyles({ color }), className)} />
      </Suspense>
    </span>
  )
}

export default Icon
