import { z } from 'zod'

const BloodTypeKeys = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const

export const DonationStatsSchema = z.object({
  month: z.string(),
  total: z.number(),
  'A+': z.number().default(0),
  'A-': z.number().default(0),
  'B+': z.number().default(0),
  'B-': z.number().default(0),
  'AB+': z.number().default(0),
  'AB-': z.number().default(0),
  'O+': z.number().default(0),
  'O-': z.number().default(0)
})

export const DonationStatsArraySchema = z.array(DonationStatsSchema)

export const DonationHistoryResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: DonationStatsArraySchema
})

export type DonationHistoryResponse = z.infer<typeof DonationHistoryResponseSchema>
export type DonationStats = z.infer<typeof DonationStatsSchema>
export type DonationStatsArray = z.infer<typeof DonationStatsArraySchema>
