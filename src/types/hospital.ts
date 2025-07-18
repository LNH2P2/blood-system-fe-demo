
import { z } from 'zod'

// ----------------- ENUMS -----------------
export const BloodTypeEnum = z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
export const BloodComponentEnum = z.enum(['whole_blood', 'red_cells', 'plasma', 'platelets'])
export type BloodType = z.infer<typeof BloodTypeEnum>
export type BloodComponent = z.infer<typeof BloodComponentEnum>

// ----------------- NESTED SCHEMAS -----------------
export const BloodInventorySchema = z.object({
  bloodType: BloodTypeEnum,
  component: BloodComponentEnum,
  quantity: z.number().min(0),
  expiresAt: z.coerce.date()
})

export const ContactInfoSchema = z.object({
  phone: z.string().regex(/^(\+84|0)[0-9]{9,10}$/, {
    message: 'Invalid Vietnamese phone number format'
  }),
  email: z.string().email().optional()
})

export const CoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
})

// ----------------- HOSPITAL SCHEMAS -----------------
export const HospitalSchema = z.object({
  _id: z.string(),
  name: z.string(),
  address: z.string(),
  province: z.string(),
  district: z.string(),
  ward: z.string(),
  contactInfo: ContactInfoSchema,
  operatingHours: z.string().optional(),
  services: z.array(z.string()),
  bloodInventory: z.array(BloodInventorySchema).optional(),
  emergencyContact: z.string(),
  description: z.string(),
  coordinates: CoordinatesSchema,
  isActive: z.boolean().optional(),
  licenseNumber: z.string().optional(),
  establishedDate: z.coerce.date().optional(),
  isDeleted: z.boolean(),
  createdAtBy: z.string().nullable(),
  updatedAtBy: z.string().nullable(),
  isDeletedBy: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  __v: z.number()
})

// ----------------- SHORT VERSION -----------------
export const HospitalShortSchema = z.object({
  _id: z.string(),
  name: z.string(),
  address: z.string(),
  province: z.string(),
  district: z.string(),
  ward: z.string()
})

// ----------------- PAGINATION -----------------
export const PaginationSchema = z.object({
  limit: z.number(),
  currentPage: z.number(),
  totalRecords: z.number(),
  totalPages: z.number()
})

// Pagination base
export const PageOptionsSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10)
})

// ----------------- RESPONSE WRAPPERS -----------------
export const HospitalResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.array(HospitalSchema),
  pagination: PaginationSchema
})

export const HospitalResponseOneSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: HospitalSchema
})

export const HospitalResponseNameSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.array(
    z.object({
      _id: z.string(),
      name: z.string()
    })
  )
})
// ----------------- QUERY SCHEMA -----------------
export const HospitalQuerySchema = PageOptionsSchema.extend({
  search: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
  bloodType: BloodTypeEnum.optional(),
  component: BloodComponentEnum.optional(),
  isActive: z
    .union([z.literal('true'), z.literal('false'), z.boolean()])
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : val))
    .optional()
})

// ----------------- TYPES -----------------
export type BloodInventory = z.infer<typeof BloodInventorySchema>
export type ContactInfo = z.infer<typeof ContactInfoSchema>
export type Coordinates = z.infer<typeof CoordinatesSchema>
export type Hospital = z.infer<typeof HospitalSchema>
export type HospitalResponse = z.infer<typeof HospitalResponseSchema>
export type Pagination = z.infer<typeof PaginationSchema>
export type HospitalShort = z.infer<typeof HospitalShortSchema>
export type HospitalQuery = z.infer<typeof HospitalQuerySchema>
export type HospitalResponseName = z.infer<typeof HospitalResponseNameSchema>
export type HospitalResponseOne = z.infer<typeof HospitalResponseOneSchema>
// Reuse for DTOs
export const CreateHospitalSchema = HospitalSchema.omit({
  _id: true,
  isDeleted: true,
  createdAtBy: true,
  updatedAtBy: true,
  isDeletedBy: true,
  createdAt: true,
  updatedAt: true,
  __v: true
})
export type CreateHospitalDto = z.infer<typeof CreateHospitalSchema>

export const UpdateHospitalSchema = CreateHospitalSchema.partial()
export type UpdateHospitalDto = z.infer<typeof UpdateHospitalSchema>

export type HospitalListResponse = z.infer<typeof HospitalResponseSchema>
