'use client'

import { useState } from 'react'
import { useGetHospitals, useCreateHospital } from '@/hooks/use-api/use-hospitals'
import { columns } from '../../../../components/hospital/columns'
import { DataTable } from '../../../../components/hospital/data-table'
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
import { HospitalForm } from '../../../../components/hospital/hospital-form'
import { CreateHospitalDto } from '@/types/hospital'

export default function HospitalsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: hospitalsData, isLoading, error } = useGetHospitals()

  const createHospitalMutation = useCreateHospital(() => {
    setIsDialogOpen(false)
  })

  const handleCreateHospital = (data: CreateHospitalDto) => {
    createHospitalMutation.mutate(data)
  }

  if (error) return <div>An error occurred: {error.message}</div>

  const hospitals = hospitalsData?.data || []

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
            <HospitalForm
              onSubmit={handleCreateHospital}
              isSubmitting={createHospitalMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <div>Loading...</div> : <DataTable columns={columns} data={hospitals} />}
    </div>
  )
}
