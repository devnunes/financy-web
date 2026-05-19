import type { TagColor } from '@/types'
import { FieldLabel } from '../ui/field'
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group'

export const CATEGORY_COLOR_OPTIONS: Array<{
  value: TagColor
  className: string
}> = [
  { value: 'green', className: 'bg-green-base' },
  { value: 'blue', className: 'bg-blue-base' },
  { value: 'purple', className: 'bg-purple-base' },
  { value: 'pink', className: 'bg-pink-base' },
  { value: 'red', className: 'bg-red-base' },
  { value: 'orange', className: 'bg-orange-base' },
  { value: 'yellow', className: 'bg-yellow-base' },
]

export const DEFAULT_CATEGORY_COLOR: TagColor = 'green'

interface CategoryColorsProps {
  value: TagColor
  onChange: (value: TagColor) => void
}

export function CategoryColors({ value, onChange }: CategoryColorsProps) {
  return (
    <div className="flex flex-col items-start w-full">
      <FieldLabel className="text-gray-700">Cor</FieldLabel>

      <ToggleGroup
        className="flex w-full flex-wrap items-start gap-2"
        type="single"
        value={value}
        onValueChange={nextValue => {
          if (nextValue) {
            onChange(nextValue as TagColor)
          }
        }}
        variant="default"
        spacing={0}
      >
        {CATEGORY_COLOR_OPTIONS.map(color => (
          <ToggleGroupItem
            key={color.value}
            value={color.value}
            aria-label={`Selecionar cor ${color.value}`}
            className="h-7.5 w-12.5 rounded-sm border border-gray-300 bg-gray-100 p-0 transition-colors hover:bg-gray-100 data-[state=on]:border-brand-base data-[state=on]:ring-1 data-[state=on]:ring-brand-base focus-visible:ring-0 focus-visible:ring-offset-0 group-data-[spacing=0]/toggle-group:rounded-sm group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-sm group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-sm group-data-[spacing=0]/toggle-group:px-0"
          >
            <span className={`block h-5 w-10 rounded-sm ${color.className}`} />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
