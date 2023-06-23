import { z } from 'zod'

export const adminLoginSchema = z.object({
  email: z.string()
})

export type AdminLoginInput = z.infer<typeof adminLoginSchema>
