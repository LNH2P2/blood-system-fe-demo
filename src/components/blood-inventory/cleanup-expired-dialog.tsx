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
          <AlertDialogTitle>Cleanup Expired Blood</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently remove all expired blood inventory items from the system. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={cleanupMutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => handleCleanup(e)}
            disabled={cleanupMutation.isPending}
            className='bg-orange-600 hover:bg-orange-700'
          >
            {cleanupMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Cleanup Expired
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
