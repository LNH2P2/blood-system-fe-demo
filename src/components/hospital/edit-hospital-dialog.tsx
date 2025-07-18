'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Hospital, UpdateHospitalDto } from '@/types/hospital'
import { HospitalForm } from './hospital-form'
import { useUpdateHospital } from '@/hooks/use-api/use-hospitals'

interface EditHospitalDialogProps {
  hospital: Hospital | null
  isOpen: boolean
  onClose: () => void
}

export function EditHospitalDialog({ hospital, isOpen, onClose }: EditHospitalDialogProps) {
  const updateHospitalMutation = useUpdateHospital(() => {
    onClose()
  })

  const handleSubmit = (data: UpdateHospitalDto) => {
    if (!hospital) return
    updateHospitalMutation.mutate({ id: hospital._id, data })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>Edit Hospital</DialogTitle>
          <DialogDescription>Update the details for {hospital?.name}.</DialogDescription>
        </DialogHeader>
        {hospital && (
          <HospitalForm
            hospital={hospital}
            onSubmit={handleSubmit}
            isSubmitting={updateHospitalMutation.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
