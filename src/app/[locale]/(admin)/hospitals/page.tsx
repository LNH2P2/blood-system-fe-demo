'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { hospitalApi } from '@/lib/services/hospital.api'
import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { HospitalForm } from './_components/hospital-form'
import { CreateHospitalDto } from '@/lib/types/hospital'
import { toast } from 'sonner'

export default function HospitalsPage() {
  const queryClient = useQueryClient()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['hospitals'],
    queryFn: () => hospitalApi.getHospitals()
  })

  const createHospitalMutation = useMutation({
    mutationFn: (newHospital: CreateHospitalDto) => hospitalApi.createHospital(newHospital),
    onSuccess: () => {
      toast('Success', { description: 'Hospital created successfully.' })
      queryClient.invalidateQueries({ queryKey: ['hospitals'] })
      setIsDialogOpen(false)
    },
    onError: (err) => {
      toast('Error', { description: err.message })
    }
  })

  const handleCreateHospital = (data: CreateHospitalDto) => {
    createHospitalMutation.mutate(data)
  }

  if (error) return <div>An error occurred: {error.message}</div>

  const hospitals = data?.data || []

  return (
    <div className='container mx-auto py-10'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Hospital Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className='mr-2 h-4 w-4' />
              Add Hospital
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[625px]'>
            <DialogHeader>
              <DialogTitle>Add New Hospital</DialogTitle>
              <DialogDescription>Fill in the details below to add a new hospital.</DialogDescription>
            </DialogHeader>
            <HospitalForm onSubmit={handleCreateHospital} isSubmitting={createHospitalMutation.isPending} />
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <div>Loading...</div> : <DataTable columns={columns} data={hospitals} />}
    </div>
  )
}
