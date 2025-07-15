import { z } from 'zod'
export const BloodTypeEnum = z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])

export type BloodType = z.infer<typeof BloodTypeEnum>
