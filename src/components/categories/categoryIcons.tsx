import Icon, { type IconName } from '../Icon'
import { ToggleGroupItem } from '../ui/toggle-group'

interface CategoryIconsProps {
  value: string
  iconName: IconName
}

export function CategoryIcons({ value, iconName }: CategoryIconsProps) {
  return (
    <ToggleGroupItem
      className="h-10.5 w-10.5 rounded-lg border border-gray-300 bg-gray-100 p-0 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 data-[state=on]:border-green-base data-[state=on]:text-gray-700 focus-visible:ring-0 focus-visible:ring-offset-0 group-data-[spacing=0]/toggle-group:rounded-lg group-data-[spacing=0]/toggle-group:px-0"
      value={value}
      aria-label={`Selecionar ${value}`}
    >
      <Icon
        name={iconName}
        bgColor="transparent"
        className="size-5 text-current"
      />
    </ToggleGroupItem>
  )
}
