'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { BloodInventoryTableItem } from '@/types/blood-inventory.d'
import { format } from 'date-fns'
import { bloodTypeOptions, bloodComponentOptions } from '@/validations/blood-inventory'

interface ColumnActionsProps {
  item: BloodInventoryTableItem
  onEdit: (item: BloodInventoryTableItem) => void
  onDelete: (item: BloodInventoryTableItem) => void
}

const ColumnActions = ({ item, onEdit, onDelete }: ColumnActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => onEdit(item)}>
          <Edit className='mr-2 h-4 w-4' />
          Chỉnh sửa
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(item)} className='text-red-600'>
          <Trash2 className='mr-2 h-4 w-4' />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const createBloodInventoryColumns = (
  onEdit: (item: BloodInventoryTableItem) => void,
  onDelete: (item: BloodInventoryTableItem) => void
): ColumnDef<BloodInventoryTableItem>[] => [
  {
    accessorKey: 'hospitalName',
    header: 'Hospital',
    cell: ({ row }) => {
      const item = row.original
      return (
        <div>
          <div className='font-medium'>{item.hospitalName}</div>
          <div className='text-sm text-muted-foreground'>{item.hospitalAddress}</div>
        </div>
      )
    }
  },
  {
    accessorKey: 'bloodType',
    header: 'Blood Type',
    cell: ({ row }) => {
      const bloodType = row.getValue('bloodType') as string
      const option = bloodTypeOptions.find((opt) => opt.value === bloodType)
      return (
        <Badge variant='outline' className='font-mono'>
          {option?.label || bloodType}
        </Badge>
      )
    }
  },
  {
    accessorKey: 'component',
    header: 'Component',
    cell: ({ row }) => {
      const component = row.getValue('component') as string
      const option = bloodComponentOptions.find((opt) => opt.value === component)
      return <Badge variant='secondary'>{option?.label || component}</Badge>
    }
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: ({ row }) => {
      const quantity = row.getValue('quantity') as number
      return <span className='font-medium'>{quantity.toLocaleString()} ml</span>
    }
  },
  {
    accessorKey: 'expiresAt',
    header: 'Expires At',
    cell: ({ row }) => {
      const expiresAt = row.getValue('expiresAt') as string
      const isExpiringSoon = row.original.isExpiringSoon

      return (
        <div className='flex flex-col'>
          <span className={isExpiringSoon ? 'text-orange-600 font-medium' : ''}>
            {format(new Date(expiresAt), 'MMM dd, yyyy')}
          </span>
          {isExpiringSoon && (
            <Badge variant='outline' className='text-orange-600 border-orange-200 w-fit mt-1'>
              Expiring Soon
            </Badge>
          )}
        </div>
      )
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const item = row.original
      return <ColumnActions item={item} onEdit={onEdit} onDelete={onDelete} />
    }
  }
]
