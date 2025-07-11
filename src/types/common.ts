import { z } from 'zod'

export const responeSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.any().optional()
})

export type ResponseDto = z.infer<typeof responeSchema>
