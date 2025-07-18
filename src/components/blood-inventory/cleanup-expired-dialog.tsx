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
import { useCleanupExpiredBlood } from '@/hooks/use-api/use-blood-inventory'

interface CleanupExpiredDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CleanupExpiredDialog({ open, onOpenChange, onSuccess }: CleanupExpiredDialogProps) {
  const cleanupMutation = useCleanupExpiredBlood()

  const handleCleanup = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    try {
      await cleanupMutation.mutateAsync()
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
          <AlertDialogTitle>Dọn dẹp mẫu máu hết hạn</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này sẽ xóa vĩnh viễn tất cả các mẫu máu đã hết hạn khỏi hệ thống. Thao tác này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={cleanupMutation.isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => handleCleanup(e)}
            disabled={cleanupMutation.isPending}
            className='bg-orange-600 hover:bg-orange-700'
          >
            {cleanupMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Dọn dẹp mẫu hết hạn
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
