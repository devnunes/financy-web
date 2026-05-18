import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Transaction } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatTransaction(transaction: Transaction): Transaction {
  const parsedDate = new Date(transaction.date)

  return {
    ...transaction,
    amountLabel: currencyFormatter.format(transaction.amount),
    dateLabel: Number.isNaN(parsedDate.getTime())
      ? transaction.date
      : dateFormatter.format(parsedDate),
  }
}

export function formatAmountToString(value: string) {
  const digitsOnly = value.replace(/\D/g, '')

  if (!digitsOnly) {
    return ''
  }

  const integerPart = digitsOnly.slice(0, -2) || '0'
  const decimalPart = digitsOnly.slice(-2).padStart(2, '0')
  const formattedInteger = Number(integerPart).toLocaleString('pt-BR')

  return `${formattedInteger},${decimalPart}`
}
