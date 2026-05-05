'use client'

import { format, parseISO } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'
import {
  type FieldValues,
  type Path,
  useController,
  useFormContext,
} from 'react-hook-form'
import { Calendar } from '@/components/ui/calendar'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

function formatDate(date: Date | undefined) {
  if (!date) return ''
  return format(date, 'MMMM dd, yyyy')
}

function parseStoredDate(value: string | undefined) {
  if (!value) return undefined

  const date = parseISO(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function formatDateForStorage(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

interface DatePickerInputProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>
  label?: string
  placeholder?: string
}

export function DatePickerInput<
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  label = 'Data',
  placeholder = 'Selecione',
}: DatePickerInputProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>()
  const { field, fieldState } = useController({ name, control })

  const rawDateValue = typeof field.value === 'string' ? field.value : undefined
  const selectedDate = React.useMemo(
    () => parseStoredDate(rawDateValue),
    [rawDateValue]
  )

  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(selectedDate)

  React.useEffect(() => {
    setMonth(parseStoredDate(rawDateValue))
  }, [rawDateValue])

  function setFormDate(nextDate: Date | undefined) {
    const normalized = nextDate ? formatDateForStorage(nextDate) : ''
    field.onChange(normalized)
  }

  return (
    <Field className="w-full gap-2">
      <FieldLabel
        htmlFor="date-required"
        className={cn(
          'text-sm text-gray-700',
          fieldState.error && 'text-danger'
        )}
      >
        {label}
      </FieldLabel>
      <InputGroup className="h-12 rounded-lg px-3 text-base text-gray-400 shadow-none">
        <InputGroupInput
          id="date-required"
          value={formatDate(selectedDate)}
          placeholder={placeholder}
          aria-invalid={fieldState.invalid}
          readOnly
          name={field.name}
          onBlur={field.onBlur}
          ref={field.ref}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                id="date-picker"
                variant="ghost"
                size="icon-xs"
                aria-label="Select date"
              >
                <CalendarIcon
                  className={cn(fieldState.error && 'text-danger')}
                />
                <span className="sr-only">Select date</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0 bg-white"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                month={month}
                onMonthChange={setMonth}
                onSelect={date => {
                  setFormDate(date)
                  setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
      {fieldState.error?.message ? (
        <FieldError>{fieldState.error.message}</FieldError>
      ) : null}
    </Field>
  )
}
