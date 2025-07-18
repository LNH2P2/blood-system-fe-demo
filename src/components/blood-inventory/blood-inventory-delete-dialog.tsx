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
import { useDeleteBloodInventoryItem } from '@/hooks/use-api/use-blood-inventory'
import { bloodTypeOptions, bloodComponentOptions } from '@/validations/blood-inventory'

interface BloodInventoryDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: BloodInventoryTableItem | null
  onSuccess?: () => void
}

export function BloodInventoryDeleteDialog({ open, onOpenChange, item, onSuccess }: BloodInventoryDeleteDialogProps) {
  const deleteMutation = useDeleteBloodInventoryItem()

  if (!item) return null

  const bloodTypeLabel = bloodTypeOptions.find((opt) => opt.value === item.bloodType)?.label || item.bloodType
  const componentLabel = bloodComponentOptions.find((opt) => opt.value === item.component)?.label || item.component

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault() // Prevent dialog from closing immediately
    if (!item._id) return

    try {
      await deleteMutation.mutateAsync(item._id)
      onOpenChange(false)
      onSuccess?.()
    } catch {
      // Error handling is done in the mutation
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa mẫu máu</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className='space-y-2 text-sm text-muted-foreground'>
              <p>Hành động này không thể hoàn tác. Mẫu máu sẽ bị xóa vĩnh viễn khỏi hệ thống.</p>
              {item && (
                <div className='bg-gray-50 p-3 rounded-md space-y-1 text-gray-800'>
                  <div className='font-medium'>
                    <span>
                      <strong>Bệnh viện:</strong> {item.hospitalName}
                    </span>
                  </div>
                  <div>
                    <span>
                      <strong>Nhóm máu:</strong> {bloodTypeLabel}
                    </span>
                    <span> ({componentLabel})</span>
                  </div>
                  <div>
                    <span>
                      <strong>Số lượng:</strong> {item.quantity} ml
                    </span>
                  </div>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => handleDelete(e)}
            disabled={deleteMutation.isPending}
            className='bg-red-600 hover:bg-red-700'
          >
            {deleteMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
