'use client';

import { ColumnDef } from '@tanstack/react-table';
import { BloodInventorySummary } from '@/types/blood-inventory.d';
import { format } from 'date-fns';

export const columns: ColumnDef<BloodInventorySummary>[] = [
  {
    accessorKey: 'bloodType',
    header: 'Blood Type',
  },
  {
    accessorKey: 'component',
    header: 'Component',
  },
  {
    accessorKey: 'totalQuantity',
    header: 'Total Quantity',
    cell: ({ row }) => {
      const quantity = row.original.totalQuantity ?? 0;
      return `${quantity.toLocaleString()}`;
    },
  },
  {
    accessorKey: 'hospitalCount',
    header: 'Hospitals',
    cell: ({ row }) => {
      return `${row.original.hospitalCount} locations`;
    },
  },
];
