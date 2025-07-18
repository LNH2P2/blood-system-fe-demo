export enum HospitalStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    ARCHIVED = 'archived'
}

export interface ContactInfo {
    phone: string
    email?: string
}

export interface Coordinates {
    latitude: number
    longitude: number
}

export interface Hospital {
    _id: string
    name: string
    address: string
    province: string
    district: string
    ward: string
    contactInfo: ContactInfo
    operatingHours: string
    services: string[]
    bloodInventory: any[]  // Dữ liệu này có thể bổ sung sau khi biết rõ hơn về kiểu của nó
    emergencyContact: string
    description: string
    coordinates: Coordinates
    isActive: boolean
    licenseNumber?: string
    establishedDate?: Date
    isDeleted: boolean
    createdAtBy: { _id: string; email: string }
    updatedAtBy: { _id: string; email: string }
    isDeletedBy: { _id: string; email: string }
    status?: HospitalStatus
    viewCount?: number
    createdAt: string
    updatedAt: string
    __v?: number
}

export interface CreateHospitalDto {
    name: string
    address: string
    province: string
    district: string
    ward: string
    contactInfo: ContactInfo
    operatingHours: string
    services: string[]
    bloodInventory: any[]
    emergencyContact: string
    description: string
    coordinates: Coordinates
    status: HospitalStatus
}

export interface UpdateHospitalDto {
    name?: string
    address?: string
    province?: string
    district?: string
    ward?: string
    contactInfo?: ContactInfo
    operatingHours?: string
    services?: string[]
    bloodInventory?: any[]
    emergencyContact?: string
    description?: string
    coordinates?: Coordinates
    status?: HospitalStatus
}

export interface HospitalListResponse {
    statusCode: number
    message: string
    data: {
        data: Hospital[]
        pagination: {
            limit: number
            currentPage: number
            totalRecords: number
            totalPages: number
        }
        statusCounts: {
            active: number
            inactive: number
            archived: number
        }
        latestUpdatedAt: string
    }
}

export interface HospitalFilters {
    status?: HospitalStatus
    q?: string
    order?: 'asc' | 'desc'
    page?: number
    limit?: number
}
