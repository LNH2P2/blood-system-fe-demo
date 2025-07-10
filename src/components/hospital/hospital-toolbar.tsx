'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X } from 'lucide-react'

interface HospitalToolbarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  onReset: () => void
}

export function HospitalToolbar({ 
  searchTerm, 
  onSearchChange, 
  status,
  onStatusChange,
  onReset 
}: HospitalToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="Filter hospitals by name, address..."
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        className="flex-1 min-w-[200px]"
      />
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="true">Active</SelectItem>
          <SelectItem value="false">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={onReset} variant="outline">
        Reset
      </Button>
    </div>
  )
}
