import { HospitalQueryDto, BloodInventoryItem, BloodType, BloodComponent } from './hospital.d'

interface HospitalInfo {
  id: string
  name: string
}

// The structure for the summary data returned by the API
export interface BloodInventorySummary {
  totalQuantity: number
  hospitals: HospitalInfo[]
  bloodType: string
  component: string
  hospitalCount: number
}

// Query DTO for blood inventory, can be extended later
export type BloodInventoryQueryDto = Pick<
  HospitalQueryDto,
  'province' | 'district' | 'ward' | 'bloodType' | 'component'
>

// DTOs for blood inventory management
export interface CreateBloodInventoryItemDto {
  bloodType: BloodType
  component: BloodComponent
  quantity: number
  expiresAt: string
}

export interface UpdateBloodInventoryItemDto extends CreateBloodInventoryItemDto {
  _id: string
}

export interface BloodInventoryManagementItem extends BloodInventoryItem {
  hospitalId: string
  hospitalName: string
  hospitalAddress: string
}

// For table display
export interface BloodInventoryTableItem {
  _id?: string
  hospitalId: string
  hospitalName: string
  hospitalAddress: string
  bloodType: BloodType
  component: BloodComponent
  quantity: number
  expiresAt: string
  isExpiringSoon?: boolean // Expires within 7 days
}

// Form data for creating/editing
export interface BloodInventoryFormData {
  hospitalId: string
  bloodType: BloodType
  component: BloodComponent
  quantity: number
  expiresAt: string
}

// For bulk operations
export interface UpdateBloodInventoryDto {
  bloodInventory: BloodInventoryItem[]
}

export interface AddBloodInventoryDto {
  item: CreateBloodInventoryItemDto
}
