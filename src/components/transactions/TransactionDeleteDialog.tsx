import { useMutation } from '@apollo/client/react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DELETE_TRANSACTION } from '@/lib/graphql/mutations/transactions'
import {
  TRANSACTIONS,
  TRANSACTIONS_ALL_VARIABLES,
  TRANSACTIONS_RECENT_VARIABLES,
} from '@/lib/graphql/queries/transactions'

interface TransactionDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: {
    id: string
    description: string
  } | null
  onSuccess?: () => void
}

export function TransactionDeleteDialog({
  open,
  onOpenChange,
  transaction,
  onSuccess,
}: TransactionDeleteDialogProps) {
  const [deleteTransaction, { loading: deleting }] = useMutation(
    DELETE_TRANSACTION,
    {
      refetchQueries: [
        { query: TRANSACTIONS, variables: TRANSACTIONS_ALL_VARIABLES },
        { query: TRANSACTIONS, variables: TRANSACTIONS_RECENT_VARIABLES },
      ],
      awaitRefetchQueries: true,
    }
  )

  const handleConfirmDelete = async () => {
    if (!transaction) return

    await deleteTransaction({
      variables: { deleteTransactionId: transaction.id },
    })
    onSuccess?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-125 gap-5 rounded-xl bg-white p-6">
        <DialogHeader className="gap-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-light">
            <AlertTriangle className="size-5 text-red-base" />
          </div>
          <DialogTitle className="text-center text-base leading-6 font-semibold text-gray-800">
            Excluir transação?
          </DialogTitle>
          <DialogDescription className="text-center text-sm leading-5 text-gray-600">
            {transaction ? (
              <>
                Você está prestes a excluir a transação{' '}
                <span className="font-semibold text-gray-800">
                  {transaction.description}
                </span>
                . Esta ação não pode ser desfeita.
              </>
            ) : (
              'Esta ação não pode ser desfeita.'
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="ghost"
            className="h-12 rounded-lg ring-1 ring-gray-300 text-base font-medium text-gray-700 hover:bg-gray-100"
            onClick={() => onOpenChange(false)}
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="h-12 rounded-lg bg-red-base text-base font-medium text-white hover:bg-red-dark"
            onClick={handleConfirmDelete}
            disabled={deleting || !transaction}
          >
            {deleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
