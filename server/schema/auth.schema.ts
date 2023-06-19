// [NUXT/PRISMA]: Move to root folder

import { z } from 'zod'

export const adminLoginSchema = z.object({
  email: z.string()
})
type AdminLoginInput = z.infer<typeof adminLoginSchema>

export type { AdminLoginInput }
