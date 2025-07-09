import { z } from 'zod'
export const fileSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.string().url().optional()
})

export type FileResponse = z.infer<typeof fileSchema>
