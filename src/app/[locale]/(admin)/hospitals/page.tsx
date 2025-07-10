'use client'

import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useGetHospitals, useCreateHospital, useDeleteHospital } from '@/hooks/use-api/use-hospitals'
import { getColumns } from '@/components/hospital/columns'
import { DataTable } from '@/components/hospital/data-table'
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
import { HospitalForm } from '@/components/hospital/hospital-form'
import { HospitalToolbar } from '../../../../components/hospital/hospital-toolbar'
import { EditHospitalDialog } from '../../../../components/hospital/edit-hospital-dialog'
import { ConfirmationDialog } from '@/components/common/confirmation-dialog'
import { CreateHospitalDto, Hospital, UpdateHospitalDto } from '@/types/hospital'

export default function HospitalsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingHospital, setDeletingHospital] = useState<Hospital | null>(null)

  const { data: hospitalsData, isLoading, error } = useGetHospitals({
    search: debouncedSearchTerm,
    ...(statusFilter !== 'all' && { isActive: statusFilter === 'true' }),
  })

  const createHospitalMutation = useCreateHospital(() => {
    setIsAddDialogOpen(false)
  })

  const deleteHospitalMutation = useDeleteHospital(() => {
    setIsDeleteDialogOpen(false)
  })

  const handleCreateHospital = (data: CreateHospitalDto | UpdateHospitalDto) => {
    createHospitalMutation.mutate(data as CreateHospitalDto);
  };

  if (error) return <div>An error occurred: {error.message}</div>

  const hospitals = hospitalsData?.data || []

  const handleEditClick = (hospital: Hospital) => {
    setEditingHospital(hospital)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (hospital: Hospital) => {
    setDeletingHospital(hospital)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (deletingHospital) {
      deleteHospitalMutation.mutate(deletingHospital._id)
    }
  }

  const columns = getColumns({ onEdit: handleEditClick, onDelete: handleDeleteClick })

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-6'>Hospital Management</h1>
      <div className="flex items-center justify-between mb-4">
        <HospitalToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          onReset={handleReset}
        />
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={columns} data={hospitals} />
      )}
      <EditHospitalDialog
        hospital={editingHospital}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deletingHospital?.name}`}
        description="Are you sure you want to delete this hospital? This action cannot be undone."
        isConfirming={deleteHospitalMutation.isPending}
      />
    </div>
  )
}
