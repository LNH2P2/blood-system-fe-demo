'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'
import { BloodInventoryTableItem } from '@/types/blood-inventory.d'
import { useRemoveBloodInventoryItem } from '@/hooks/use-api/use-blood-inventory'
import { bloodTypeOptions, bloodComponentOptions } from '@/validations/blood-inventory'

interface BloodInventoryDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: BloodInventoryTableItem | null
  onSuccess?: () => void
}

export function BloodInventoryDeleteDialog({ open, onOpenChange, item, onSuccess }: BloodInventoryDeleteDialogProps) {
  const removeMutation = useRemoveBloodInventoryItem()

  if (!item) return null

  const bloodTypeLabel = bloodTypeOptions.find((opt) => opt.value === item.bloodType)?.label || item.bloodType
  const componentLabel = bloodComponentOptions.find((opt) => opt.value === item.component)?.label || item.component

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault() // Prevent dialog from closing immediately
    if (!item._id) return

    try {
      await removeMutation.mutateAsync({
        hospitalId: item.hospitalId,
        itemId: item._id
      })
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      // Error handling is done in the mutation
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Blood Inventory Item</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className='space-y-2 text-sm text-muted-foreground'>
              <p>
                This action cannot be undone. This will permanently remove the blood inventory item.
              </p>
              {item && (
                <div className='bg-gray-50 p-3 rounded-md space-y-1 text-gray-800'>
                  <div className='font-medium'>
                    <span><strong>Hospital:</strong> {item.hospitalName}</span>
                  </div>
                  <div>
                    <span><strong>Blood Type:</strong> {bloodTypeLabel}</span>
                    <span> ({componentLabel})</span>
                  </div>
                  <div>
                    <span><strong>Quantity:</strong> {item.quantity} units</span>
                  </div>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={removeMutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => handleDelete(e)}
            disabled={removeMutation.isPending}
            className='bg-red-600 hover:bg-red-700'
          >
            {removeMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
