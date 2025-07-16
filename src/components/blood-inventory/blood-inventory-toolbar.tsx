'use client';

import { Button } from '@/components/ui/button';
import { BloodInventoryQueryDto } from '@/types/blood-inventory.d';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BloodInventoryToolbarProps {
  filters: BloodInventoryQueryDto;
  onFiltersChange: (filters: BloodInventoryQueryDto) => void;
  onReset: () => void;
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const components = ['Red Blood Cells', 'Plasma', 'Platelets', 'Whole Blood'];

export function BloodInventoryToolbar({ filters, onFiltersChange, onReset }: BloodInventoryToolbarProps) {
  const handleFilterChange = (field: keyof BloodInventoryQueryDto, value: string) => {
    const newFilters = { ...filters, [field]: value === 'all' ? undefined : value };
    onFiltersChange(newFilters);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={filters.bloodType || 'all'} onValueChange={(value) => handleFilterChange('bloodType', value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Blood Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Blood Types</SelectItem>
          {bloodTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.component || 'all'} onValueChange={(value) => handleFilterChange('component', value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Component" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Components</SelectItem>
          {components.map(comp => <SelectItem key={comp} value={comp}>{comp}</SelectItem>)}
        </SelectContent>
      </Select>

      <Button onClick={onReset} variant="outline">
        Reset Filters
      </Button>
    </div>
  );
}
