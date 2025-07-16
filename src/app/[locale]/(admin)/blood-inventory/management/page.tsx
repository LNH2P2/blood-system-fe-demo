'use client'

import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { BloodInventoryFilters } from '@/components/blood-inventory/blood-inventory-filters'
import { BloodInventoryManagementTable } from '@/components/blood-inventory/blood-inventory-management-table'
import { BloodInventoryForm } from '@/components/blood-inventory/blood-inventory-form'
import { BloodInventoryDeleteDialog } from '@/components/blood-inventory/blood-inventory-delete-dialog'
import { createBloodInventoryColumns } from '@/components/blood-inventory/blood-inventory-management-columns'
import { useGetHospitalsWithInventory } from '@/hooks/use-api/use-blood-inventory'
import { HospitalQueryDto } from '@/types/hospital.d'
import { BloodInventoryTableItem } from '@/types/blood-inventory.d'
import { Skeleton } from '@/components/ui/skeleton'

export default function BloodInventoryManagementPage() {
  const [filters, setFilters] = useState<HospitalQueryDto>({})
  const [debouncedFilters] = useDebounce(filters, 500)

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<BloodInventoryTableItem | null>(null)

  // Delete state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<BloodInventoryTableItem | null>(null)

  const { data: inventoryData, isLoading, error, refetch } = useGetHospitalsWithInventory(debouncedFilters)

  const handleReset = () => {
    setFilters({})
  }

  const handleAddNew = () => {
    setEditItem(null)
    setIsFormOpen(true)
  }

  const handleEdit = (item: BloodInventoryTableItem) => {
    setEditItem(item)
    setIsFormOpen(true)
  }

  const handleDelete = (item: BloodInventoryTableItem) => {
    setDeleteItem(item)
    setIsDeleteDialogOpen(true)
  }

  const handleFormSuccess = () => {
    refetch()
  }

  const handleDeleteSuccess = () => {
    refetch()
  }

  const columns = createBloodInventoryColumns(handleEdit, handleDelete)

  return (
    <div className='container mx-auto py-6 space-y-6'>
      {/* Page Header */}
      <div>
        <h1 className='text-3xl font-bold'>Blood Inventory Management</h1>
        <p className='text-muted-foreground mt-2'>Manage blood inventory across all hospitals in the system</p>
      </div>

      {/* Filters */}
      <BloodInventoryFilters filters={filters} onFiltersChange={setFilters} onReset={handleReset} />

      {/* Data Table */}
      {isLoading ? (
        <div className='space-y-4'>
          <Skeleton className='h-20 w-full' />
          <Skeleton className='h-64 w-full' />
        </div>
      ) : error ? (
        <div className='text-red-500 text-center py-8'>Error loading blood inventory data: {error.message}</div>
      ) : (
        <BloodInventoryManagementTable
          columns={columns}
          data={inventoryData?.tableItems || []}
          isLoading={isLoading}
          onAddNew={handleAddNew}
          onRefresh={() => refetch()}
        />
      )}

      {/* Add/Edit Form Modal */}
      <BloodInventoryForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editItem={editItem}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <BloodInventoryDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        item={deleteItem}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
