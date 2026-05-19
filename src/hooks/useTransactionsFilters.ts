import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { formatTransaction } from '@/lib/utils'
import type { Transaction } from '@/types'

export type TransactionsFilterValues = {
  search: string
  type: 'all' | 'income' | 'expense'
  categoryId: string
  period: string
}

type CategoryOptionSource = {
  id: string
  title: string
}

export const TRANSACTION_TYPE_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'income', label: 'Entrada' },
  { value: 'expense', label: 'Saida' },
] as const

export const FILTER_DEFAULT_VALUES: TransactionsFilterValues = {
  search: '',
  type: 'all',
  categoryId: 'all',
  period: 'all',
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function toPeriodKey(dateValue: string): string | null {
  const transactionDate = new Date(dateValue)
  if (Number.isNaN(transactionDate.getTime())) return null

  const year = transactionDate.getFullYear()
  const month = String(transactionDate.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function formatPeriodLabel(periodKey: string): string {
  const [yearPart, monthPart] = periodKey.split('-')
  const year = Number(yearPart)
  const month = Number(monthPart)

  if (!year || !month) return periodKey

  const date = new Date(year, month - 1, 1)
  const monthLabel = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
  }).format(date)

  const capitalizedMonth =
    monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)

  return `${capitalizedMonth} / ${year}`
}

export function useTransactionsFilters({
  transactions,
  categories,
}: {
  transactions?: Transaction[]
  categories: CategoryOptionSource[]
}) {
  const filterFormMethods = useForm<TransactionsFilterValues>({
    defaultValues: FILTER_DEFAULT_VALUES,
  })

  const search = useWatch({
    control: filterFormMethods.control,
    name: 'search',
  })
  const type = useWatch({
    control: filterFormMethods.control,
    name: 'type',
  })
  const categoryId = useWatch({
    control: filterFormMethods.control,
    name: 'categoryId',
  })
  const period = useWatch({
    control: filterFormMethods.control,
    name: 'period',
  })

  const [debouncedSearch, setDebouncedSearch] = useState(search)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [search])

  const parsedTransactions = useMemo(() => {
    if (!transactions) return []

    return transactions.map((transaction: Transaction) =>
      formatTransaction(transaction)
    )
  }, [transactions])

  const categoryOptions = useMemo(
    () => [
      { value: 'all', label: 'Todas' },
      ...categories.map(category => ({
        value: category.id,
        label: category.title,
      })),
    ],
    [categories]
  )

  const periodOptions = useMemo(() => {
    const uniquePeriodKeys = new Set<string>()

    for (const transaction of parsedTransactions) {
      const periodKey = toPeriodKey(transaction.date)
      if (periodKey) {
        uniquePeriodKeys.add(periodKey)
      }
    }

    const sortedPeriodKeys = Array.from(uniquePeriodKeys).sort((a, b) =>
      b.localeCompare(a)
    )

    return [
      { value: 'all', label: 'Todos' },
      ...sortedPeriodKeys.map(periodKey => ({
        value: periodKey,
        label: formatPeriodLabel(periodKey),
      })),
    ]
  }, [parsedTransactions])

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = normalizeText(debouncedSearch ?? '')

    return parsedTransactions.filter(transaction => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        normalizeText(transaction.description).includes(normalizedSearch)
      const matchesType = type === 'all' || transaction.type === type
      const matchesCategory =
        categoryId === 'all' || transaction.categoryId === categoryId
      const matchesPeriod =
        period === 'all' || toPeriodKey(transaction.date) === period

      return matchesSearch && matchesType && matchesCategory && matchesPeriod
    })
  }, [parsedTransactions, debouncedSearch, type, categoryId, period])

  const filterSignature = `${debouncedSearch ?? ''}|${type ?? 'all'}|${categoryId ?? 'all'}|${period ?? 'all'}`

  const clearFilters = useCallback(() => {
    filterFormMethods.reset(FILTER_DEFAULT_VALUES)
    setDebouncedSearch('')
  }, [filterFormMethods])

  return {
    filterFormMethods,
    parsedTransactions,
    filteredTransactions,
    categoryOptions,
    periodOptions,
    filterSignature,
    clearFilters,
  }
}
