import { z } from 'zod';
import { BloodType, BloodComponent } from '@/types/constants';

export const bloodInventorySchema = z.object({
  hospitalId: z.string().min(1, 'Please select a hospital'),
  bloodType: z.nativeEnum(BloodType, {
    errorMap: () => ({ message: 'Please select a valid blood type' })
  }),
  component: z.nativeEnum(BloodComponent, {
    errorMap: () => ({ message: 'Please select a valid blood component' })
  }),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(9999, 'Quantity cannot exceed 9999'),
  expiresAt: z
    .string()
    .min(1, 'Expiration date is required')
    .refine((date) => {
      const expiryDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return expiryDate > today
    }, 'Expiration date must be in the future')
})

export type BloodInventoryFormSchema = z.infer<typeof bloodInventorySchema>

// Blood type options for select components
export const bloodTypeOptions = [
  { value: BloodType.O_NEGATIVE, label: 'O-' },
  { value: BloodType.O_POSITIVE, label: 'O+' },
  { value: BloodType.A_NEGATIVE, label: 'A-' },
  { value: BloodType.A_POSITIVE, label: 'A+' },
  { value: BloodType.B_NEGATIVE, label: 'B-' },
  { value: BloodType.B_POSITIVE, label: 'B+' },
  { value: BloodType.AB_NEGATIVE, label: 'AB-' },
  { value: BloodType.AB_POSITIVE, label: 'AB+' }
]

// Blood component options for select components
export const bloodComponentOptions = [
  { value: BloodComponent.WHOLE_BLOOD, label: 'Whole Blood' },
  { value: BloodComponent.RED_CELLS, label: 'Red Blood Cells' },
  { value: BloodComponent.PLATELETS, label: 'Platelets' },
  { value: BloodComponent.PLASMA, label: 'Plasma' }
]
