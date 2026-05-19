import { useEffect, useMemo, useState } from 'react'

export function useTransactionsPagination<T>(
  items: T[],
  resultsPerPage = 10,
  resetKey?: string
) {
  const [page, setPage] = useState(1)

  const totalResults = items.length
  const totalPages = Math.max(1, Math.ceil(totalResults / resultsPerPage))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  useEffect(() => {
    if (resetKey !== undefined) {
      setPage(1)
    }
  }, [resetKey])

  const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * resultsPerPage
    const endIndex = startIndex + resultsPerPage
    return items.slice(startIndex, endIndex)
  }, [items, page, resultsPerPage])

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages]
  )

  const startResult = totalResults === 0 ? 0 : (page - 1) * resultsPerPage + 1
  const endResult = Math.min(page * resultsPerPage, totalResults)

  const resetPagination = () => {
    setPage(1)
  }

  return {
    page,
    setPage,
    totalResults,
    totalPages,
    paginatedItems,
    pageNumbers,
    startResult,
    endResult,
    resetPagination,
  }
}
